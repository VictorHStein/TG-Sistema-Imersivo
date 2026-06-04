import { useArchitectureStore } from '../../state/architectureStore';
import { JsonUploadPanel } from '../json/JsonUploadPanel';
import { ViewModeTabs } from './ViewModeTabs';

export function TopBar() {
  const architecture = useArchitectureStore((s) => s.architecture);
  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <div className="top-bar__dot" />
        <div className="top-bar__title">
          <div className="top-bar__project">{architecture?.metadata.projectName ?? 'Arquitetura'}</div>
          <div className="top-bar__sub">Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais</div>
        </div>
      </div>

      <div className="top-bar__center">
        <ViewModeTabs />
      </div>

      <div className="top-bar__actions">
        <JsonUploadPanel />
      </div>
    </header>
  );
}
