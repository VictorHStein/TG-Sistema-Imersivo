import { useArchitectureStore } from '../../store/useArchitectureStore';

export function MissionHeader() {
  const { model } = useArchitectureStore();
  const mission = model.entities.find((e) => e.type === 'mission');

  const entityCount = model.entities.length;
  const relationCount = model.relations.length;
  const riskCount = (model.risks ?? []).filter((r) => r.status === 'open').length;
  const verifPassed = (model.verifications ?? []).filter(
    (v) => v.status === 'passed' || v.status === 'verified',
  ).length;
  const verifTotal = (model.verifications ?? []).length;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '8px 20px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0,
    }}>
      {/* Mission name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--c-mission)',
          boxShadow: '0 0 6px var(--c-mission)',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '0.03em',
        }}>
          {mission?.name ?? 'Architecture Model'}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Telemetry stats */}
      {[
        { label: 'Entities', value: entityCount, color: 'var(--c-system)' },
        { label: 'Relations', value: relationCount, color: 'var(--c-objective)' },
        { label: 'Open Risks', value: riskCount, color: riskCount > 0 ? 'var(--c-risk)' : 'var(--s-verified)' },
        { label: 'Verified', value: `${verifPassed}/${verifTotal}`, color: 'var(--c-verification)' },
      ].map((stat) => (
        <div key={stat.label} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          minWidth: 64,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 700,
            color: stat.color,
            lineHeight: 1,
          }}>
            {stat.value}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {stat.label}
          </span>
        </div>
      ))}

      {/* Version / model ID */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-muted)',
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: 12,
      }}>
        v{model.version}<br />
        {model.id}
      </div>
    </header>
  );
}
