/**
 * Light natural-language command parser for the Construtor.
 *
 * Recognizes simple imperatives in Portuguese (and a bit of English),
 * maps them to a mutation that the Construtor applies to the JSON.
 *
 * It is INTENTIONALLY heuristic — there is no LLM call. The point is to
 * cover the most common authoring gestures with one-line commands or
 * voice phrases so non-developers can build the JSON without typing it.
 */

export interface AnyDoc {
  metadata?: Record<string, unknown>;
  categories?: Array<Record<string, unknown>>;
  relationTypes?: Array<Record<string, unknown>>;
  entities?: Array<Record<string, unknown>>;
  relations?: Array<Record<string, unknown>>;
  [k: string]: unknown;
}

export type Mutation = (doc: AnyDoc) => void;

export interface ParseResult {
  ok: boolean;
  /** Short user-facing summary of what was interpreted. */
  description: string;
  /** Mutator to run against the JSON document; null if !ok. */
  mutation: Mutation | null;
}

const COLOR_PALETTE = [
  '#a855f7', '#2563eb', '#14b8a6', '#22c55e', '#eab308',
  '#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#64748b',
  '#dc2626', '#16a34a', '#0ea5e9', '#ec4899', '#84cc16',
];
function pickColor(seed: number): string {
  return COLOR_PALETTE[(Math.abs(seed) + 1) % COLOR_PALETTE.length];
}

/** kebab-case-id slug from any free text */
function slug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'x';
}

/**
 * Find an entity by its id, name, breakdown code, or partial name match.
 */
function findEntity(doc: AnyDoc, query: string): { id: string } | null {
  const q = query.trim().toLowerCase();
  const ents = doc.entities ?? [];
  // Exact id
  for (const e of ents) {
    if (String((e as { id?: string }).id ?? '').toLowerCase() === q) {
      return { id: String((e as { id?: string }).id) };
    }
  }
  // Exact name
  for (const e of ents) {
    if (String((e as { name?: string }).name ?? '').toLowerCase() === q) {
      return { id: String((e as { id?: string }).id) };
    }
  }
  // Contains name
  for (const e of ents) {
    const n = String((e as { name?: string }).name ?? '').toLowerCase();
    if (n.includes(q)) return { id: String((e as { id?: string }).id) };
  }
  return null;
}

/**
 * Quick alias map → known category id. So "subsistema" / "subsystem" /
 * "sub" all resolve to "subsystem" if that category exists.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  missao: 'mission', missão: 'mission', mission: 'mission',
  requisito: 'requirement', requirement: 'requirement', req: 'requirement',
  funcao: 'function', função: 'function', function: 'function', func: 'function',
  subsistema: 'subsystem', subsystem: 'subsystem', sub: 'subsystem', subsis: 'subsystem',
  componente: 'component', component: 'component', comp: 'component',
  verificacao: 'verification', verificação: 'verification', verification: 'verification', ver: 'verification', verif: 'verification',
};

function resolveCategoryId(doc: AnyDoc, raw: string): string | null {
  const k = raw.toLowerCase().trim();
  const cats = (doc.categories ?? []) as Array<{ id?: string }>;
  // Exact id
  if (cats.some((c) => c.id === k)) return k;
  // Alias
  const aliased = CATEGORY_ALIASES[k];
  if (aliased && cats.some((c) => c.id === aliased)) return aliased;
  // Substring match on id
  const hit = cats.find((c) => String(c.id).toLowerCase().includes(k));
  return hit?.id ?? null;
}

function resolveRelationTypeId(doc: AnyDoc, raw: string): string | null {
  const k = raw.toLowerCase().trim();
  const types = (doc.relationTypes ?? []) as Array<{ id?: string; label?: string }>;
  // Exact id
  if (types.some((t) => t.id === k)) return k;
  // Alias for common synonyms
  const synonyms: Record<string, string[]> = {
    provides_power_to: ['potencia', 'potência', 'power', 'fornece potencia', 'fornece potência'],
    sends_data_to: ['dados', 'data', 'envia dados'],
    receives_command_from: ['comando', 'command', 'recebe comando'],
    mechanically_attached_to: ['mecanico', 'mecânica', 'mecanica', 'mechanical', 'fixacao', 'fixação'],
    thermally_coupled_to: ['termico', 'térmico', 'termica', 'térmica', 'thermal'],
    satisfies: ['satisfaz', 'satisfies'],
    allocated_to: ['alocado', 'allocated'],
    verifies: ['verifica', 'verifies'],
  };
  for (const [id, kws] of Object.entries(synonyms)) {
    if (kws.some((kw) => k.includes(kw)) && types.some((t) => t.id === id)) return id;
  }
  // Substring match on label
  const hit = types.find((t) =>
    String(t.label ?? '').toLowerCase().includes(k) ||
    String(t.id ?? '').toLowerCase().includes(k),
  );
  return hit?.id ?? null;
}

/* ── Patterns ──────────────────────────────────────────── */

