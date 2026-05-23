import type { ViewMode } from '../../types';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="button-group" style={{ alignItems: 'center' }}>
      <span className="status-pill">Modo de visualização</span>
      <button
        type="button"
        className={`toggle-button ${value === '3d' ? 'active' : ''}`}
        onClick={() => onChange('3d')}
      >
        3D
      </button>
      <button
        type="button"
        className={`toggle-button ${value === '2d' ? 'active' : ''}`}
        onClick={() => onChange('2d')}
      >
        2D
      </button>
    </div>
  );
}
