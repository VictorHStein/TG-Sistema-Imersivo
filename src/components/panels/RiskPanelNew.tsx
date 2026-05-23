import { useArchitectureStore } from '../../store/useArchitectureStore';
import type { RiskEntry } from '../../types/architecture';

function riskClass(score: number): string {
  if (score >= 20) return 'critical';
  if (score >= 12) return 'high';
  if (score >= 6)  return 'medium';
  return 'low';
}

function riskCellClass(p: number, i: number): string {
  const score = p * i;
  if (score >= 20) return 'critical';
  if (score >= 12) return 'high';
  if (score >= 6)  return 'medium';
  return 'low';
}

export function RiskPanelNew() {
  const { model } = useArchitectureStore();
  const risks: RiskEntry[] = model.risks ?? [];

  const sorted = [...risks].sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact));

  return (
    <div className="panel-body">
      <div className="rel-section__title" style={{ marginBottom: 8 }}>
        Risk Matrix ({risks.length} risks)
      </div>

      {/* 5×5 heat map */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '24px repeat(5, 1fr)',
          gap: 2,
          fontSize: 8,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginBottom: 2,
        }}>
          <span />
          {[1,2,3,4,5].map(p => <span key={p} style={{ textAlign: 'center' }}>P{p}</span>)}
        </div>
        {[5,4,3,2,1].map((impact) => (
          <div key={impact} style={{
            display: 'grid',
            gridTemplateColumns: '24px repeat(5, 1fr)',
            gap: 2,
            marginBottom: 2,
          }}>
            <span style={{
              fontSize: 8,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              I{impact}
            </span>
            {[1,2,3,4,5].map((prob) => {
              const cls = riskCellClass(prob, impact);
              const count = risks.filter(r => r.probability === prob && r.impact === impact).length;
              return (
                <div key={prob} className={`risk-cell ${cls}`} title={`P${prob}×I${impact}=${prob*impact}`}>
                  {count > 0 ? count : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="rel-section__title" style={{ marginBottom: 8 }}>Risk Register</div>

      {sorted.map((risk) => {
        const score = risk.probability * risk.impact;
        const cls = riskClass(score);
        return (
          <div key={risk.id} className={`risk-item ${risk.status}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="risk-item__title">{risk.title}</div>
              <span style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: 10,
                background: cls === 'critical' ? 'rgba(248,113,113,.3)' :
                            cls === 'high' ? 'rgba(251,146,60,.25)' :
                            cls === 'medium' ? 'rgba(250,204,21,.2)' :
                            'rgba(74,222,128,.15)',
                color: cls === 'critical' ? '#fca5a5' :
                       cls === 'high' ? '#fb923c' :
                       cls === 'medium' ? '#facc15' : '#4ade80',
              }}>
                {score} {cls.toUpperCase()}
              </span>
            </div>
            <div className="risk-item__score">
              P={risk.probability} × I={risk.impact} | Status: {risk.status}
            </div>
            <div className="risk-item__mitigation">{risk.mitigation}</div>
          </div>
        );
      })}
    </div>
  );
}
