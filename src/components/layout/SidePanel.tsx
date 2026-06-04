import {
  useArchitectureStore,
  selectSelectedEntity,
  selectSelectedRelation,
} from '../../state/architectureStore';
import type {
  ArchitectureEntity,
  ArchitectureRelation,
  NormalizedArchitecture,
  TraceChain,
} from '../../domain/model/ArchitectureTypes';

/**
 * Contextual right-hand panel.
 *
 * - Nothing selected → overview of the mission, counts, budgets summary.
 * - Entity selected   → name, category, description, in/out relations, budgets, verifications.
 * - Relation selected → type, number, source/target, description, criticality.
 */
export function SidePanel() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectedEntity = useArchitectureStore(selectSelectedEntity);
  const selectedRelation = useArchitectureStore(selectSelectedRelation);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const focusSubsystem = useArchitectureStore((s) => s.focusSubsystem);
  const focusedSubsystemId = useArchitectureStore((s) => s.focusedSubsystemId);

  if (!architecture) return <aside className="side-panel" />;

  return (
    <aside className="side-panel">
      <div className="side-panel__header">
        <div className="side-panel__eyebrow">Painel de detalhes</div>
        {(selectedEntity || selectedRelation) && (
          <button
            className="side-panel__close"
            onClick={() => { selectEntity(null); }}
            aria-label="Fechar seleção"
          >
            ×
          </button>
        )}
      </div>

      <div className="side-panel__body">
        {selectedRelation && (
          <RelationDetails relation={selectedRelation} architecture={architecture} />
        )}

        {!selectedRelation && selectedEntity && (
          <EntityDetails
            entity={selectedEntity}
            architecture={architecture}
            onSelect={selectEntity}
            onFocus={focusSubsystem}
            focusedId={focusedSubsystemId}
          />
        )}

        {!selectedRelation && !selectedEntity && (
          <Overview architecture={architecture} onSelect={selectEntity} />
        )}
      </div>
    </aside>
  );
}

/* ── Overview ───────────────────────────────────────────────── */

