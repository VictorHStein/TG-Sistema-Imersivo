import { useMemo } from 'react';
import { useArchitectureStore } from '../../state/architectureStore';

const DEFAULT_STEP_LABELS: Record<number, string> = {
  1: 'Missão',
  2: 'Objetivos',
  3: 'Requisitos',
  4: 'Funções',
  5: 'Segmentos',
  6: 'Subsistemas',
  7: 'Componentes',
  8: 'Interfaces',
  9: 'Rastreabilidade',
  10: 'Verificações',
};

/**
 * Horizontal timeline letting the user advance through the architecture
 * step-by-step. Empty steps (no new entity or relation) are hidden so the
 * progression always feels meaningful.
 */
export function BottomTimeline() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const currentStep = useArchitectureStore((s) => s.currentStep);
  const explorationMode = useArchitectureStore((s) => s.explorationMode);
  const setStep = useArchitectureStore((s) => s.setStep);
  const next = useArchitectureStore((s) => s.nextStep);
  const prev = useArchitectureStore((s) => s.previousStep);
  const setExplorationMode = useArchitectureStore((s) => s.setExplorationMode);

  const steps = useMemo(() => {
    if (!architecture) return [];
    const used = new Set<number>();
    for (const e of architecture.entities) used.add(e.step);
    for (const r of architecture.relations) used.add(r.step);
    return [...used].sort((a, b) => a - b);
  }, [architecture]);

  if (!architecture || steps.length === 0) return null;

  return (
    <div className="timeline">
      <div className="timeline__left">
        <button
          className={`timeline__mode${explorationMode === 'all' ? ' is-on' : ''}`}
          onClick={() => setExplorationMode('all')}
        >
          Mostrar tudo
        </button>
        <button
          className={`timeline__mode${explorationMode === 'step' ? ' is-on' : ''}`}
          onClick={() => setExplorationMode('step')}
        >
          Por etapas
        </button>
      </div>

      <div className="timeline__center">
        <button className="timeline__nav" onClick={prev} disabled={currentStep <= steps[0] || explorationMode !== 'step'}>
          ‹
        </button>
        <ul className="timeline__steps">
          {steps.map((s) => {
            const reached = s <= currentStep && explorationMode === 'step';
            const current = s === currentStep && explorationMode === 'step';
            const label = DEFAULT_STEP_LABELS[s] ?? `Etapa ${s}`;
            return (
              <li key={s}>
                <button
                  className={`timeline__step${current ? ' is-current' : ''}${reached ? ' is-reached' : ''}`}
                  onClick={() => { setExplorationMode('step'); setStep(s); }}
                  title={label}
                >
                  <span className="timeline__step-n">{s}</span>
                  <span className="timeline__step-label">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button className="timeline__nav" onClick={next} disabled={currentStep >= steps[steps.length - 1] || explorationMode !== 'step'}>
          ›
        </button>
      </div>
    </div>
  );
}
