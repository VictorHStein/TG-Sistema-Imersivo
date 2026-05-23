import type { SystemModel, ElementNode } from '../../types';

interface TraceabilityViewProps {
  model: SystemModel;
  selectedId: string;
}

interface ChainNode {
  id: string;
  name: string;
  type: string;
}

function allItems(model: SystemModel): ElementNode[] {
  return [
    model.mission,
    ...model.objectives,
    ...model.requirements,
    ...model.functions,
    ...model.systems,
    ...model.components,
    ...model.interfaces,
  ];
}

function findById(model: SystemModel, id: string): ElementNode | undefined {
  return allItems(model).find((item) => item.id === id);
}

// Walk upward through the structural hierarchy from any node.
function buildUpwardChain(model: SystemModel, nodeId: string): ChainNode[] {
  const visited = new Set<string>();
  const chain: ChainNode[] = [];

  let id: string | undefined = nodeId;
  while (id && !visited.has(id)) {
    visited.add(id);
    const node = findById(model, id);
    if (!node) break;
    chain.unshift({ id: node.id, name: node.name, type: node.type });

    // Walk up based on type
    switch (node.type) {
      case 'objective':
        id = (node as any).missionId;
        break;
      case 'requirement':
        id = (node as any).objectiveId;
        break;
      case 'function': {
        const req = model.requirements.find((r) => r.functionIds.includes(node.id));
        id = req?.id;
        break;
      }
      case 'system': {
        const fn = model.functions.find((f) => f.systemIds.includes(node.id));
        id = fn?.id;
        break;
      }
      case 'component':
        id = (node as any).systemId;
        break;
      case 'interface': {
        const src = (node as any).sourceId;
        id = src;
        break;
      }
      default:
        id = undefined;
    }
  }

  return chain;
}

// Walk downward one level to show children.
function buildDownwardStep(model: SystemModel, nodeId: string): ChainNode[] {
  const node = findById(model, nodeId);
  if (!node) return [];

  switch (node.type) {
    case 'mission':
      return model.objectives.filter((o) => (node as any).objectiveIds.includes(o.id));
    case 'objective':
      return model.requirements.filter((r) => r.objectiveId === nodeId);
    case 'requirement':
      return model.functions.filter((f) => f.requirementIds.includes(nodeId));
    case 'function':
      return model.systems.filter((s) => s.functionIds.includes(nodeId));
    case 'system':
      return model.components.filter((c) => c.systemId === nodeId);
    case 'component':
      return model.interfaces.filter(
        (i) => (i as any).sourceId === nodeId || (i as any).targetId === nodeId
      );
    default:
      return [];
  }
}

export function TraceabilityView({ model, selectedId }: TraceabilityViewProps) {
  const upwardChain = buildUpwardChain(model, selectedId);
  const downwardItems = buildDownwardStep(model, selectedId);
  const selectedNode = findById(model, selectedId);

  return (
    <div className="traceability-view">
      <div className="traceability-header">
        <h2>Rastreabilidade</h2>
        <p>Cadeia de engenharia de sistemas: Missão → Objetivos → Requisitos → Funções → Sistemas → Componentes</p>
      </div>

      {/* Upward chain for selected element */}
      {upwardChain.length > 0 && (
        <div className="traceability-chain">
          <h3>Cadeia de rastreabilidade — {selectedNode?.name}</h3>
          <div className="chain-path">
            {upwardChain.map((item, idx) => (
              <div key={item.id} className="chain-item">
                <div className={`chain-node${item.id === selectedId ? ' chain-node--selected' : ''}`} data-type={item.type}>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
                </div>
                {idx < upwardChain.length - 1 && (
                  <div className="chain-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Downstream from selected */}
      {downwardItems.length > 0 && (
        <div className="traceability-chain">
          <h3>Elementos derivados</h3>
          <div className="chain-path">
            {downwardItems.map((item, idx) => (
              <div key={item.id} className="chain-item">
                <div className="chain-node" data-type={item.type}>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
                </div>
                {idx < downwardItems.length - 1 && (
                  <div className="chain-arrow">·</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full trace links matrix */}
      <div className="traceability-matrix">
        <h3>Matriz de Rastreabilidade ({model.traceLinks.length} links)</h3>
        <table>
          <thead>
            <tr>
              <th>Origem</th>
              <th>Destino</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {model.traceLinks.map((link) => (
              <tr key={link.id} style={
                link.from === selectedId || link.to === selectedId
                  ? { background: 'rgba(92, 123, 255, 0.06)' }
                  : undefined
              }>
                <td><code>{link.from}</code></td>
                <td><code>{link.to}</code></td>
                <td>{link.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
