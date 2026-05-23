import type { SystemModel } from '../../types';

interface TraceabilityPanelProps {
  model: SystemModel;
  selectedId: string;
}

export function TraceabilityPanel({ model, selectedId }: TraceabilityPanelProps) {
  const directLinks = model.traceLinks.filter(
    (link) => link.from === selectedId || link.to === selectedId
  );

  return (
    <article className="panel-card">
      <h2>Painel de Rastreabilidade</h2>
      {directLinks.length === 0 ? (
        <p>Nenhuma cadeia de rastreabilidade direta encontrada para este elemento.</p>
      ) : (
        <ul>
          {directLinks.map((link) => (
            <li key={link.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <strong>{link.id}</strong>
              <p>{link.description}</p>
              <p>
                <span className="keyword">De:</span> {link.from} <span className="keyword">Para:</span> {link.to}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
