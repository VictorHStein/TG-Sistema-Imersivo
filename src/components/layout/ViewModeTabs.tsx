import { useArchitectureStore, type ViewMode } from '../../state/architectureStore';

const MODES: { key: ViewMode; label: string; hint: string }[] = [
  { key: '2d',    label: 'Grafo 2D', hint: 'Diagrama por camadas com badges numerados' },
  { key: '3d',    label: 'Cena 3D',  hint: 'Arquitetura espacial radial' },
  { key: 'split', label: 'Lado a lado', hint: '2D e 3D simultâneos' },
];

export function ViewModeTabs() {
  const viewMode = useArchitectureStore((s) => s.viewMode);
  const setViewMode = useArchitectureStore((s) => s.setViewMode);

  return (
    <div className="view-tabs">
      {MODES.map((m) => (
        <button
          key={m.key}
          className={`view-tab${viewMode === m.key ? ' is-on' : ''}`}
          onClick={() => setViewMode(m.key)}
          title={m.hint}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
