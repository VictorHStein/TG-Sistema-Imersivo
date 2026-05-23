import type { Budget } from '../../types';

interface BudgetPanelProps {
  budgets: Budget[];
}

export function BudgetPanel({ budgets }: BudgetPanelProps) {
  return (
    <article className="panel-card">
      <h2>Budgets</h2>
      <ul>
        {budgets.map((budget) => (
          <li key={budget.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <strong>{budget.name}</strong>
            <p>{budget.description}</p>
            <p>
              <span className="keyword">Alocado:</span> {budget.allocated} <br />
              <span className="keyword">Consumido:</span> {budget.consumed}
            </p>
            <p>
              <strong>Relacionados:</strong> {budget.relatedIds.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
