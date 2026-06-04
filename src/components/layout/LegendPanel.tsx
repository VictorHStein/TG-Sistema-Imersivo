import { useArchitectureStore } from '../../state/architectureStore';

/**
 * Legend showing every relationType with its number, color, line style and
 * description. Clicking a row toggles that type on/off — change is reflected
 * simultaneously in 2D and 3D.
 */
export function LegendPanel() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const visibleRelationTypes = useArchitectureStore((s) => s.visibleRelationTypes);
  const visibleCategories = useArchitectureStore((s) => s.visibleCategories);
  const toggleRelationType = useArchitectureStore((s) => s.toggleRelationType);
  const setVisibleRelationTypes = useArchitectureStore((s) => s.setVisibleRelationTypes);
  const toggleCategory = useArchitectureStore((s) => s.toggleCategory);
  const showOnlyCrossCategory = useArchitectureStore((s) => s.showOnlyCrossCategory);
  const toggleCrossCategoryOnly = useArchitectureStore((s) => s.toggleCrossCategoryOnly);

  if (!architecture) return null;

  const allOn = architecture.relationTypes.every((rt) => visibleRelationTypes.has(rt.id));

  return (
    <aside className="legend-panel">
      <div className="legend-panel__header">
        <div className="legend-panel__title">Legenda</div>
        <div className="legend-panel__sub">
          Clique nas linhas para ligar/desligar cada tipo. Cores e números são consistentes em 2D e 3D.
        </div>
      </div>

      <div className="legend-section">
        <div className="legend-section__head">
          <span>Tipos de relação</span>
          <button
            className="legend-mini-btn"
            onClick={() =>
              setVisibleRelationTypes(
                allOn ? [] : architecture.relationTypes.map((r) => r.id),
              )
            }
          >
            {allOn ? 'Ocultar todas' : 'Mostrar todas'}
          </button>
        </div>

        <ul className="legend-list">
          {architecture.relationTypes.map((rt) => {
            const on = visibleRelationTypes.has(rt.id);
            return (
              <li
                key={rt.id}
                className={`legend-row${on ? ' is-on' : ' is-off'}`}
                onClick={() => toggleRelationType(rt.id)}
                title={rt.description}
              >
                <div
                  className="legend-row__badge"
                  style={{
                    background: on ? rt.color : 'transparent',
                    color: on ? '#fff' : rt.color,
                    borderColor: rt.color,
                  }}
                >
                  {rt.index}
                </div>
                <div className="legend-row__line">
                  <svg width="36" height="10" viewBox="0 0 36 10">
                    <line
                      x1="0" y1="5" x2="32" y2="5"
                      stroke={rt.color}
                      strokeWidth={2}
                      strokeDasharray={
                        rt.lineStyle === 'dashed' ? '6 3' :
                        rt.lineStyle === 'dotted' ? '2 3' : ''
                      }
                    />
                    {rt.directed && (
                      <polygon points="30,1 36,5 30,9" fill={rt.color} />
                    )}
                  </svg>
                </div>
                <div className="legend-row__text">
                  <div className="legend-row__label">{rt.label}</div>
                  <div className="legend-row__id">{rt.id}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="legend-section">
        <div className="legend-section__head">
          <span>Categorias</span>
        </div>
        <ul className="legend-cats">
          {architecture.categories.map((cat) => {
            const on = visibleCategories.has(cat.id);
            return (
              <li
                key={cat.id}
                className={`legend-cat${on ? ' is-on' : ' is-off'}`}
                onClick={() => toggleCategory(cat.id)}
                title={cat.description}
              >
                <span className="legend-cat__chip" style={{ background: on ? cat.color : 'transparent', borderColor: cat.color }} />
                <span className="legend-cat__label" style={{ color: on ? cat.color : 'var(--text-muted)' }}>
                  {cat.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="legend-section">
        <div className="legend-section__head">
          <span>Filtros rápidos</span>
        </div>
        <label className="legend-toggle">
          <input
            type="checkbox"
            checked={showOnlyCrossCategory}
            onChange={toggleCrossCategoryOnly}
          />
          <span>Só relações entre categorias diferentes</span>
        </label>
      </div>
    </aside>
  );
}
