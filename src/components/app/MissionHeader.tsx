import { useArchitectureStore } from '../../store/useArchitectureStore';

export function MissionHeader() {
  const { model } = useArchitectureStore();
  const mission = model.entities.find((e) => e.type === 'mission');
  const riskCount  = (model.risks ?? []).filter((r) => r.status === 'open').length;
  const verifPass  = (model.verifications ?? []).filter(v => v.status === 'passed' || v.status === 'verified').length;
  const verifTotal = (model.verifications ?? []).length;

  return (
    <header className="mission-header">
      <div className="mission-live-dot" />
      <span className="mission-name">{mission?.name ?? 'Architecture Model'}</span>

      <div style={{ flex: 1 }} />

      {[
        { label: 'Entidades',  value: model.entities.length,  color: 'var(--c-system)' },
        { label: 'Relações',   value: model.relations.length, color: 'var(--c-objective)' },
        { label: 'Riscos',     value: riskCount,              color: riskCount > 0 ? 'var(--c-risk)' : 'var(--s-verified)' },
        { label: 'Verificados',value: `${verifPass}/${verifTotal}`, color: 'var(--c-verification)' },
      ].map((stat) => (
        <div key={stat.label} className="mission-stat">
          <span className="mission-stat__value" style={{ color: stat.color }}>{stat.value}</span>
          <span className="mission-stat__label">{stat.label}</span>
        </div>
      ))}

      <div className="mission-version">
        v{model.version}<br />{model.id}
      </div>
    </header>
  );
}
