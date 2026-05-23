import type { ElementNode } from '../../types';

interface DetailsPanelProps {
  node: ElementNode;
}

export function DetailsPanel({ node }: DetailsPanelProps) {
  return (
    <article className="panel-card">
      <h2>Detalhes do Elemento</h2>
      <p><strong>ID:</strong> {node.id}</p>
      <p><strong>Tipo:</strong> {node.type}</p>
      <p><strong>Nome:</strong> {node.name}</p>
      <p>{node.description}</p>
      {node.tags && node.tags.length > 0 && (
        <p>
          <strong>Etiquetas:</strong> {node.tags.join(', ')}
        </p>
      )}
      {node.status && (
        <div className="status-pill" style={{ marginTop: '10px' }}>{node.status}</div>
      )}
    </article>
  );
}
