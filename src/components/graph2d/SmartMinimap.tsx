import { useMemo } from 'react';
import { useArchitectureStore, computeVisibleEntities } from '../../state/architectureStore';
import type { ArchitectureEntity, NormalizedArchitecture, TraceChain } from '../../domain/model/ArchitectureTypes';

/**
 * Floating panel that replaces React Flow's default minimap.
 *
 *  • When nothing is selected → "Mapa do JSON": a compact summary of every
 *    category with its entity count + a small dot-grid per row, plus the
 *    step / relation-type stats. Clicking a category jumps to the side
 *    panel filtered by it (toggling visibility).
 *
 *  • When an entity is selected → "Rastreabilidade": the trace chain
 *    (Mission → Requirement → Function → Subsystem → Component →
 *    Verifications) as a vertical cascade of clickable rows. Each row shows
 *    the PBS / R-/F-/V- code so the user can read off the breakdown
 *    without leaving the canvas.
 *
 * Replaces the React-Flow MiniMap which only ever showed coloured dots
 * and added very little to the layered swimlane layout.
 */
export function SmartMinimap() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectedEntityId = useArchitectureStore((s) => s.selectedEntityId);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const currentStep = useArchitectureStore((s) => s.currentStep);
  const explorationMode = useArchitectureStore((s) => s.explorationMode);
  const visibleCategories = useArchitectureStore((s) => s.visibleCategories);
  const toggleCategory = useArchitectureStore((s) => s.toggleCategory);
  const toggleMinimap = useArchitectureStore((s) => s.toggleMinimap);

  const visibleEntities = useMemo(
    () => computeVisibleEntities(architecture, visibleCategories, explorationMode, currentStep),
    [architecture, visibleCategories, explorationMode, currentStep],
  );

  if (!architecture) return null;

  const selectedEntity = selectedEntityId ? architecture.entitiesById[selectedEntityId] : null;
  const trace = selectedEntityId ? architecture.traceById[selectedEntityId] : null;

  return (
    <div className="smart-minimap">
      <div className="smart-minimap__head">
        <div className="smart-minimap__title">
          {selectedEntity ? 'Rastreabilidade' : 'Mapa do JSON'}
        </div>
        <button className="smart-minimap__close" onClick={toggleMinimap} title="Esconder">×</button>
      </div>

      <div className="smart-minimap__body">
        {selectedEntity && trace ? (
          <TraceCascade
            entity={selectedEntity}
            trace={trace}
            architecture={architecture}
            onSelect={selectEntity}
          />
        ) : (
          <JsonMap
            architecture={architecture}
            visibleCategories={visibleCategories}
            visibleEntities={visibleEntities}
            onToggleCategory={toggleCategory}
          />
        )}
      </div>
    </div>
  );
}

/* ── JSON Map (no selection) ───────────────────────────────── */

function JsonMap({
  architecture,
  visibleCategories,
  visibleEntities,
  onToggleCategory,
}: {
  architecture: NormalizedArchitecture;
  visibleCategories: Set<string>;
  visibleEntities: ArchitectureEntity[];
  onToggleCategory: (id: string) => void;
}) {
  const visibleByCat = new Map<string, number>();
  for (const e of visibleEntities) {
    visibleByCat.set(e.category, (visibleByCat.get(e.category) ?? 0) + 1);
  }

  return (
    <div className="json-map">
      {architecture.categories.map((cat) => {
        const total = architecture.entities.filter((e) => e.category === cat.id).length;
        const visible = visibleByCat.get(cat.id) ?? 0;
        const on = visibleCategories.has(cat.id);
        return (
          <button
            key={cat.id}
            className={`json-map__row${on ? '' : ' is-off'}`}
            onClick={() => onToggleCategory(cat.id)}
            title={on ? 'Ocultar categoria' : 'Mostrar categoria'}
            style={{ ['--row-color' as never]: cat.color }}
          >
            <span className="json-map__label">{cat.label}</span>
            <span className="json-map__dots">
              {Array.from({ length: Math.min(total, 14) }).map((_, i) => (
                <span
                  key={i}
                  className="json-map__dot"
                  style={{
                    background: i < visible ? cat.color : 'transparent',
                    borderColor: cat.color,
                    opacity: on ? 1 : 0.35,
                  }}
                />
              ))}
              {total > 14 && <span className="json-map__plus">+{total - 14}</span>}
            </span>
            <span className="json-map__count" style={{ color: on ? cat.color : 'var(--text-muted)' }}>
              {visible}/{total}
            </span>
          </button>
        );
      })}

      <div className="json-map__stats">
        <span>{architecture.relations.length} relações</span>
        <span>·</span>
        <span>{architecture.relationTypes.length} tipos</span>
        <span>·</span>
        <span>{architecture.maxStep} etapas</span>
      </div>
    </div>
  );
}