const VERB_ADD = /^\s*(adicione?|adiciona|adicionar|criar?|crie|add|new|novo|nova)\b/i;
const VERB_DELETE = /^\s*(remover?|remova|deletar?|delete|apaga(r)?|excluir?|exclua)\b/i;
const VERB_RENAME = /^\s*(renomear?|renomeie|rename)\b/i;
const VERB_COLOR = /^\s*(mudar?|trocar?|change|set)\s+(a\s+)?cor\b/i;
const VERB_CLEAR = /^\s*(limpar|clear|reset|resetar|apaga(r)?\s+tudo|esvaziar)\b/i;
const VERB_HELP = /^\s*(ajuda|help|comandos|\?)/i;

/* ── Helpers to build the new entity/relation ─────────── */

function nextEntityId(doc: AnyDoc, name: string): string {
  const ents = doc.entities ?? [];
  let base = slug(name);
  if (!ents.some((e) => (e as { id?: string }).id === base)) return base;
  for (let i = 2; i < 9999; i++) {
    const cand = `${base}_${i}`;
    if (!ents.some((e) => (e as { id?: string }).id === cand)) return cand;
  }
  return `${base}_${Date.now()}`;
}

function nextRelationId(doc: AnyDoc, src: string, tgt: string): string {
  const rels = doc.relations ?? [];
  let base = `rel_${slug(src)}_${slug(tgt)}`;
  if (!rels.some((r) => (r as { id?: string }).id === base)) return base;
  for (let i = 2; i < 9999; i++) {
    const cand = `${base}_${i}`;
    if (!rels.some((r) => (r as { id?: string }).id === cand)) return cand;
  }
  return `${base}_${Date.now()}`;
}

/* ── Main entry point ──────────────────────────────────── */

