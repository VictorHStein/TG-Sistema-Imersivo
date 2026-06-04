import { useEffect, useMemo, useRef, useState } from 'react';
import { useArchitectureStore } from '../../state/architectureStore';
import { validateArchitecture, type ValidationIssue } from '../../domain/parser/validateArchitecture';

/**
 * Interactive JSON builder.
 *
 * The user assembles their own architecture step-by-step:
 *  - left column: condensed reference + quick-add buttons that mutate the
 *    JSON in the editor
 *  - middle column: live JSON editor (textarea)
 *  - right column: validation status + apply / reset / load demo / start empty
 *
 * "Aplicar" parses + validates + loads into the global store, so the user
 * can switch to 2D/3D and immediately see what they wrote.
 */

const EMPTY_SKELETON = {
  metadata: { projectName: 'Minha Arquitetura', version: '0.1.0', description: '' },
  mission: { id: 'mission_x', name: 'Minha Missão', objectives: [] as string[] },
  categories: [
    { id: 'mission',      label: 'Missão',      color: '#a855f7', shape2D: 'hexagon',  shape3D: 'sphere' },
    { id: 'requirement',  label: 'Requisito',   color: '#2563eb', shape2D: 'document', shape3D: 'flatPanel' },
    { id: 'subsystem',    label: 'Subsistema',  color: '#22c55e', shape2D: 'group',    shape3D: 'box' },
  ],
  relationTypes: [
    { id: 'satisfies',         index: 1, label: 'Satisfaz requisito', color: '#2563eb', lineStyle: 'solid',  directed: true,  description: 'Source satisfaz o requisito target.' },
    { id: 'provides_power_to', index: 2, label: 'Fornece potência',   color: '#f59e0b', lineStyle: 'solid',  directed: true,  description: 'Source fornece energia para target.' },
  ],
  entities: [
    { id: 'mission_x', name: 'Minha Missão',  category: 'mission',     step: 1, description: '' },
  ],
  relations: [] as Array<Record<string, unknown>>,
  views: { defaultStep: 1, maxStep: 6 },
};

