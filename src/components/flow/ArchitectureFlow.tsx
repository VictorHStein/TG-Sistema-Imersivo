import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  BackgroundVariant, useReactFlow, ReactFlowProvider,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { SwimlaneNode } from './SwimlaneNode';
import { useArchitectureStore } from '../../store/useArchitectureStore';
import { entitiesToNodes, relationsToEdges } from '../../utils/graphMapping';
import { filterRelationsByView } from '../../utils/relationUtils';
import { ENTITY_ACCENT, ENTITY_LAYERS } from '../../types/architecture';
import type { ViewMode } from '../../store/useArchitectureStore';
import '../../styles/flow.css';

const NODE_TYPES = { entity: CustomNode, swimlane: SwimlaneNode } as const;
const EDGE_TYPES = { relation: CustomEdge } as const;

// Layer height constants — must match hierarchicalLayout.ts
const NODE_H = 80;
const V_GAP  = 120;
const LAYER_STEP = NODE_H + V_GAP;  // 200px per layer
const LANE_PAD   = 30;              // padding above/below nodes inside lane
const LANE_H     = NODE_H + LANE_PAD * 2; // 140px
const LANE_W     = 10000;
const LANE_X     = -LANE_W / 2;

const LANE_CONFIG: Array<{
  layer: number; label: string; color: string; accent: string;
}> = [
  { layer: 0,  label: 'Missão',           color: 'rgba(56,189,248,0.07)',  accent: '#38bdf8' },
  { layer: 1,  label: 'Objetivos',         color: 'rgba(34,211,238,0.07)', accent: '#22d3ee' },
  { layer: 2,  label: 'Requisitos',        color: 'rgba(250,204,21,0.07)', accent: '#facc15' },
  { layer: 3,  label: 'Funções / Ops',     color: 'rgba(167,139,250,0.08)',accent: '#a78bfa' },
  { layer: 4,  label: 'Sistema / Segmentos',color:'rgba(74,222,128,0.06)', accent: '#4ade80' },
  { layer: 5,  label: 'Subsistemas',       color: 'rgba(96,165,250,0.07)', accent: '#60a5fa' },
  { layer: 6,  label: 'Componentes',       color: 'rgba(148,163,184,0.06)',accent: '#94a3b8' },
  { layer: 7,  label: 'Interfaces',        color: 'rgba(251,146,60,0.06)', accent: '#fb923c' },
  { layer: 8,  label: 'Budgets',           color: 'rgba(134,239,172,0.05)',accent: '#86efac' },
  { layer: 9,  label: 'Riscos',            color: 'rgba(248,113,113,0.07)',accent: '#f87171' },
  { layer: 10, label: 'Verificação',       color: 'rgba(74,222,128,0.06)', accent: '#4ade80' },
];

const VIEW_MODES: { key: ViewMode; label: string; color: string }[] = [
  { key: 'ALL',          label: 'Hierarquia',  color: '#60a5fa' },
  { key: 'POWER',        label: 'Potência',    color: '#facc15' },
  { key: 'DATA',         label: 'Dados',       color: '#38bdf8' },
  { key: 'COMMAND',      label: 'Comando',     color: '#818cf8' },
  { key: 'THERMAL',      label: 'Térmico',     color: '#fb923c' },
  { key: 'STRUCTURAL',   label: 'Estrutura',   color: '#94a3b8' },
  { key: 'VERIFICATION', label: 'Verificação', color: '#4ade80' },
];

