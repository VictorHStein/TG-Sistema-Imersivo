import { useState } from 'react';
import { MissionHeader } from './components/app/MissionHeader';
import { ArchitectureFlow } from './components/flow/ArchitectureFlow';
import { ArchitectureScene3D } from './components/scene3d/ArchitectureScene3D';
import { MainSidebar } from './components/panels/MainSidebar';
import { useArchitectureStore } from './store/useArchitectureStore';
import { ENTITY_ACCENT } from './types/architecture';

type ViewMode3D = '2d' | '3d';
type MainTab = 'architecture' | 'traceability' | 'dashboard';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('architecture');
  const [view3D, setView3D] = useState<ViewMode3D>('2d');
  const { model, selectedId, setSelectedId } = useArchitectureStore();

  return (
    <div className="app-root">
      <MissionHeader />

      {/* Navigation */}
      <nav className="nav-bar">
        {([
          { key: 'architecture', label: '◈ Arquitetura' },
          { key: 'traceability', label: '⟿ Rastreabilidade' },
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
              className={`view-toggle-btn${view3D === '2d' ? ' active' : ''}`}
              onClick={() => setView3D('2d')}
            >
              2D Flow
            </button>
            <button
              className={`view-toggle-btn${view3D === '3d' ? ' active' : ''}`}
              onClick={() => setView3D('3d')}
            >
              3D Cena
            </button>
          </div>
        )}
      </nav>

      <div className="app-body">
        <main className="app-canvas">
          {mainTab === 'architecture' && view3D === '2d' && <ArchitectureFlow />}
          {mainTab === 'architecture' && view3D === '3d' && (
            <ArchitectureScene3D
              model={model}
              selectedId={selectedId ?? ''}
              onSelect={setSelectedId}
            />
          )}
          {mainTab === 'traceability' && <TraceabilityView />}
          {mainTab === 'dashboard'    && <DashboardView />}
        </main>

        <MainSidebar />
      </div>
    </div>
  );
}

/* ── Traceability matrix ─────────────────────────────────────── */
function TraceabilityView() {
  const { model, selectedId, setSelectedId } = useArchitectureStore();
  const requirements = model.entities.filter((e) => e.type === 'requirement');
  const functions    = model.entities.filter((e) => e.type === 'function');

  return (
    <div className="trace-view">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
        Matriz Requisitos × Funções — {model.relations.filter(r => r.type === 'satisfies').length} relações satisfies
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="trace-matrix">
          <thead>
            <tr>
              <th style={{ minWidth: 200, textAlign: 'left', padding: '6px 12px' }}>Requisito</th>
              {functions.map(fn => (
                <th key={fn.id} style={{
                  writingMode: 'vertical-rl', textOrientation: 'mixed',
                  maxHeight: 120, fontSize: 9, padding: '6px 4px',
                  color: ENTITY_ACCENT['function'],
                }}>
                  {fn.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requirements.map(req => {
              const isSelected = req.id === selectedId;
              return (
                <tr key={req.id} className={isSelected ? 'highlighted' : ''}>
                  <td
                    onClick={() => setSelectedId(req.id)}
                    style={{ cursor: 'pointer', color: ENTITY_ACCENT['requirement'], padding: '4px 12px' }}
                  >
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{req.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{req.name}</div>
                  </td>
                  {functions.map(fn => {
                    const linked = model.relations.some(
                      r => r.type === 'satisfies' && r.source === fn.id && r.target === req.id,
                    );
                    return (
                      <td key={fn.id} style={{ textAlign: 'center', padding: 4 }}>
                        {linked && (
                          <span style={{ color: ENTITY_ACCENT['function'], fontSize: 14, fontWeight: 700 }}>
                            ✓
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Dashboard view ──────────────────────────────────────────── */
function DashboardView() {
  const { model } = useArchitectureStore();

  const budgetTotals: Record<string, { est: number; alloc: number; unit: string }> = {};
  for (const e of model.entities) {
    for (const b of e.budgets ?? []) {
      if (!budgetTotals[b.kind]) budgetTotals[b.kind] = { est: 0, alloc: 0, unit: b.unit };
      budgetTotals[b.kind].est   += b.estimated;
      budgetTotals[b.kind].alloc += b.allocated;
    }
  }

  const risks  = model.risks ?? [];
  const verifs = model.verifications ?? [];
  const relTypes = model.relations.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1; return acc;
  }, {} as Record<string, number>);

  return (
    <div className="dashboard-view">
      <div className="dashboard-grid">

        {/* Budgets */}
        <div className="dashboard-card">
          <div className="dashboard-card__title">Budgets do Sistema</div>
          {Object.entries(budgetTotals).map(([kind, data]) => {
            const pct = data.alloc > 0 ? Math.min((data.est / data.alloc) * 100, 100) : 0;
            const cls = pct >= 95 ? 'high' : pct >= 80 ? 'medium' : 'low';
            return (
              <div key={kind} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{kind}</span>
                  <span>{data.est.toFixed(1)}/{data.alloc.toFixed(1)} {data.unit} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="budget-bar"><div className={`budget-bar__fill ${cls}`} style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>

        {/* Risks */}
        <div className="dashboard-card">
          <div className="dashboard-card__title">Riscos ({risks.length})</div>
          {[...risks].sort((a,b) => b.probability*b.impact - a.probability*a.impact).slice(0, 6).map(r => {
            const score = r.probability * r.impact;
            const color = score >= 20 ? '#f87171' : score >= 12 ? '#fb923c' : score >= 6 ? '#facc15' : '#4ade80';
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)', flex: 1, paddingRight: 8 }}>{r.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color, fontSize: 11, flexShrink: 0 }}>{score}</span>
              </div>
            );
          })}
        </div>

        {/* Verification */}
        <div className="dashboard-card">
          <div className="dashboard-card__title">Verificação ({verifs.length})</div>
          {['passed', 'in_progress', 'planned', 'failed'].map(status => {
            const count = verifs.filter(v => v.status === status || (status === 'passed' && v.status === 'verified')).length;
            const colors: Record<string,string> = { passed:'#4ade80', in_progress:'#38bdf8', planned:'#94a3b8', failed:'#f87171' };
            const pct = verifs.length > 0 ? (count / verifs.length) * 100 : 0;
            return (
              <div key={status} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{status.replace('_',' ')}</span>
                  <span>{count}</span>
                </div>
                <div className="budget-bar">
                  <div className="budget-bar__fill" style={{ width: `${pct}%`, background: colors[status] }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Relation type distribution */}
        <div className="dashboard-card">
          <div className="dashboard-card__title">Relações por Tipo ({model.relations.length})</div>
          {Object.entries(relTypes).sort((a,b) => b[1]-a[1]).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 11 }}>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{type.replace(/_/g,' ')}</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{count}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