function Overview({
  architecture,
  onSelect,
}: {
  architecture: NormalizedArchitecture;
  onSelect: (id: string) => void;
}) {
  const counts = architecture.categories.map((cat) => ({
    cat,
    n: architecture.entities.filter((e) => e.category === cat.id).length,
  }));

  return (
    <div className="side-overview">
      <h2 className="side-h2">{architecture.metadata.projectName}</h2>
      <div className="side-version">v{architecture.metadata.version}</div>
      {architecture.metadata.description && (
        <p className="side-paragraph">{architecture.metadata.description}</p>
      )}

      {architecture.mission && (
        <section className="side-section">
          <div className="side-section__title">Missão</div>
          <div className="side-section__big">{architecture.mission.name}</div>
          {architecture.mission.objectives && architecture.mission.objectives.length > 0 && (
            <ul className="side-bullets">
              {architecture.mission.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="side-section">
        <div className="side-section__title">Entidades por categoria</div>
        <ul className="side-cat-counts">
          {counts.map(({ cat, n }) => (
            <li key={cat.id} style={{ borderLeftColor: cat.color }}>
              <span className="cat-dot" style={{ background: cat.color }} />
              <span className="cat-name">{cat.label}</span>
              <span className="cat-n">{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="side-section">
        <div className="side-section__title">Tipos de relação</div>
        <ul className="side-rel-counts">
          {architecture.relationTypes.map((rt) => {
            const n = architecture.relations.filter((r) => r.type === rt.id).length;
            return (
              <li key={rt.id}>
                <span className="rel-badge" style={{ background: rt.color }}>{rt.index}</span>
                <span className="rel-label">{rt.label}</span>
                <span className="rel-n">{n}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {architecture.budgets && architecture.budgets.length > 0 && (
        <section className="side-section">
          <div className="side-section__title">Budgets</div>
          {architecture.budgets.map((b) => {
            const total = b.items.reduce((s, i) => s + i.value, 0);
            return (
              <div key={b.id} className="side-budget">
                <div className="side-budget__label">{b.label}</div>
                <div className="side-budget__total">{total.toFixed(1)} {b.unit}</div>
              </div>
            );
          })}
        </section>
      )}

      <section className="side-section">
        <div className="side-section__title">Atalho — destaque um subsistema</div>
        <div className="side-quick">
          {architecture.entities
            .filter((e) => e.category === 'subsystem')
            .map((e) => (
              <button
                key={e.id}
                className="side-quick-btn"
                onClick={() => onSelect(e.id)}
              >
                {e.name}
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}

/* ── Entity details ─────────────────────────────────────────── */

function EntityDetails({
  entity,
  architecture,
  onSelect,
  onFocus,
  focusedId,
}: {
  entity: ArchitectureEntity;
  architecture: NormalizedArchitecture;
  onSelect: (id: string) => void;
  onFocus: (id: string | null) => void;
  focusedId: string | null;
}) {
  const cat = architecture.categoriesById[entity.category];
  const rel = architecture.relationsByEntity[entity.id] ?? { incoming: [], outgoing: [] };
  const parent = entity.parentId ? architecture.entitiesById[entity.parentId] : undefined;
  const children = architecture.entities.filter((e) => e.parentId === entity.id);
  const verifications = (architecture.verifications ?? []).filter(
    (v) => v.requirementId === entity.id,
  );
  const code = architecture.breakdownCodes[entity.id] ?? entity.id;
  const trace = architecture.traceById[entity.id];

  return (
    <div className="side-entity">
      <div className="side-entity__cat" style={{ color: cat?.color }}>
        <span className="cat-dot" style={{ background: cat?.color }} />
        {cat?.label}
        <span className="side-entity__code" style={{ color: cat?.color, borderColor: `${cat?.color}55`, background: `${cat?.color}1a` }}>
          {code}
        </span>
      </div>
      <h2 className="side-h2">{entity.name}</h2>
      <div className="side-version">{entity.id} · etapa {entity.step}</div>
      {entity.description && <p className="side-paragraph">{entity.description}</p>}

      {trace && <TraceChainView trace={trace} architecture={architecture} onSelect={onSelect} currentId={entity.id} />}

      <button
        className={`focus-btn${focusedId === entity.id ? ' is-on' : ''}`}
        onClick={() => onFocus(focusedId === entity.id ? null : entity.id)}
      >
        {focusedId === entity.id ? 'Tirar foco' : 'Focar este elemento'}
      </button>

      {parent && (
        <section className="side-section">
          <div className="side-section__title">Pertence a</div>
          <button className="side-link-row" onClick={() => onSelect(parent.id)}>
            <span className="cat-dot" style={{ background: architecture.categoriesById[parent.category]?.color }} />
            <span className="link-text">{parent.name}</span>
            <span className="link-id">{parent.id}</span>
          </button>
        </section>
      )}

      {children.length > 0 && (
        <section className="side-section">
          <div className="side-section__title">Componentes deste subsistema</div>
          <ul className="side-children">
            {children.map((c) => (
              <li key={c.id}>
                <button className="side-link-row" onClick={() => onSelect(c.id)}>
                  <span className="cat-dot" style={{ background: architecture.categoriesById[c.category]?.color }} />
                  <span className="link-text">{c.name}</span>
                  <span className="link-id">{c.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {entity.budgets && entity.budgets.length > 0 && (
        <section className="side-section">
          <div className="side-section__title">Budgets locais</div>
          {entity.budgets.map((b, i) => {
            const pct = b.allocated > 0 ? Math.min(100, (b.estimated / b.allocated) * 100) : 0;
            const cls = pct >= 95 ? 'danger' : pct >= 80 ? 'warn' : 'ok';
            return (
              <div key={i} className="side-bar">
                <div className="side-bar__top">
                  <span>{b.kind}</span>
                  <span>{b.estimated} / {b.allocated} {b.unit}</span>
                </div>
                <div className="side-bar__track">
                  <div className={`side-bar__fill ${cls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      )}

      <RelationsList
        title={`Relações de saída (${rel.outgoing.length})`}
        relations={rel.outgoing}
        endpoint="target"
        architecture={architecture}
        onSelect={onSelect}
      />

      <RelationsList
        title={`Relações de entrada (${rel.incoming.length})`}
        relations={rel.incoming}
        endpoint="source"
        architecture={architecture}
        onSelect={onSelect}
      />

      {verifications.length > 0 && (
        <section className="side-section">
          <div className="side-section__title">Verificações associadas</div>
          <ul className="side-verifs">
            {verifications.map((v) => (
              <li key={v.id}>
                <div className="verif-head">
                  <span className={`verif-status verif-${v.status}`}>{v.status}</span>
                  <span>{v.method}{v.level ? ` · ${v.level}` : ''}</span>
                </div>
                {v.description && <div className="verif-desc">{v.description}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function RelationsList({
  title,
  relations,
  endpoint,
  architecture,
  onSelect,
}: {
  title: string;
  relations: ArchitectureRelation[];
  endpoint: 'source' | 'target';
  architecture: NormalizedArchitecture;
  onSelect: (id: string) => void;
}) {
  if (relations.length === 0) return null;
  return (
    <section className="side-section">
      <div className="side-section__title">{title}</div>
      <ul className="side-rel-list">
        {relations.map((r) => {
          const rt = architecture.relationTypesById[r.type];
          const otherId = endpoint === 'target' ? r.target : r.source;
          const other = architecture.entitiesById[otherId];
          return (
            <li key={r.id} className="side-rel-item" onClick={() => onSelect(otherId)}>
              <span className="rel-badge" style={{ background: rt.color }}>{rt.index}</span>
              <div className="rel-info">
                <div className="rel-info__top">
                  <span className="rel-info__type" style={{ color: rt.color }}>
                    {rt.label}
                  </span>
                  {r.criticality && (
                    <span className={`rel-crit crit-${r.criticality}`}>{r.criticality}</span>
                  )}
                </div>
                <div className="rel-info__other">
                  {endpoint === 'target' ? '→' : '←'}{' '}
                  {other?.name ?? otherId}
                </div>
                {r.label && <div className="rel-info__label">{r.label}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Trace chain (Mission → Req → Fn → Sub → Comp + Verifs) ─── */

function TraceChainView({
  trace,
  architecture,
  onSelect,
  currentId,
}: {
  trace: TraceChain;
  architecture: NormalizedArchitecture;
  onSelect: (id: string) => void;
  currentId: string;
}) {
  type Step = { key: string; label: string; entityId: string };
  const steps: Step[] = [];
  if (trace.mission)     steps.push({ key: 'M', label: 'Missão',      entityId: trace.mission });
  if (trace.requirement) steps.push({ key: 'R', label: 'Requisito',   entityId: trace.requirement });
  if (trace.function)    steps.push({ key: 'F', label: 'Função',      entityId: trace.function });
  if (trace.subsystem)   steps.push({ key: 'S', label: 'Subsistema',  entityId: trace.subsystem });
  if (trace.component)   steps.push({ key: 'C', label: 'Componente',  entityId: trace.component });

  if (steps.length === 0 && trace.verifications.length === 0) return null;

  return (
    <section className="side-section side-trace">
      <div className="side-section__title">Rastreabilidade</div>
      <div className="trace-chain">
        {steps.map((s, i) => {
          const ent = architecture.entitiesById[s.entityId];
          const cat = ent ? architecture.categoriesById[ent.category] : undefined;
          const code = architecture.breakdownCodes[s.entityId] ?? '';
          const isCurrent = s.entityId === currentId;
          return (
            <div key={s.key} className="trace-chain__row">
              <button
                className={`trace-chain__step${isCurrent ? ' is-current' : ''}`}
                style={{ borderColor: cat?.color, color: cat?.color }}
                onClick={() => onSelect(s.entityId)}
                title={ent?.name}
              >
                <span className="trace-chain__role">{s.label}</span>
                <span className="trace-chain__code">{code}</span>
                <span className="trace-chain__name">{ent?.name ?? s.entityId}</span>
              </button>
              {i < steps.length - 1 && <div className="trace-chain__arrow">▼</div>}
            </div>
          );
        })}
        {trace.verifications.length > 0 && (
          <>
            <div className="trace-chain__arrow">↩</div>
            <div className="trace-chain__verifs">
              <div className="trace-chain__verifs-head">Verificações fechando o loop</div>
              {trace.verifications.map((vid) => {
                const v = architecture.entitiesById[vid];
                const cat = v ? architecture.categoriesById[v.category] : undefined;
                const code = architecture.breakdownCodes[vid] ?? '';
                return (
                  <button
                    key={vid}
                    className={`trace-chain__step trace-chain__step--verif${vid === currentId ? ' is-current' : ''}`}
                    style={{ borderColor: cat?.color, color: cat?.color }}
                    onClick={() => onSelect(vid)}
                  >
                    <span className="trace-chain__role">Verifica</span>
                    <span className="trace-chain__code">{code}</span>
                    <span className="trace-chain__name">{v?.name ?? vid}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Relation details ───────────────────────────────────────── */

function RelationDetails({
  relation,
  architecture,
}: {
  relation: ArchitectureRelation;
  architecture: NormalizedArchitecture;
}) {
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const rt = architecture.relationTypesById[relation.type];
  const source = architecture.entitiesById[relation.source];
  const target = architecture.entitiesById[relation.target];
  const sCat = source ? architecture.categoriesById[source.category] : undefined;
  const tCat = target ? architecture.categoriesById[target.category] : undefined;

  return (
    <div className="side-relation">
      <div className="rel-head" style={{ borderColor: rt.color }}>
        <div className="rel-head__badge" style={{ background: rt.color }}>{rt.index}</div>
        <div className="rel-head__type" style={{ color: rt.color }}>{rt.label}</div>
      </div>

      <p className="side-paragraph">{rt.description}</p>

      <div className="rel-flow">
        <button className="rel-flow__end" onClick={() => source && selectEntity(source.id)} style={{ borderColor: sCat?.color }}>
          <div className="rel-flow__cat" style={{ color: sCat?.color }}>{sCat?.label}</div>
          <div className="rel-flow__name">{source?.name ?? relation.source}</div>
        </button>
        <div className="rel-flow__arrow">
          <svg width="40" height="12" viewBox="0 0 40 12">
            <line x1="0" y1="6" x2="34" y2="6" stroke={rt.color} strokeWidth={2}
              strokeDasharray={rt.lineStyle === 'dashed' ? '5 3' : rt.lineStyle === 'dotted' ? '2 3' : ''}
            />
            {rt.directed && <polygon points="30,2 40,6 30,10" fill={rt.color} />}
          </svg>
        </div>
        <button className="rel-flow__end" onClick={() => target && selectEntity(target.id)} style={{ borderColor: tCat?.color }}>
          <div className="rel-flow__cat" style={{ color: tCat?.color }}>{tCat?.label}</div>
          <div className="rel-flow__name">{target?.name ?? relation.target}</div>
        </button>
      </div>

      {relation.label && (
        <div className="rel-line">
          <span className="rel-line__title">Rótulo</span>
          <span className="rel-line__value">{relation.label}</span>
        </div>
      )}
      {relation.description && (
        <div className="rel-line">
          <span className="rel-line__title">Descrição</span>
          <span className="rel-line__value">{relation.description}</span>
        </div>
      )}
      <div className="rel-line">
        <span className="rel-line__title">Aparece na etapa</span>
        <span className="rel-line__value">{relation.step}</span>
      </div>
      {relation.criticality && (
        <div className="rel-line">
          <span className="rel-line__title">Criticidade</span>
          <span className={`rel-line__value crit-${relation.criticality}`}>{relation.criticality}</span>
        </div>
      )}

      {source && target && source.category !== target.category && (
        <div className="rel-cross">
          Esta relação cruza categorias ({sCat?.label} → {tCat?.label}) — interface importante de sistema.
        </div>
      )}
    </div>
  );
}
