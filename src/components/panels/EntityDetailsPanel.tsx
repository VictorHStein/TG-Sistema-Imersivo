import { useArchitectureStore } from '../../store/useArchitectureStore';
import { getEntityRelations } from '../../utils/relationUtils';
import { ENTITY_ACCENT, RELATION_COLORS } from '../../types/architecture';

export function EntityDetailsPanel() {
  const { model, selectedId, setSelectedId } = useArchitectureStore();
  const entity = model.entities.find((e) => e.id === selectedId);
  if (!entity) return <div className="panel-body" style={{ color: 'var(--text-muted)' }}>No entity selected.</div>;

  const { outgoing, incoming } = getEntityRelations(entity.id, model);
  const accent = ENTITY_ACCENT[entity.type] ?? '#94a3b8';

  const resolveEntity = (id: string) => model.entities.find((e) => e.id === id);

  return (
    <div className="panel-body">
      {/* Header */}
      <div className="entity-header">
        <div className="entity-header__type-row">
          <span className="type-badge" data-type={entity.type}>{entity.type}</span>
          {entity.status && (
            <span className={`status-chip ${entity.status}`}>{entity.status}</span>
          )}
        </div>
        <div className="entity-name" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 8 }}>
          {entity.name}
        </div>
        <div className="entity-id">{entity.id}</div>
        {entity.description && (
          <div className="entity-desc">{entity.description}</div>
        )}
      </div>

      {/* Metadata */}
      {entity.metadata && Object.keys(entity.metadata).length > 0 && (
        <div className="rel-section">
          <div className="rel-section__title">Metadata</div>
          {Object.entries(entity.metadata).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 8, fontSize: 'var(--text-xs)', padding: '2px 0' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: 100, fontFamily: 'var(--font-mono)' }}>{k}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Budget entries */}
      {entity.budgets && entity.budgets.length > 0 && (
        <div className="rel-section">
          <div className="rel-section__title">Budgets</div>
          {entity.budgets.map((b, i) => {
            const pct = b.allocated > 0 ? Math.min((b.estimated / b.allocated) * 100, 100) : 0;
            const cls = pct >= 95 ? 'high' : pct >= 80 ? 'medium' : 'low';
            return (
              <div key={i} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{b.kind}</span>
                  <span>{b.estimated} / {b.allocated} {b.unit}</span>
                </div>
                <div className="budget-bar">
                  <div className={`budget-bar__fill ${cls}`} style={{ width: `${pct}%` }} />
                </div>
                {b.margin != null && (
                  <div className="budget-margin">margin: {b.margin}%</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Outgoing relations */}
      {outgoing.length > 0 && (
        <div className="rel-section">
          <div className="rel-section__title">Outgoing ({outgoing.length})</div>
          {outgoing.map((rel) => {
            const target = resolveEntity(rel.target);
            const color = RELATION_COLORS[rel.type] ?? '#475569';
            return (
              <div
                key={rel.id}
                className="rel-item"
                onClick={() => target && setSelectedId(target.id)}
              >
                <div className="rel-item__dot" style={{ background: color }} />
                <div className="rel-item__type" style={{ color }}>{rel.type.replace(/_/g, ' ')}</div>
                <div className="rel-item__name">{target?.name ?? rel.target}</div>
                <div className="rel-item__dir">→</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Incoming relations */}
      {incoming.length > 0 && (
        <div className="rel-section">
          <div className="rel-section__title">Incoming ({incoming.length})</div>
          {incoming.map((rel) => {
            const source = resolveEntity(rel.source);
            const color = RELATION_COLORS[rel.type] ?? '#475569';
            return (
              <div
                key={rel.id}
                className="rel-item"
                onClick={() => source && setSelectedId(source.id)}
              >
                <div className="rel-item__dot" style={{ background: color }} />
                <div className="rel-item__type" style={{ color }}>{rel.type.replace(/_/g, ' ')}</div>
                <div className="rel-item__name">{source?.name ?? rel.source}</div>
                <div className="rel-item__dir">←</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
