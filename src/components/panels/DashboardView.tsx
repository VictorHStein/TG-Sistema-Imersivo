import type { SystemModel } from '../../types';

interface DashboardViewProps {
  model: SystemModel;
}

const parseNum = (value: string): number => {
  const m = value.match(/^([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};

const usageCls = (pct: number) =>
  pct >= 95 ? 'usage-high' : pct >= 80 ? 'usage-medium' : 'usage-low';

export function DashboardView({ model }: DashboardViewProps) {
  return (
    <div className="dashboard-view">
      <div className="dashboard-grid">

        {/* ── Budgets ── */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon" style={{ background: 'rgba(92, 123, 255, 0.15)', color: '#7a9aff' }}>⚡</div>
            <h2>Budgets</h2>
          </div>
          <div className="budget-list">
            {model.budgets.map((budget) => {
              const allocated = parseNum(budget.allocated);
              const consumed  = parseNum(budget.consumed);
              const pct = allocated > 0 ? Math.round((consumed / allocated) * 100) : 0;
              return (
                <div key={budget.id} className="budget-item">
                  <div className="budget-header">
                    <h4>{budget.name}</h4>
                    <span className="budget-id">{budget.id}</span>
                  </div>
                  <p className="budget-desc">{budget.description}</p>
                  <div className="budget-bar-container">
                    <div className="budget-bar-label">
                      <span>Utilização</span>
                      <span
                        className="budget-bar-pct"
                        style={{ color: pct >= 95 ? '#ff7055' : pct >= 80 ? '#f7b32b' : '#5de0a6' }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="budget-bar-track">
                      <div
                        className={`budget-bar-fill ${usageCls(pct)}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="budget-values">
                    <span className="budget-value">Alocado: <span>{budget.allocated}</span></span>
                    <span className="budget-value">Consumido: <span>{budget.consumed}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Risks ── */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon" style={{ background: 'rgba(255, 120, 85, 0.15)', color: '#ff8055' }}>⚠</div>
            <h2>Riscos</h2>
          </div>
          <div className="risk-list">
            {model.risks.map((risk) => (
              <div key={risk.id} className="risk-item">
                <div className="risk-header">
                  <h4>{risk.name}</h4>
                  <span
                    className="risk-badge"
                    data-prob={risk.probability}
                    style={{ background: undefined }}
                  >
                    {risk.probability}
                  </span>
                </div>
                <p className="risk-description">{risk.description}</p>
                <div className="risk-details">
                  <div className="risk-impact-row">
                    <span className="risk-impact-label">Impacto</span>
                    <span className={`risk-impact-badge ${risk.impact}`}>{risk.impact}</span>
                  </div>
                  <div className="risk-mitigation-row">
                    <strong>Mitigação</strong>
                    {risk.mitigation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Verification ── */}
        <div className="dashboard-card dashboard-card-full">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon" style={{ background: 'rgba(93, 224, 166, 0.15)', color: '#5de0a6' }}>✓</div>
            <h2>Verificação e Validação</h2>
          </div>
          <div className="verification-grid">
            {model.verifications.map((ver) => (
              <div key={ver.id} className="verification-item">
                <div className="verification-header">
                  <h4>{ver.name}</h4>
                  <span className={`verification-status ${ver.status}`}>{ver.status}</span>
                </div>
                <p className="verification-desc">{ver.description}</p>
                <div className="verification-details">
                  <div className="verification-detail-row">
                    <span className="ver-label">Requisito</span>
                    <span className="ver-value"><code>{ver.requirementId}</code></span>
                  </div>
                  <div className="verification-detail-row">
                    <span className="ver-label">Item</span>
                    <span className="ver-value"><code>{ver.itemId}</code></span>
                  </div>
                  <div className="verification-detail-row">
                    <span className="ver-label">Método</span>
                    <span className="ver-value">{ver.method}</span>
                  </div>
                  <div className="verification-detail-row">
                    <span className="ver-label">Evidência</span>
                    <span className="ver-value">{ver.evidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="dashboard-card dashboard-card-full">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon" style={{ background: 'rgba(155, 140, 255, 0.15)', color: '#9b8cff' }}>◈</div>
            <h2>Resumo da Arquitetura</h2>
          </div>
          <div className="summary-grid">
            {[
              { label: 'Objetivos',    value: model.objectives.length },
              { label: 'Requisitos',   value: model.requirements.length },
              { label: 'Funções',      value: model.functions.length },
              { label: 'Sistemas',     value: model.systems.length },
              { label: 'Componentes',  value: model.components.length },
              { label: 'Interfaces',   value: model.interfaces.length },
              { label: 'Riscos',       value: model.risks.length },
              { label: 'Verificações', value: model.verifications.length },
            ].map(({ label, value }) => (
              <div key={label} className="summary-stat">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
