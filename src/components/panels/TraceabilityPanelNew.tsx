import { useArchitectureStore } from '../../store/useArchitectureStore';
import { buildUpwardChain, buildDownwardChain } from '../../utils/traceability';
import { ENTITY_ACCENT } from '../../types/architecture';

export function TraceabilityPanelNew() {
  const { model, selectedId, setSelectedId } = useArchitectureStore();
  const entity = model.entities.find((e) => e.id === selectedId);

  if (!entity) {
    return (
      <div className="panel-body" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        Select an entity to trace.
      </div>
    );
  }

  const upChain = buildUpwardChain(entity.id, model);
  const downChain = buildDownwardChain(entity.id, model).slice(1); // exclude root

  // Find what requirements this entity satisfies (if it's a function/component)
  const satisfiesRels = model.relations.filter(
    (r) => r.source === entity.id && r.type === 'satisfies',
  );
  const verifiedByRels = model.relations.filter(
    (r) => r.target === entity.id && (r.type === 'verifies' || r.type === 'validates'),
  );

  return (
    <div className="panel-body">
      {/* Upward chain */}
      <div className="rel-section__title" style={{ marginBottom: 8 }}>Hierarchy Chain (up)</div>
      <div className="trace-chain" style={{ marginBottom: 20 }}>
        {upChain.map((node, i) => {
          const accent = ENTITY_ACCENT[node.entity.type] ?? '#94a3b8';
          const isRoot = node.entity.id === entity.id;
          return (
            <div key={node.entity.id}>
              {i > 0 && <div className="trace-connector" />}
              <div
                className={`trace-node${isRoot ? ' root' : ''}`}
                onClick={() => setSelectedId(node.entity.id)}
              >
                <div className="trace-node__dot" style={{ background: accent }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="trace-node__label">{node.entity.name}</div>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {node.entity.type} · {node.entity.id}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Downward chain */}
      {downChain.length > 0 && (
        <>
          <div className="rel-section__title" style={{ marginBottom: 8 }}>Children (contains)</div>
          <div className="trace-chain" style={{ marginBottom: 20 }}>
            {downChain.map((node) => {
              const accent = ENTITY_ACCENT[node.entity.type] ?? '#94a3b8';
              return (
                <div
                  key={node.entity.id}
                  className="trace-node"
                  onClick={() => setSelectedId(node.entity.id)}
                >
                  <div className="trace-node__dot" style={{ background: accent }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="trace-node__label">{node.entity.name}</div>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {node.entity.type} · {node.entity.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Satisfies */}
      {satisfiesRels.length > 0 && (
        <>
          <div className="rel-section__title" style={{ marginBottom: 8, color: 'var(--c-requirement)' }}>
            Satisfies requirements
          </div>
          <div className="trace-chain" style={{ marginBottom: 20 }}>
            {satisfiesRels.map((rel) => {
              const req = model.entities.find((e) => e.id === rel.target);
              if (!req) return null;
              return (
                <div
                  key={rel.id}
                  className="trace-node"
                  onClick={() => setSelectedId(req.id)}
                >
                  <div className="trace-node__dot" style={{ background: 'var(--c-requirement)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="trace-node__label">{req.name}</div>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {req.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Verified by */}
      {verifiedByRels.length > 0 && (
        <>
          <div className="rel-section__title" style={{ marginBottom: 8, color: 'var(--c-verification)' }}>
            Verified / Validated by
          </div>
          <div className="trace-chain">
            {verifiedByRels.map((rel) => {
              const verifier = model.entities.find((e) => e.id === rel.source);
              if (!verifier) return null;
              return (
                <div
                  key={rel.id}
                  className="trace-node"
                  onClick={() => setSelectedId(verifier.id)}
                >
                  <div className="trace-node__dot" style={{ background: 'var(--c-verification)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="trace-node__label">{verifier.name}</div>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {verifier.type} · {verifier.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
