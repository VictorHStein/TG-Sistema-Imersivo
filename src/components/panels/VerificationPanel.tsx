import type { Verification } from '../../types';

interface VerificationPanelProps {
  verifications: Verification[];
}

export function VerificationPanel({ verifications }: VerificationPanelProps) {
  return (
    <article className="panel-card">
      <h2>Verificação</h2>
      <ul>
        {verifications.map((item) => (
          <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <strong>{item.name}</strong>
            <p>{item.description}</p>
            <p>
              <span className="keyword">Requisito:</span> {item.requirementId} <br />
              <span className="keyword">Item:</span> {item.itemId}
            </p>
            <p>
              <strong>Método:</strong> {item.method} <br />
              <strong>Evidência:</strong> {item.evidence} <br />
              <strong>Status:</strong> {item.status}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
