import { useState, useMemo } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Navigation } from './components/layout/Navigation';
import { ArchitectureFlow2D } from './components/flow/ArchitectureFlow2D';
import { ArchitectureScene3D } from './components/scene3d/ArchitectureScene3D';
import { DetailsSidebar } from './components/panels/DetailsSidebar';
import { TraceabilityView } from './components/panels/TraceabilityView';
import { DashboardView } from './components/panels/DashboardView';
import { DemoModel, modelSchema } from './data/demo';
import type { ElementNode } from './types';

type TabView = 'architecture' | 'traceability' | 'dashboard';

const allNodes = (model: typeof DemoModel): ElementNode[] => [
  model.mission,
  ...model.objectives,
  ...model.requirements,
  ...model.functions,
  ...model.systems,
  ...model.components,
  ...model.interfaces
];

function App() {
  const [activeTab, setActiveTab] = useState<TabView>('architecture');
  const [selectedId, setSelectedId] = useState(DemoModel.mission.id);
  const [view3D, setView3D] = useState(true);

  const nodes = useMemo(() => allNodes(DemoModel), []);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const validation = modelSchema.safeParse(DemoModel);

  return (
    <AppShell>
      <Navigation 
        validation={validation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        view3D={view3D}
        onViewToggle={setView3D}
        title={DemoModel.mission.name}
      />
      <div className="app-main">
        <main className="app-canvas">
          {activeTab === 'architecture' && (
            view3D ? (
              <ArchitectureScene3D
                model={DemoModel}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <ArchitectureFlow2D
                model={DemoModel}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )
          )}
          {activeTab === 'traceability' && (
            <TraceabilityView model={DemoModel} selectedId={selectedId} />
          )}
          {activeTab === 'dashboard' && (
            <DashboardView model={DemoModel} />
          )}
        </main>
        <aside className="app-sidebar">
          <DetailsSidebar 
            node={selectedNode} 
            model={DemoModel}
            onSelectNode={setSelectedId}
          />
        </aside>
      </div>
    </AppShell>
  );
}

export default App;
