import type { Risk } from '../../types';

interface RiskPanelProps {
  risks: Risk[];
}

export function RiskPanel({ risks }: RiskPanelProps) {
  return (
    <article className="panel-card">
      <h2>Riscos</h2>
      <ul>
        {risks.map((risk) => (
          <li key={risk.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <strong>{risk.name}</strong>
            <p>{risk.description}</p>
            <p>
              <span className="keyword">Probabilidade:</span> {risk.probability} <br />
              <span className="keyword">Impacto:</span> {risk.impact}
            </p>
            <p>
              <strong>Mitigação:</strong> {risk.mitigation}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