function FitViewOnMount() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 120);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function FlowCanvas() {
  const model            = useArchitectureStore((s) => s.model);
  const activeLayer      = useArchitectureStore((s) => s.activeLayer);
  const viewMode         = useArchitectureStore((s) => s.viewMode);
  const setSelectedId    = useArchitectureStore((s) => s.setSelectedId);
  const setActiveLayer   = useArchitectureStore((s) => s.setActiveLayer);
  const setViewMode      = useArchitectureStore((s) => s.setViewMode);
  const visibleTypes     = useArchitectureStore((s) => s.visibleEntityTypes);

  const { fitView } = useReactFlow();

  // Fit view only on layer or mode change — not on selection
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 350 }), 60);
    return () => clearTimeout(t);
  }, [activeLayer, viewMode, fitView]);

  // Visible entities — stable reference, changes only on layer/type filter
  const visibleEntities = useMemo(
    () => model.entities.filter(
      (e) => (e.layer ?? ENTITY_LAYERS[e.type] ?? 0) <= activeLayer && visibleTypes.includes(e.type),
    ),
    [model.entities, activeLayer, visibleTypes],
  );

  const visibleIds = useMemo(
    () => new Set(visibleEntities.map((e) => e.id)),
    [visibleEntities],
  );

  // Entity nodes (no selected flag — CustomNode reads from store directly)
  const entityNodes: Node[] = useMemo(
    () => entitiesToNodes(visibleEntities, model.relations),
    [visibleEntities, model.relations],
  );

  // Swimlane background nodes — one per visible layer
  const swimlaneNodes: Node[] = useMemo(() => {
    const visibleLayers = new Set(
      visibleEntities.map((e) => e.layer ?? ENTITY_LAYERS[e.type] ?? 0),
    );
    return LANE_CONFIG
      .filter((cfg) => visibleLayers.has(cfg.layer))
      .map((cfg) => ({
        id: `lane-${cfg.layer}`,
        type: 'swimlane',
        position: {
          x: LANE_X,
          y: cfg.layer * LAYER_STEP - LANE_PAD,
        },
        style: { width: LANE_W, height: LANE_H, zIndex: -1 },
        data: {
          label: cfg.label,
          color: cfg.color,
          accent: cfg.accent,
          layerIndex: cfg.layer,
        },
        selectable: false,
        draggable: false,
        focusable: false,
        zIndex: -1,
      }));
  }, [visibleEntities]);

  const allNodes = useMemo(
    () => [...swimlaneNodes, ...entityNodes],
    [swimlaneNodes, entityNodes],
  );

  // Edges filtered by view mode
  const edges = useMemo(() => {
    const modeRels = filterRelationsByView(model.relations, viewMode);
    return relationsToEdges(modeRels, visibleIds, viewMode);
  }, [model.relations, viewMode, visibleIds]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type !== 'swimlane') setSelectedId(node.id);
    },
    [setSelectedId],
  );

  const currentMode = VIEW_MODES.find((m) => m.key === viewMode)!;
  const visibleLaneLabel = LANE_CONFIG.find((c) => c.layer === activeLayer)?.label ?? '';

  return (
    <div className="flow-shell">
      {/* Toolbar */}
      <div className="view-mode-bar">
        {VIEW_MODES.map((m) => (
          <button
            key={m.key}
            className={`view-mode-btn${viewMode === m.key ? ' active' : ''}`}
            style={viewMode === m.key ? { borderColor: m.color, color: m.color, background: `${m.color}18` } : {}}
            onClick={() => setViewMode(m.key)}
          >
            {m.label}
          </button>
        ))}
        <div className="view-mode-bar__spacer" />
        <span className="view-mode-bar__stat">
          {visibleEntities.length} nós · {edges.length} relações
        </span>
      </div>

      {/* Layer slider */}
      <div className="layer-bar">
        <span className="layer-bar__label" style={{ color: currentMode.color }}>
          Até: <strong>{visibleLaneLabel}</strong>
        </span>
        <input
          type="range" min={0} max={10} value={activeLayer}
          onChange={(e) => setActiveLayer(Number(e.target.value))}
          className="layer-slider"
          style={{ accentColor: currentMode.color }}
        />
        <div className="layer-steps">
          {LANE_CONFIG.map(({ layer, accent }) => (
            <button
              key={layer}
              className={`layer-step${layer <= activeLayer ? ' active' : ''}`}
              title={LANE_CONFIG[layer]?.label}
              onClick={() => setActiveLayer(layer)}
              style={layer <= activeLayer ? { background: accent } : {}}
            />
          ))}
        </div>
      </div>

      {/* React Flow */}
      <div className="react-flow-wrapper">
        <ReactFlow
          nodes={allNodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodeClick={onNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          minZoom={0.08}
          maxZoom={1.8}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'relation' }}
        >
          <FitViewOnMount />
          <Background variant={BackgroundVariant.Dots} color="#1e3a5f44" gap={32} size={1.5} />
          <Controls showInteractive={false} />
          <MiniMap
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.type === 'swimlane') return 'transparent';
              const t = (node.data as Record<string, unknown>)?.entityType as string | undefined;
              return t ? (ENTITY_ACCENT[t as keyof typeof ENTITY_ACCENT] ?? '#475569') : '#475569';
            }}
            nodeStrokeWidth={0}
            maskColor="rgba(4,6,16,0.78)"
          />
        </ReactFlow>
      </div>

      {/* Relation legend */}
      <RelationLegend mode={viewMode} />
    </div>
  );
}

const LEGEND_ITEMS: Record<ViewMode, Array<{ label: string; color: string; dash?: boolean }>> = {
  ALL:          [{ label: 'contains', color: '#475569' }],
  POWER:        [{ label: 'provides_power_to', color: '#facc15' }],
  DATA:         [
    { label: 'sends_data_to', color: '#38bdf8' },
    { label: 'communicates_with', color: '#67e8f9', dash: true },
    { label: 'uses', color: '#c4b5fd', dash: true },
  ],
  COMMAND:      [
    { label: 'controls', color: '#86efac' },
    { label: 'receives_command_from', color: '#818cf8', dash: true },
    { label: 'actuates', color: '#bbf7d0', dash: true },
    { label: 'measures', color: '#7dd3fc', dash: true },
  ],
  THERMAL:      [{ label: 'thermally_coupled_to', color: '#fb923c' }],
  STRUCTURAL:   [
    { label: 'mechanically_attached_to', color: '#94a3b8' },
    { label: 'contains', color: '#475569', dash: true },
  ],
  VERIFICATION: [
    { label: 'satisfies', color: '#22d3ee', dash: true },
    { label: 'verifies', color: '#4ade80' },
    { label: 'validates', color: '#86efac', dash: true },
    { label: 'constrains', color: '#f87171', dash: true },
    { label: 'mitigates', color: '#34d399' },
  ],
};

function RelationLegend({ mode }: { mode: ViewMode }) {
  const items = LEGEND_ITEMS[mode] ?? [];
  return (
    <div className="relation-legend">
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <svg width="32" height="12" style={{ flexShrink: 0 }}>
            <line
              x1="0" y1="6" x2="32" y2="6"
              stroke={item.color}
              strokeWidth="2"
              strokeDasharray={item.dash ? '6 3' : 'none'}
            />
            <polygon points="28,2 34,6 28,10" fill={item.color} />
          </svg>
          <span className="legend-label">{item.label.replace(/_/g, ' ')}</span>
        </div>
      ))}
    </div>
  );
}

export function ArchitectureFlow() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
