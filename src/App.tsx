import { useState } from 'react';
import { MissionHeader } from './components/app/MissionHeader';
import { ArchitectureFlow } from './components/flow/ArchitectureFlow';
import { ArchitectureScene3D } from './components/scene3d/ArchitectureScene3D';
import { MainSidebar } from './components/panels/MainSidebar';
import { useArchitectureStore } from './store/useArchitectureStore';

type ViewMode3D = '2d' | '3d';
type MainTab = 'architecture' | 'traceability' | 'dashboard';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('architecture');
  const [viewMode, setViewMode] = useState<ViewMode3D>('2d');
  const { model, selectedId, setSelectedId } = useArchitectureStore();

  return (
    <div className="app-root">
      <MissionHeader />

      {/* Navigation */}
      <nav className="nav-bar">
        {([
          { key: 'architecture', label: '◈ Architecture' },
          { key: 'traceability', label: '⟿ Traceability' },
          { key: 'dashboard',    label: '⎔ Dashboard' },
        ] as { key: MainTab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            className={`nav-tab${mainTab === tab.key ? ' active' : ''}`}
            onClick={() => setMainTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}

        <div className="nav-spacer" />

        {mainTab === 'architecture' && (
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${viewMode === '2d' ? ' active' : ''}`}
              onClick={() => setViewMode('2d')}
            >
              2D Flow
            </button>
            <button
              className={`view-toggle-btn${viewMode === '3d' ? ' active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D Scene
            </button>
          </div>
        )}
      </nav>

      <div className="app-body">
        <main className="app-canvas">
          {mainTab === 'architecture' && viewMode === '2d' && (
            <ArchitectureFlow />
          )}
          {mainTab === 'architecture' && viewMode === '3d' && (
            <ArchitectureScene3D
              model={model}
              selectedId={selectedId ?? ''}
              onSelect={setSelectedId}
            />
          )}
          {mainTab === 'traceability' && (
            <TraceabilityView />
          )}
          {mainTab === 'dashboard' && (
            <DashboardView />
          )}
        </main>

        <MainSidebar />
      </div>
    </div>
  );
}

function TraceabilityView() {
  const { model, selectedId, setSelectedId } = useArchitectureStore();

  return (
    <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        Requirements traceability matrix — {model.relations.filter(r => r.type === 'satisfies').length} satisfies links
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          borderCollapse: 'collapse',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          width: 'max-content',
        }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left', minWidth: 180 }}>
                Requirement
              </th>
              {model.entities.filter(e => e.type === 'function').map(fn => (
                <th key={fn.id} style={{
                  padding: '4px 8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: 9,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  maxHeight: 120,
                }}>
                  {fn.name.slice(0, 24)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.entities.filter(e => e.type === 'requirement').map(req => (
              <tr key={req.id} style={{
                background: req.id === selectedId ? 'var(--bg-selected)' : 'transparent',
              }}>
                <td
                  style={{ padding: '4px 12px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--c-requirement)', cursor: 'pointer' }}
                  onClick={() => setSelectedId(req.id)}
                >
                  {req.id}
                </td>
                {model.entities.filter(e => e.type === 'function').map(fn => {
                  const linked = model.relations.some(
                    r => r.type === 'satisfies' && r.source === fn.id && r.target === req.id,
                  );
                  return (
                    <td key={fn.id} style={{
                      textAlign: 'center',
                      padding: '4px',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderLeft: '1px solid var(--border-subtle)',
                    }}>
                      {linked && (
                        <span style={{ color: 'var(--c-function)', fontSize: 12 }}>✓</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardView() {
  const { model } = useArchitectureStore();

  const totalBudgets: Record<string, { est: number; alloc: number; unit: string }> = {};
  for (const entity of model.entities) {
    for (const b of entity.budgets ?? []) {
      const key = b.kind;
      if (!totalBudgets[key]) totalBudgets[key] = { est: 0, alloc: 0, unit: b.unit };
      totalBudgets[key].est += b.estimated;
      totalBudgets[key].alloc += b.allocated;
    }
  }

  const risks = model.risks ?? [];
  const verifs = model.verifications ?? [];

  return (
    <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>

        {/* Budget card */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            System Budgets
          </div>
          {Object.entries(totalBudgets).map(([kind, data]) => {
            const pct = data.alloc > 0 ? Math.min((data.est / data.alloc) * 100, 100) : 0;
            const cls = pct >= 95 ? 'high' : pct >= 80 ? 'medium' : 'low';
            return (
              <div key={kind} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{kind}</span>
                  <span>{data.est.toFixed(1)} / {data.alloc.toFixed(1)} {data.unit} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="budget-bar">
                  <div className={`budget-bar__fill ${cls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk summary */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Risk Summary ({risks.length})
          </div>
          {risks.slice(0, 5).map((r) => {
            const score = r.probability * r.impact;
            const color = score >= 20 ? '#f87171' : score >= 12 ? '#fb923c' : score >= 6 ? '#facc15' : '#4ade80';
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 12 }}>
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{r.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color, fontSize: 11 }}>{score}</span>
              </div>
            );
          })}
        </div>

        {/* Verification status */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Verification ({verifs.length})
          </div>
          {['passed', 'in_progress', 'planned', 'failed'].map((status) => {
            const count = verifs.filter(v => v.status === status || (status === 'passed' && v.status === 'verified')).length;
            const color = status === 'passed' ? '#4ade80' : status === 'in_progress' ? '#38bdf8' : status === 'failed' ? '#f87171' : '#94a3b8';
            const pct = verifs.length > 0 ? (count / verifs.length) * 100 : 0;
            return (
              <div key={status} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{status}</span>
                  <span>{count}</span>
                </div>
                <div className="budget-bar">
                  <div className="budget-bar__fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Entity type distribution */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Entity Distribution
          </div>
          {Object.entries(
            model.entities.reduce((acc, e) => {
              acc[e.type] = (acc[e.type] ?? 0) + 1;
              return acc;
            }, {} as Record<string, number>),
          )
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span className="type-badge" data-type={type} style={{ fontSize: 9 }}>{type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
