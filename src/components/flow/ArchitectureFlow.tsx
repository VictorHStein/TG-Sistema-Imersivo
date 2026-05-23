import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  BackgroundVariant, useReactFlow, ReactFlowProvider,
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

const VIEW_MODES: { key: ViewMode; label: string; color: string }[] = [
  { key: 'ALL',          label: 'Hierarquia', color: '#475569' },
  { key: 'POWER',        label: 'Potência',   color: '#facc15' },
  { key: 'DATA',         label: 'Dados',      color: '#38bdf8' },
  { key: 'COMMAND',      label: 'Comando',    color: '#818cf8' },
  { key: 'THERMAL',      label: 'Térmico',    color: '#fb923c' },
  { key: 'STRUCTURAL',   label: 'Estrutura',  color: '#94a3b8' },
  { key: 'VERIFICATION', label: 'Verificação',color: '#4ade80' },
];

const LAYER_NAMES = [
  '0 · Missão', '1 · Objetivo', '2 · Requisito', '3 · Função',
  '4 · Sistema', '5 · Subsistema', '6 · Componente', '7 · Interface',
  '8 · Budget', '9 · Risco', '10 · Verificação',
];

// Reads fitView from context once on first mount
function FitViewOnMount() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function FlowCanvas() {
  // Select ONLY the slice of state we actually need — not methods that return new arrays
  const model      = useArchitectureStore((s) => s.model);
  const activeLayer = useArchitectureStore((s) => s.activeLayer);
  const viewMode   = useArchitectureStore((s) => s.viewMode);
  const setSelectedId = useArchitectureStore((s) => s.setSelectedId);
  const setActiveLayer = useArchitectureStore((s) => s.setActiveLayer);
  const setViewMode   = useArchitectureStore((s) => s.setViewMode);
  const visibleEntityTypes = useArchitectureStore((s) => s.visibleEntityTypes);

  // Stable memoized visible entities — only recomputes on layer or type filter changes
  const visibleEntities = useMemo(
    () => model.entities.filter(
      (e) => (e.layer ?? 0) <= activeLayer && visibleEntityTypes.includes(e.type),
    ),
    [model.entities, activeLayer, visibleEntityTypes],
  );

  const visibleIds = useMemo(
    () => new Set(visibleEntities.map((e) => e.id)),
    [visibleEntities],
  );

  // Nodes — don't include selected state here; CustomNode reads it from store
  const nodes = useMemo(
    () => entitiesToNodes(visibleEntities, model.relations),
    [visibleEntities, model.relations],
  );

  // Edges — recompute only on layer, view mode, or visible entities changes
  const edges = useMemo(() => {
    const modeRelations = filterRelationsByView(model.relations, viewMode);
    return relationsToEdges(modeRelations, visibleIds, viewMode);
  }, [model.relations, viewMode, visibleIds]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => setSelectedId(node.id),
    [setSelectedId],
  );

  const { fitView } = useReactFlow();

  // Fit view when layer or view mode changes (not on selection)
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 50);
    return () => clearTimeout(t);
  }, [activeLayer, viewMode, fitView]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* View mode toolbar */}
      <div className="view-mode-bar">
        {VIEW_MODES.map((m) => (
          <button
            key={m.key}
            className={`view-mode-btn${viewMode === m.key ? ' active' : ''}`}
            style={viewMode === m.key ? { borderColor: m.color, color: m.color } : {}}
            onClick={() => setViewMode(m.key)}
          >
            {m.label}
          </button>
        ))}
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          alignSelf: 'center',
          paddingRight: 8,
        }}>
          {visibleEntities.length} nós · {edges.length} arestas
        </span>
      </div>

      {/* Layer control */}
      <div className="layer-bar">
        <span className="layer-label" style={{ minWidth: 160 }}>
          {LAYER_NAMES[activeLayer]}
        </span>
        <input
          type="range" min={0} max={10} value={activeLayer}
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
          onNodeClick={onNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          minZoom={0.04}
          maxZoom={2.5}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          <FitViewOnMount />
          <Background variant={BackgroundVariant.Dots} color="#1e3a5f" gap={28} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            zoomable
            pannable
            nodeColor={(node) => {
              const t = (node.data as Record<string, unknown>)?.entityType as string | undefined;
              return t ? (ENTITY_ACCENT[t as keyof typeof ENTITY_ACCENT] ?? '#475569') : '#475569';
            }}
            maskColor="rgba(6,11,20,0.75)"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

// Wrap in ReactFlowProvider so FitViewOnMount can call useReactFlow()
export function ArchitectureFlow() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
