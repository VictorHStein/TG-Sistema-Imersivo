import { useEffect } from 'react';
import { useArchitectureStore } from './state/architectureStore';
import { TopBar } from './components/layout/TopBar';
import { LegendPanel } from './components/layout/LegendPanel';
import { SidePanel } from './components/layout/SidePanel';
import { BottomTimeline } from './components/layout/BottomTimeline';
import { ArchitectureFlow } from './components/graph2d/ArchitectureFlow';
import { ArchitectureScene } from './components/scene3d/ArchitectureScene';
import { JsonErrorPanel } from './components/json/JsonErrorPanel';
import { TutorialView } from './components/layout/TutorialView';

export default function App() {
  const viewMode = useArchitectureStore((s) => s.viewMode);
  const architecture = useArchitectureStore((s) => s.architecture);
  const issues = useArchitectureStore((s) => s.lastIssues);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const selectRelation = useArchitectureStore((s) => s.selectRelation);
  const focusSubsystem = useArchitectureStore((s) => s.focusSubsystem);

  // Global keyboard shortcuts.
  //
  //   • ESC → clear selection, focus, and relation selection. Works from
  //     anywhere on the page so the user can always escape into the
  //     "nothing selected" overview state.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (e.key === 'Escape' && !inEditable) {
        selectEntity(null);
        selectRelation(null);
        focusSubsystem(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectEntity, selectRelation, focusSubsystem]);

  const isTutorial = viewMode === 'tutorial';

  return (
    <div className={`app-root${isTutorial ? ' app-root--tutorial' : ''}`}>
      <TopBar />

      <div className="app-body">
        {!isTutorial && <LegendPanel />}

        <main className="app-canvas">
          {!architecture && !isTutorial && (
            <div className="empty-state">Nenhuma arquitetura carregada.</div>
          )}

          {isTutorial && <TutorialView />}
          {!isTutorial && architecture && viewMode === '2d' && <ArchitectureFlow />}
          {!isTutorial && architecture && viewMode === '3d' && <ArchitectureScene />}
          {!isTutorial && architecture && viewMode === 'split' && (
            <div className="split-canvas">
              <div className="split-canvas__cell"><ArchitectureFlow /></div>
              <div className="split-canvas__divider" />
              <div className="split-canvas__cell"><ArchitectureScene /></div>
            </div>
          )}
        </main>

        {!isTutorial && <SidePanel />}
      </div>

      {!isTutorial && <BottomTimeline />}

      {issues.length > 0 && <JsonErrorPanel />}
    </div>
  );
}
