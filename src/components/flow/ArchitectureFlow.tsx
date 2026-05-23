import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { useArchitectureStore } from '../../store/useArchitectureStore';
import { entitiesToNodes, relationsToEdges } from '../../utils/graphMapping';
import { filterRelationsByView } from '../../utils/relationUtils';
import { ENTITY_ACCENT } from '../../types/architecture';
import type { ViewMode } from '../../store/useArchitectureStore';
import type { Node } from '@xyflow/react';
import '../../styles/flow.css';

const NODE_TYPES = { entity: CustomNode } as const;
const EDGE_TYPES = { relation: CustomEdge } as const;

const VIEW_MODES: ViewMode[] = ['ALL', 'POWER', 'DATA', 'COMMAND', 'THERMAL', 'STRUCTURAL', 'VERIFICATION'];
const LAYER_NAMES = ['Mission','Objective','Requirement','Function','System','Subsystem','Component','Interface','Budget','Risk','Verif.'];

export function ArchitectureFlow() {
  const {
    model, selectedId, activeLayer, viewMode,
    setSelectedId, setActiveLayer, setViewMode,
    getVisibleEntities,
  } = useArchitectureStore();

  const visibleEntities = getVisibleEntities();
  const visibleIds = useMemo(() => new Set(visibleEntities.map((e) => e.id)), [visibleEntities]);

  const filteredRelations = useMemo(
    () => filterRelationsByView(model.relations, viewMode),
    [model.relations, viewMode],
  );

  const computedNodes = useMemo(
    () => entitiesToNodes(visibleEntities, selectedId),
    [visibleEntities, selectedId],
  );

  const computedEdges = useMemo(
    () => relationsToEdges(filteredRelations, visibleIds),
    [filteredRelations, visibleIds],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  useEffect(() => { setNodes(computedNodes); }, [computedNodes, setNodes]);
  useEffect(() => { setEdges(computedEdges); }, [computedEdges, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => setSelectedId(node.id),
    [setSelectedId],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* View mode toolbar */}
      <div className="view-mode-bar">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode}
            className={`view-mode-btn${viewMode === mode ? ' active' : ''}`}
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Layer control */}
      <div className="layer-bar">
        <span className="layer-label">
          Layer {activeLayer}: {LAYER_NAMES[activeLayer] ?? ''}
        </span>
        <input
          type="range"
          min={0}
          max={10}
          value={activeLayer}
          onChange={(e) => setActiveLayer(Number(e.target.value))}
          className="layer-slider"
        />
        <div className="layer-steps">
          {LAYER_NAMES.map((name, i) => (
            <div
              key={i}
              className={`layer-step${i <= activeLayer ? ' active' : ''}`}
              title={name}
              onClick={() => setActiveLayer(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* React Flow canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.05}
          maxZoom={2}
          colorMode="dark"
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="#1e3a5f"
            gap={24}
            size={1}
          />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const d = node.data as Record<string, unknown>;
              const t = d?.entityType as string | undefined;
              return (t && t in ENTITY_ACCENT)
                ? ENTITY_ACCENT[t as keyof typeof ENTITY_ACCENT]
                : '#475569';
            }}
            maskColor="rgba(6,11,20,0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
