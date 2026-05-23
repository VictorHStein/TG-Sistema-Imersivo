import { Fragment } from 'react';
import type { SystemModel, ElementNode } from '../../types';

interface Layer {
  type: string;
  title: string;
  items: ElementNode[];
}

interface ArchitectureFlow2DProps {
  model: SystemModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureFlow2D({ model, selectedId, onSelect }: ArchitectureFlow2DProps) {
  const layers: Layer[] = [
    { type: 'mission',     title: 'Missão',      items: [model.mission] },
    { type: 'objective',   title: 'Objetivos',   items: model.objectives },
    { type: 'requirement', title: 'Requisitos',  items: model.requirements },
    { type: 'function',    title: 'Funções',      items: model.functions },
    { type: 'system',      title: 'Sistemas',    items: model.systems },
    { type: 'component',   title: 'Componentes', items: model.components },
  ];

  return (
    <div className="flow-2d-container">
      <div className="flow-2d-canvas">
        {layers.map((layer, idx) => (
          <Fragment key={layer.type}>
            <div className="flow-layer" data-type={layer.type}>
              <div className="flow-layer-header">
                <span className="flow-layer-dot" />
                <span className="flow-layer-title">{layer.title}</span>
                <span className="flow-layer-count">{layer.items.length}</span>
              </div>
              <div className="flow-layer-items">
                {layer.items.map((item) => (
                  <button
                    key={item.id}
                    className={`flow-item${item.id === selectedId ? ' selected' : ''}`}
                    data-type={layer.type}
                    onClick={() => onSelect(item.id)}
                    title={item.description}
                  >
                    <div className="flow-item-name">{item.name}</div>
                    <div className="flow-item-id">{item.id}</div>
                  </button>
                ))}
              </div>
            </div>
            {idx < layers.length - 1 && (
              <div className="flow-divider">
                <span className="flow-divider-arrow">›</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
