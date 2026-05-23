import { useArchitectureStore } from '../../store/useArchitectureStore';
import type { VerificationEntry } from '../../types/architecture';

const METHOD_ABBR: Record<string, string> = {
  'Test': 'T',
  'Analysis': 'A',
  'Inspection': 'I',
  'Review of Design': 'RoD',
  'Demonstration': 'D',
};

const STATUS_ORDER: Record<string, number> = {
  failed: 0, in_progress: 1, planned: 2, draft: 3, passed: 4, verified: 5,
};

export function VerificationPanelNew() {
  const { model, setSelectedId } = useArchitectureStore();
  const verifs: VerificationEntry[] = model.verifications ?? [];

  const sorted = [...verifs].sort((a, b) =>
    (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
  );

  const stats = {
    passed: verifs.filter(v => v.status === 'passed' || v.status === 'verified').length,
    failed: verifs.filter(v => v.status === 'failed').length,
    inProgress: verifs.filter(v => v.status === 'in_progress').length,
    planned: verifs.filter(v => v.status === 'planned' || v.status === 'draft').length,
  };

  return (
    <div className="panel-body">
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Passed', count: stats.passed, color: '#4ade80' },
          { label: 'In Progress', count: stats.inProgress, color: '#38bdf8' },
          { label: 'Planned', count: stats.planned, color: '#94a3b8' },
          { label: 'Failed', count: stats.failed, color: '#f87171' },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1,
            background: 'var(--bg-card)',
            borderRadius: 4,
            padding: '8px 6px',
            textAlign: 'center',
            borderTop: `2px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>
              {s.count}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="rel-section__title" style={{ marginBottom: 8 }}>
        Verification Items ({verifs.length})
      </div>

      {sorted.map((v) => {
        const req = model.entities.find((e) => e.id === v.requirementId);
        const item = model.entities.find((e) => e.id === v.itemId);
        return (
          <div key={v.id} className="verif-item">
            <div className={`verif-status ${v.status}`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span className="verif-method">{METHOD_ABBR[v.method] ?? v.method}</span>
                <span style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}>{v.id}</span>
              </div>
              {req && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginBottom: 2,
                  }}
                  onClick={() => setSelectedId(req.id)}
                >
                  REQ: {req.name}
                </div>
              )}
              {item && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedId(item.id)}
                >
                  Item: {item.name}
                </div>
              )}
              {v.description && (
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>
                  {v.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
