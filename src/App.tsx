import { useArchitectureStore } from './state/architectureStore';
import { TopBar } from './components/layout/TopBar';
import { LegendPanel } from './components/layout/LegendPanel';
import { SidePanel } from './components/layout/SidePanel';
import { BottomTimeline } from './components/layout/BottomTimeline';
import { ArchitectureFlow } from './components/graph2d/ArchitectureFlow';
import { ArchitectureScene } from './components/scene3d/ArchitectureScene';
import { JsonErrorPanel } from './components/json/JsonErrorPanel';

export default function App() {
  const viewMode = useArchitectureStore((s) => s.viewMode);
  const architecture = useArchitectureStore((s) => s.architecture);
  const issues = useArchitectureStore((s) => s.lastIssues);

  return (
    <div className="app-root">
      <TopBar />

      <div className="app-body">
        <LegendPanel />

        <main className="app-canvas">
          {!architecture && (
            <div className="empty-state">Nenhuma arquitetura carregada.</div>
          )}

          {architecture && viewMode === '2d' && <ArchitectureFlow />}
          {architecture && viewMode === '3d' && <ArchitectureScene />}
          {architecture && viewMode === 'split' && (
            <div className="split-canvas">
              <div className="split-canvas__cell"><ArchitectureFlow /></div>
              <div className="split-canvas__divider" />
              <div className="split-canvas__cell"><ArchitectureScene /></div>
            </div>
          )}
        </main>

        <SidePanel />
      </div>

      <BottomTimeline />

      {issues.length > 0 && <JsonErrorPanel />}
    </div>
  );
}
