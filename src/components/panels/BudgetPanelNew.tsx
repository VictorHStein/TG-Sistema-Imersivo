import { useArchitectureStore } from '../../store/useArchitectureStore';
import type { BudgetEntry } from '../../types/architecture';

interface BudgetSummary {
  kind: string;
  allocated: number;
  estimated: number;
  unit: string;
  pct: number;
}

export function BudgetPanelNew() {
  const { model } = useArchitectureStore();

  // Aggregate all budget entries from entities
  const summaryMap = new Map<string, BudgetSummary>();
  for (const entity of model.entities) {
    for (const b of entity.budgets ?? []) {
      const key = `${b.kind}__${b.unit}`;
      const existing = summaryMap.get(key);
      if (existing) {
        existing.allocated += b.allocated;
        existing.estimated += b.estimated;
      } else {
        summaryMap.set(key, {
          kind: b.kind,
          allocated: b.allocated,
          estimated: b.estimated,
          unit: b.unit,
          pct: 0,
        });
      }
    }
  }

  const summaries = Array.from(summaryMap.values()).map((s) => ({
    ...s,
    pct: s.allocated > 0 ? Math.min((s.estimated / s.allocated) * 100, 100) : 0,
  }));

  // Get entities that have budgets
  const entitiesWithBudgets = model.entities.filter((e) => e.budgets && e.budgets.length > 0);

  return (
    <div className="panel-body">
      <div className="rel-section__title" style={{ marginBottom: 16, fontSize: 11 }}>System Budget Summary</div>

      {summaries.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No budget data.</div>
      )}

      {summaries.map((s, i) => {
        const cls = s.pct >= 95 ? 'high' : s.pct >= 80 ? 'medium' : 'low';
        return (
          <div key={i} className="budget-row">
            <div className="budget-row__header">
              <span className="budget-row__kind">{s.kind}</span>
              <span>{s.estimated.toFixed(1)} / {s.allocated.toFixed(1)} {s.unit} ({s.pct.toFixed(0)}%)</span>
            </div>
            <div className="budget-bar">
              <div className={`budget-bar__fill ${cls}`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        );
      })}

      <div className="rel-section__title" style={{ marginTop: 24, marginBottom: 12, fontSize: 11 }}>Per-Entity Budgets</div>

      {entitiesWithBudgets.map((entity) => (
        <div key={entity.id} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}>
            {entity.id} — {entity.name}
          </div>
          {(entity.budgets as BudgetEntry[]).map((b, i) => {
            const pct = b.allocated > 0 ? Math.min((b.estimated / b.allocated) * 100, 100) : 0;
            const cls = pct >= 95 ? 'high' : pct >= 80 ? 'medium' : 'low';
            return (
              <div key={i} className="budget-row">
                <div className="budget-row__header">
                  <span className="budget-row__kind">{b.kind}</span>
                  <span>{b.estimated} / {b.allocated} {b.unit}</span>
                </div>
                <div className="budget-bar">
                  <div className={`budget-bar__fill ${cls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
