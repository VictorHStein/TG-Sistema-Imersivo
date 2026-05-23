import type { SafeParseReturnType } from 'zod';
import type { SystemModel } from '../../types';

interface NavigationProps {
  validation: SafeParseReturnType<SystemModel, SystemModel>;
  activeTab: 'architecture' | 'traceability' | 'dashboard';
  onTabChange: (tab: 'architecture' | 'traceability' | 'dashboard') => void;
  view3D: boolean;
  onViewToggle: (is3D: boolean) => void;
  title: string;
}

const tabs: { key: 'architecture' | 'traceability' | 'dashboard'; label: string; icon: string; desc: string }[] = [
  { key: 'architecture',  label: 'Arquitetura',     icon: '◈', desc: 'Visualização 2D/3D' },
  { key: 'traceability',  label: 'Rastreabilidade',  icon: '⟿', desc: 'Cadeia de requisitos' },
  { key: 'dashboard',     label: 'Dashboard',        icon: '⎔', desc: 'Métricas e riscos' },
];

export function Navigation({
  validation,
  activeTab,
  onTabChange,
  view3D,
  onViewToggle,
  title
}: NavigationProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1>{title}</h1>
          <p className="header-subtitle">Sistema de Engenharia Espacial Integrado · SBOMA-1</p>
        </div>

        <div className="header-controls">
          <div className="nav-tabs">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`nav-tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => onTabChange(key)}
                title={tabs.find(t => t.key === key)?.desc}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'architecture' && (
            <div className="view-toggle">
              <button
                className={`view-btn ${view3D ? 'active' : ''}`}
                onClick={() => onViewToggle(true)}
                title="Visualização 3D interativa"
              >
                3D
              </button>
              <button
                className={`view-btn ${!view3D ? 'active' : ''}`}
                onClick={() => onViewToggle(false)}
                title="Diagrama de fluxo 2D"
              >
                2D
              </button>
            </div>
          )}

          <div className={`status-badge ${validation.success ? 'valid' : 'invalid'}`}>
            {validation.success ? '✓ Modelo válido' : '✗ Erro no modelo'}
          </div>
        </div>
      </div>
    </header>
  );
}