export function TutorialView() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const loadArchitectureFromJson = useArchitectureStore((s) => s.loadArchitectureFromJson);
  const setViewMode = useArchitectureStore((s) => s.setViewMode);
  const resetToDemo = useArchitectureStore((s) => s.resetToDemo);

  // Initial editor content: serialize the currently-loaded architecture
  // (strip derived fields so the user sees only what they would type).
  const initialText = useMemo(() => buildEditorText(architecture), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [text, setText] = useState(initialText);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Validate-as-you-type (cheap debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const parsed = JSON.parse(text);
        const result = validateArchitecture(parsed);
        if (result.ok) {
          setIssues([]);
          setStatus('ok');
        } else {
          setIssues(result.issues);
          setStatus('error');
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'JSON inválido';
        setIssues([{ path: '(raiz)', message: `JSON sintáticamente inválido: ${msg}` }]);
        setStatus('error');
      }
    }, 300);
    return () => clearTimeout(t);
  }, [text]);

  const onApply = () => {
    try {
      const raw = JSON.parse(text);
      loadArchitectureFromJson(raw, 'Construtor');
      setDirty(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'JSON inválido';
      setIssues([{ path: '(raiz)', message: msg }]);
      setStatus('error');
    }
  };

  const onStartEmpty = () => {
    setText(JSON.stringify(EMPTY_SKELETON, null, 2));
    setDirty(true);
  };

  const onLoadDemo = () => {
    resetToDemo();
    setTimeout(() => {
      const arch = useArchitectureStore.getState().architecture;
      setText(buildEditorText(arch));
      setDirty(false);
    }, 0);
  };

  const onResetToCurrent = () => {
    setText(buildEditorText(architecture));
    setDirty(false);
  };

  /* ── Quick-add helpers — mutate the JSON in the editor ─────── */
  const addCategory = () => mutate((doc) => {
    const n = (doc.categories?.length ?? 0) + 1;
    (doc.categories ||= []).push({
      id: `cat_${n}`,
      label: `Categoria ${n}`,
      color: pickColor(n),
      shape2D: 'box',
      shape3D: 'box',
    });
  });

  const addRelationType = () => mutate((doc) => {
    const existing = (doc.relationTypes ?? []).map((r: any) => Number(r.index || 0));
    const nextIndex = Math.max(0, ...existing) + 1;
    (doc.relationTypes ||= []).push({
      id: `rel_type_${nextIndex}`,
      index: nextIndex,
      label: `Relação ${nextIndex}`,
      color: pickColor(nextIndex + 6),
      lineStyle: 'solid',
      directed: true,
      description: 'Descreva o significado desta relação.',
    });
  });

  const addEntity = () => mutate((doc) => {
    const n = (doc.entities?.length ?? 0) + 1;
    const firstCat = (doc.categories ?? [])[0]?.id ?? 'subsystem';
    (doc.entities ||= []).push({
      id: `ent_${n}`,
      name: `Entidade ${n}`,
      category: firstCat,
      step: 1,
      description: '',
    });
  });

  const addRelation = () => mutate((doc) => {
    const n = (doc.relations?.length ?? 0) + 1;
    const ents: any[] = doc.entities ?? [];
    const types: any[] = doc.relationTypes ?? [];
    if (ents.length < 2 || types.length === 0) return;
    (doc.relations ||= []).push({
      id: `rel_${n}`,
      type: types[0].id,
      source: ents[0].id,
      target: ents[1].id,
      step: 1,
      label: '',
    });
  });

  function mutate(fn: (doc: any) => void) {
    try {
      const doc = JSON.parse(text);
      fn(doc);
      setText(JSON.stringify(doc, null, 2));
      setDirty(true);
      // focus the textarea so the user sees the new lines
      setTimeout(() => taRef.current?.focus(), 0);
    } catch {
      // ignore — current text is invalid JSON
    }
  }

  return (
    <div className="builder">
      <aside className="builder-aside">
        <div className="builder-aside__head">Construtor de JSON</div>
        <p className="builder-aside__lead">
          Monte sua própria arquitetura, do zero ou a partir da demo.
          Tudo que você escrever aqui é validado em tempo real; clique <strong>Aplicar</strong> para ver no Grafo 2D e na Cena 3D.
        </p>

        <Section title="Comece por">
          <button className="builder-btn" onClick={onStartEmpty}>Esqueleto mínimo</button>
          <button className="builder-btn" onClick={onLoadDemo}>Carregar demo</button>
          <button className="builder-btn builder-btn--ghost" onClick={onResetToCurrent}>
            Reverter para o que está aplicado
          </button>
        </Section>

        <Section title="Adicionar bloco">
          <button className="builder-btn" onClick={addCategory}>+ Categoria</button>
          <button className="builder-btn" onClick={addRelationType}>+ Tipo de relação (numerado)</button>
          <button className="builder-btn" onClick={addEntity}>+ Entidade</button>
          <button className="builder-btn" onClick={addRelation}>+ Relação</button>
        </Section>

        <Section title="O que cada bloco faz">
          <Help heading="categories">
            Define os <em>tipos de entidade</em> e seus visuais (cor, formato 2D e 3D). Os ids canônicos
            (<code>mission</code>, <code>requirement</code>, <code>function</code>, <code>subsystem</code>, <code>component</code>, <code>verification</code>)
            ganham anéis próprios no 3D.
          </Help>
          <Help heading="relationTypes">
            Cada tipo de relação tem um <strong>número único</strong> (campo <code>index</code>) que vira badge sobre cada
            aresta. <code>lineStyle</code> aceita <code>solid</code> · <code>dashed</code> · <code>dotted</code>. <code>directed</code> desenha a seta.
          </Help>
          <Help heading="entities">
            Os blocos. Precisam de <code>id</code>, <code>name</code>, <code>category</code>, <code>step</code>. Use <code>parentId</code> para hierarquia
            (gera o código <em>1.2.1</em>).
          </Help>
          <Help heading="relations">
            Arestas entre entidades. <code>type</code> aponta para um <code>relationTypes.id</code>;
            <code>source</code>/<code>target</code> apontam para <code>entities.id</code>. Quando as categorias dos endpoints diferem,
            a aresta fica visualmente mais pesada.
          </Help>
          <Help heading="views (opcional)">
            <code>defaultStep</code> define em que etapa o "Por etapas" começa. <code>maxStep</code> limita a timeline.
          </Help>
        </Section>

        <Section title="Regras de validação">
          <ul className="builder-rules">
            <li>Ids únicos em <code>entities</code>, <code>relations</code>, <code>relationTypes</code>, <code>categories</code>.</li>
            <li><code>index</code> único entre os tipos de relação.</li>
            <li><code>relation.source</code>/<code>target</code> precisam existir em <code>entities</code>.</li>
            <li><code>relation.type</code> precisa existir em <code>relationTypes</code>.</li>
            <li><code>entity.category</code> precisa existir em <code>categories</code>.</li>
            <li>Cores em hex (<code>#rgb</code> ou <code>#rrggbb</code>).</li>
          </ul>
        </Section>
      </aside>

      <section className="builder-editor">
        <header className="builder-editor__head">
          <div className="builder-editor__title">
            <span className="builder-dot" /> minha-arquitetura.json
            {dirty && <span className="builder-dirty">não aplicado</span>}
          </div>
          <div className="builder-editor__actions">
            <button
              className={`builder-btn builder-btn--primary${status === 'error' ? ' is-disabled' : ''}`}
              disabled={status === 'error'}
              onClick={onApply}
            >
              Aplicar &nbsp;&rarr;&nbsp; visualizar
            </button>
            <button className="builder-btn" onClick={() => { onApply(); setViewMode('2d'); }}>
              Aplicar e ir para 2D
            </button>
            <button className="builder-btn builder-btn--ghost" onClick={() => { onApply(); setViewMode('3d'); }}>
              Aplicar e ir para 3D
            </button>
          </div>
        </header>

        <textarea
          ref={taRef}
          className="builder-textarea"
          value={text}
          onChange={(e) => { setText(e.target.value); setDirty(true); }}
          spellCheck={false}
        />

        <footer className={`builder-status builder-status--${status}`}>
          {status === 'ok' && (
            <span>
              ✓ JSON válido — {(safeParseCount(text, 'entities'))} entidades,&nbsp;
              {(safeParseCount(text, 'relations'))} relações,&nbsp;
              {(safeParseCount(text, 'categories'))} categorias,&nbsp;
              {(safeParseCount(text, 'relationTypes'))} tipos de relação.
            </span>
          )}
          {status === 'error' && (
            <details open>
              <summary>✗ {issues.length} {issues.length === 1 ? 'problema' : 'problemas'} encontrado{issues.length === 1 ? '' : 's'}</summary>
              <ul className="builder-issues">
                {issues.slice(0, 10).map((i, k) => (
                  <li key={k}>
                    <code>{i.path}</code> — {i.message}
                  </li>
                ))}
                {issues.length > 10 && <li>… e mais {issues.length - 10}.</li>}
              </ul>
            </details>
          )}
          {status === 'idle' && <span>Aguardando JSON…</span>}
        </footer>
      </section>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function buildEditorText(arch: ReturnType<typeof useArchitectureStore.getState>['architecture']): string {
  if (!arch) return JSON.stringify(EMPTY_SKELETON, null, 2);
  // Strip the normalized-only fields before showing to the user
  const {
    entitiesById: _e, relationTypesById: _r, categoriesById: _c,
    maxStep: _m, relationsByEntity: _rbe, breakdownCodes: _bc, traceById: _t,
    ...input
  } = arch;
  void _e; void _r; void _c; void _m; void _rbe; void _bc; void _t;
  return JSON.stringify(input, null, 2);
}

function safeParseCount(text: string, key: string): number {
  try {
    const doc = JSON.parse(text);
    const arr = doc?.[key];
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

const COLOR_PALETTE = [
  '#a855f7', '#2563eb', '#14b8a6', '#22c55e', '#eab308',
  '#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#64748b',
  '#dc2626', '#16a34a', '#0ea5e9', '#ec4899', '#84cc16',
];
function pickColor(seed: number): string {
  return COLOR_PALETTE[(seed - 1 + COLOR_PALETTE.length) % COLOR_PALETTE.length];
}

/* ── Small UI atoms ────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="builder-section">
      <div className="builder-section__head">{title}</div>
      <div className="builder-section__body">{children}</div>
    </div>
  );
}

function Help({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="builder-help">
      <div className="builder-help__head">{heading}</div>
      <div className="builder-help__body">{children}</div>
    </div>
  );
}