export function parseCommand(rawInput: string, doc: AnyDoc): ParseResult {
  const input = rawInput.trim();
  if (!input) return { ok: false, description: '', mutation: null };

  if (VERB_HELP.test(input)) {
    return {
      ok: true,
      description: 'Comandos disponíveis ↓',
      mutation: null,
    };
  }

  if (VERB_CLEAR.test(input)) {
    return {
      ok: true,
      description: 'Limpando entidades e relações',
      mutation: (d) => {
        d.entities = [];
        d.relations = [];
      },
    };
  }

  if (VERB_DELETE.test(input)) {
    // delete entity X
    const m = input.match(/delet\w*\s+(?:a\s+|o\s+)?(?:entidade\s+|entity\s+)?(.+)$/i)
            ?? input.match(/remov\w*\s+(?:a\s+|o\s+)?(?:entidade\s+|entity\s+)?(.+)$/i)
            ?? input.match(/apag\w*\s+(?:a\s+|o\s+)?(?:entidade\s+|entity\s+)?(.+)$/i)
            ?? input.match(/exclu\w*\s+(?:a\s+|o\s+)?(?:entidade\s+|entity\s+)?(.+)$/i);
    if (m) {
      const query = m[1].trim();
      const hit = findEntity(doc, query);
      if (!hit) {
        return { ok: false, description: `Não achei "${query}"`, mutation: null };
      }
      return {
        ok: true,
        description: `Removendo entidade ${hit.id} e suas relações`,
        mutation: (d) => {
          d.entities = (d.entities ?? []).filter((e) => (e as { id?: string }).id !== hit.id);
          d.relations = (d.relations ?? []).filter((r) => {
            const rr = r as { source?: string; target?: string };
            return rr.source !== hit.id && rr.target !== hit.id;
          });
        },
      };
    }
  }

  if (VERB_RENAME.test(input)) {
    const m = input.match(/renome\w*\s+(.+?)\s+(?:para|to|→|->)\s+(.+)$/i);
    if (m) {
      const hit = findEntity(doc, m[1].trim());
      if (!hit) return { ok: false, description: `Não achei "${m[1]}"`, mutation: null };
      const newName = m[2].trim().replace(/^["']|["']$/g, '');
      return {
        ok: true,
        description: `Renomeando ${hit.id} → "${newName}"`,
        mutation: (d) => {
          for (const e of d.entities ?? []) {
            if ((e as { id?: string }).id === hit.id) {
              (e as { name?: string }).name = newName;
            }
          }
        },
      };
    }
  }

  if (VERB_COLOR.test(input)) {
    const m = input.match(/cor\s+(?:da|de|do)\s+(\S+).*?(#[0-9a-f]{3,6})/i);
    if (m) {
      const catId = resolveCategoryId(doc, m[1]);
      if (!catId) return { ok: false, description: `Categoria "${m[1]}" não existe`, mutation: null };
      const color = m[2];
      return {
        ok: true,
        description: `Mudando cor de ${catId} → ${color}`,
        mutation: (d) => {
          for (const c of d.categories ?? []) {
            if ((c as { id?: string }).id === catId) (c as { color?: string }).color = color;
          }
        },
      };
    }
  }

  if (VERB_ADD.test(input)) {
    // 1. Relation: "criar/adicionar relação <X> <verbo> <Y> [tipo Z]"
    const relMatch =
      input.match(/(?:relac\w+|relation)\s+(?:de\s+|entre\s+)?(.+?)\s+(?:para|to|→|->|com|liga\s+em|conecta(?:\s+a)?|liga\s+a)\s+(.+?)(?:\s+(?:tipo|type|com tipo)\s+(.+))?$/i);
    if (relMatch) {
      const srcQ = relMatch[1].trim();
      const tgtQ = relMatch[2].trim();
      const typeQ = (relMatch[3] ?? '').trim();
      const srcHit = findEntity(doc, srcQ);
      const tgtHit = findEntity(doc, tgtQ);
      if (!srcHit) return { ok: false, description: `Origem "${srcQ}" não existe`, mutation: null };
      if (!tgtHit) return { ok: false, description: `Destino "${tgtQ}" não existe`, mutation: null };
      const types = (doc.relationTypes ?? []) as Array<{ id?: string }>;
      if (types.length === 0) return { ok: false, description: 'Crie um tipo de relação antes', mutation: null };
      const typeId = (typeQ && resolveRelationTypeId(doc, typeQ)) ?? String(types[0].id);
      const id = nextRelationId(doc, srcHit.id, tgtHit.id);
      return {
        ok: true,
        description: `Conectando ${srcHit.id} → ${tgtHit.id} (${typeId})`,
        mutation: (d) => {
          (d.relations ||= []).push({
            id, type: typeId,
            source: srcHit.id, target: tgtHit.id,
            step: 8, label: '',
          });
        },
      };
    }

    // 2. Category
    const catMatch = input.match(/(?:categoria|category)\s+(?:chamada\s+|de\s+nome\s+)?(.+?)(?:\s+(?:com\s+)?cor\s+(#[0-9a-f]{3,6}))?$/i);
    if (catMatch) {
      const label = catMatch[1].trim().replace(/^["']|["']$/g, '');
      const id = slug(label);
      const color = catMatch[2] ?? pickColor((doc.categories ?? []).length);
      if ((doc.categories ?? []).some((c) => (c as { id?: string }).id === id)) {
        return { ok: false, description: `Categoria "${id}" já existe`, mutation: null };
      }
      return {
        ok: true,
        description: `Criando categoria "${label}" (${color})`,
        mutation: (d) => {
          (d.categories ||= []).push({ id, label, color, shape2D: 'box', shape3D: 'box' });
        },
      };
    }

    // 3. Relation type
    const relTypeMatch = input.match(/(?:tipo\s+de\s+relac\w+|relation\s+type)\s+(?:chamada\s+|chamado\s+)?(.+?)(?:\s+cor\s+(#[0-9a-f]{3,6}))?$/i);
    if (relTypeMatch) {
      const label = relTypeMatch[1].trim().replace(/^["']|["']$/g, '');
      const id = slug(label);
      const existing = (doc.relationTypes ?? []) as Array<{ index?: number; id?: string }>;
      if (existing.some((t) => t.id === id)) {
        return { ok: false, description: `Tipo "${id}" já existe`, mutation: null };
      }
      const nextIndex = Math.max(0, ...existing.map((t) => Number(t.index ?? 0))) + 1;
      const color = relTypeMatch[2] ?? pickColor(existing.length + 6);
      return {
        ok: true,
        description: `Criando tipo de relação #${nextIndex} "${label}"`,
        mutation: (d) => {
          (d.relationTypes ||= []).push({
            id, index: nextIndex, label, color,
            lineStyle: 'solid', directed: true,
            description: 'Descreva o significado desta relação.',
          });
        },
      };
    }

    // 4. Entity
    // "adicione entidade <nome> [tipo X] [sob/dentro de Y] [na etapa N]"
    // "adicione um/uma <tipo> <nome>" — implicit category
    let nameRaw = '';
    let typeRaw = '';
    let parentRaw = '';
    let stepRaw = '';

    // Pattern A: explicit "entidade <nome>"
    let m = input.match(
      /(?:entidade|entity)\s+(?:chamada\s+|de\s+nome\s+)?(.+?)(?:\s+(?:tipo|type|categoria)\s+(\S+))?(?:\s+(?:sob|under|dentro\s+de|em)\s+(\S+))?(?:\s+(?:na\s+etapa|step)\s+(\d+))?$/i,
    );
    if (m) {
      nameRaw = m[1]; typeRaw = m[2] ?? ''; parentRaw = m[3] ?? ''; stepRaw = m[4] ?? '';
    } else {
      // Pattern B: "adicione um subsistema chamado Bateria sob EPS"
      const m2 = input.match(
        /(?:adicione?|adicionar|criar?|crie|add|new|novo|nova)\s+(?:um|uma|o|a)?\s*(\S+?)\s+(?:chamado|chamada|com\s+nome|de\s+nome|named)\s+(.+?)(?:\s+(?:sob|under|dentro\s+de|em)\s+(\S+))?(?:\s+(?:na\s+etapa|step)\s+(\d+))?$/i,
      );
      if (m2) {
        typeRaw = m2[1]; nameRaw = m2[2]; parentRaw = m2[3] ?? ''; stepRaw = m2[4] ?? '';
      }
    }

    if (nameRaw) {
      const name = nameRaw.trim().replace(/^["']|["']$/g, '');
      const id = nextEntityId(doc, name);
      const cats = (doc.categories ?? []) as Array<{ id?: string }>;
      if (cats.length === 0) return { ok: false, description: 'Crie uma categoria antes', mutation: null };
      const category = (typeRaw && resolveCategoryId(doc, typeRaw)) ?? String(cats[0].id);
      let parentId: string | undefined;
      if (parentRaw) {
        const ph = findEntity(doc, parentRaw);
        if (!ph) return { ok: false, description: `Pai "${parentRaw}" não existe`, mutation: null };
        parentId = ph.id;
      }
      const step = stepRaw ? Number(stepRaw) : 1;
      return {
        ok: true,
        description: `Criando ${category} "${name}"${parentId ? ` sob ${parentId}` : ''}`,
        mutation: (d) => {
          const e: Record<string, unknown> = {
            id, name, category, step, description: '',
          };
          if (parentId) e.parentId = parentId;
          (d.entities ||= []).push(e);
        },
      };
    }
  }

  return {
    ok: false,
    description: 'Não entendi. Tente: "adicione subsistema chamado Bateria sob EPS"',
    mutation: null,
  };
}
