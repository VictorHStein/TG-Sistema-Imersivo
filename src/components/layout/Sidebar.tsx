import type { SystemModel } from '../../types';

interface SidebarProps {
  model: SystemModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

function Section({ title, items, onSelect, selectedId }: { title: string; items: { id: string; name: string; type: string }[]; onSelect: (id: string) => void; selectedId: string }) {
  return (
    <div className="panel-card">
      <h2>{title}</h2>
      <ul className="link-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              style={{
                borderColor: item.id === selectedId ? '#5c7bff' : 'rgba(255,255,255,0.08)'
              }}
            >
              <strong>{item.name}</strong>
              <div style={{ marginTop: '6px' }}>{item.type}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar({ model, selectedId, onSelect }: SidebarProps) {
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <Section
        title="Missão e Objetivos"
        items={[model.mission, ...model.objectives]}
        onSelect={onSelect}
        selectedId={selectedId}
      />
      <Section
        title="Requisitos e Funções"
        items={[...model.requirements, ...model.functions]}
        onSelect={onSelect}
        selectedId={selectedId}
      />
      <Section
        title="Sistemas e Componentes"
        items={[...model.systems, ...model.components, ...model.interfaces]}
        onSelect={onSelect}
        selectedId={selectedId}
      />
    </div>
  );
}
