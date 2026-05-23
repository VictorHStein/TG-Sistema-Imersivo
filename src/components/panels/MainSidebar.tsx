import { useArchitectureStore } from '../../store/useArchitectureStore';
import { EntityDetailsPanel } from './EntityDetailsPanel';
import { TraceabilityPanelNew } from './TraceabilityPanelNew';
import { BudgetPanelNew } from './BudgetPanelNew';
import { VerificationPanelNew } from './VerificationPanelNew';
import { RiskPanelNew } from './RiskPanelNew';
import { RelationshipExplorer } from './RelationshipExplorer';
import type { PanelTab } from '../../store/useArchitectureStore';
import '../../styles/panels.css';

const TABS: { key: PanelTab; label: string }[] = [
  { key: 'details',      label: 'Details'   },
  { key: 'relations',    label: 'Relations'  },
  { key: 'traceability', label: 'Trace'      },
  { key: 'budget',       label: 'Budget'     },
  { key: 'verification', label: 'Verif.'     },
  { key: 'risk',         label: 'Risk'       },
];

export function MainSidebar() {
  const { activePanel, setActivePanel } = useArchitectureStore();

  return (
    <div className="panel" style={{ width: 320, minWidth: 280, maxWidth: 400 }}>
      <div className="panel-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`panel-tab${activePanel === t.key ? ' active' : ''}`}
            onClick={() => setActivePanel(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activePanel === 'details'      && <EntityDetailsPanel />}
      {activePanel === 'relations'    && <RelationshipExplorer />}
      {activePanel === 'traceability' && <TraceabilityPanelNew />}
      {activePanel === 'budget'       && <BudgetPanelNew />}
      {activePanel === 'verification' && <VerificationPanelNew />}
      {activePanel === 'risk'         && <RiskPanelNew />}
    </div>
  );
}