/* ── Trace cascade (entity selected) ──────────────────────── */

function TraceCascade({
  entity,
  trace,
  architecture,
  onSelect,
}: {
  entity: ArchitectureEntity;
  trace: TraceChain;
  architecture: NormalizedArchitecture;
  onSelect: (id: string) => void;
}) {
  type Step = { role: string; entityId: string };
  const steps: Step[] = [];
  if (trace.mission)     steps.push({ role: 'Missão',     entityId: trace.mission });
  if (trace.requirement) steps.push({ role: 'Requisito',  entityId: trace.requirement });
  if (trace.function)    steps.push({ role: 'Função',     entityId: trace.function });
  if (trace.subsystem)   steps.push({ role: 'Subsistema', entityId: trace.subsystem });
  if (trace.component)   steps.push({ role: 'Componente', entityId: trace.component });

  return (
    <div className="trace-cascade">
      <div className="trace-cascade__current">
        <span className="trace-cascade__current-code" style={{ color: architecture.categoriesById[entity.category]?.color }}>
          {architecture.breakdownCodes[entity.id]}
        </span>
        <span className="trace-cascade__current-name">{entity.name}</span>
      </div>

      <div className="trace-cascade__chain">
        {steps.map((s, i) => {
          const ent = architecture.entitiesById[s.entityId];
          const cat = ent ? architecture.categoriesById[ent.category] : undefined;
          const code = architecture.breakdownCodes[s.entityId] ?? '';
          const isCurrent = s.entityId === entity.id;
          return (
            <div key={`${s.role}-${i}`} className="trace-cascade__row-wrap">
              <button
                className={`trace-cascade__row${isCurrent ? ' is-current' : ''}`}
                style={{ borderColor: cat?.color }}
                onClick={() => onSelect(s.entityId)}
                title={ent?.name}
              >
                <span className="trace-cascade__role" style={{ color: cat?.color }}>{s.role}</span>
                <span className="trace-cascade__code">{code}</span>
                <span className="trace-cascade__name">{ent?.name ?? s.entityId}</span>
              </button>
              {i < steps.length - 1 && <div className="trace-cascade__arrow">↓</div>}
            </div>
          );
        })}

        {trace.verifications.length > 0 && (
          <>
            <div className="trace-cascade__arrow trace-cascade__arrow--back">↩</div>
            <div className="trace-cascade__verifs-head">Verificações fechando o loop</div>
            {trace.verifications.map((vid) => {
              const v = architecture.entitiesById[vid];
              const cat = v ? architecture.categoriesById[v.category] : undefined;
              const code = architecture.breakdownCodes[vid] ?? '';
              const isCurrent = vid === entity.id;
              return (
                <button
                  key={vid}
                  className={`trace-cascade__row trace-cascade__row--verif${isCurrent ? ' is-current' : ''}`}
                  style={{ borderColor: cat?.color }}
                  onClick={() => onSelect(vid)}
                >
                  <span className="trace-cascade__role" style={{ color: cat?.color }}>Verifica</span>
                  <span className="trace-cascade__code">{code}</span>
                  <span className="trace-cascade__name">{v?.name ?? vid}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
