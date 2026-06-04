import { useArchitectureStore, type ViewMode } from '../../state/architectureStore';

const MODES: { key: ViewMode; label: string; hint: string }[] = [
  { key: '2d',       label: 'Grafo 2D',       hint: 'Diagrama por camadas com badges numerados e códigos PBS' },
  { key: '3d',       label: 'Cena 3D',        hint: 'Arquitetura espacial radial-fan' },
  { key: 'split',    label: 'Lado a lado',    hint: '2D e 3D simultâneos' },
  { key: 'tutorial', label: 'Tutorial · JSON',hint: 'Como modelar e carregar sua arquitetura' },
];

export function ViewModeTabs() {
  const viewMode = useArchitectureStore((s) => s.viewMode);
  const setViewMode = useArchitectureStore((s) => s.setViewMode);

  return (
    <div className="view-tabs">
      {MODES.map((m) => (
        <button
          key={m.key}
          className={`view-tab${viewMode === m.key ? ' is-on' : ''}${m.key === 'tutorial' ? ' view-tab--tutorial' : ''}`}
          onClick={() => setViewMode(m.key)}
          title={m.hint}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
