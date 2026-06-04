import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ArchitectureNode, type ArchitectureNodeData } from './ArchitectureNode';
import { ArchitectureEdge, type ArchitectureEdgeData } from './ArchitectureEdge';
import { RowBackground } from './RowBackground';
import { useFlowLayout, NODE_WIDTH, NODE_HEIGHT } from './useFlowLayout';
import { getRelationVisualStyle } from '../../domain/parser/relationStyle';
import {
  useArchitectureStore,
  selectVisibleEntities,
  selectVisibleRelations,
} from '../../state/architectureStore';

const NODE_TYPES = { entity: ArchitectureNode, rowbg: RowBackground } as const;
const EDGE_TYPES = { architecture: ArchitectureEdge } as const;

function FitOnChange({ depend }: { depend: unknown[] }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 350 }), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depend);
  return null;
}

function FlowCanvas() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectedEntityId = useArchitectureStore((s) => s.selectedEntityId);
  const selectedRelationId = useArchitectureStore((s) => s.selectedRelationId);
  const explorationMode = useArchitectureStore((s) => s.explorationMode);
  const currentStep = useArchitectureStore((s) => s.currentStep);
  const focusedSubsystemId = useArchitectureStore((s) => s.focusedSubsystemId);
  const visibleRelationTypes = useArchitectureStore((s) => s.visibleRelationTypes);
  const visibleCategories = useArchitectureStore((s) => s.visibleCategories);
  const showOnlyCrossCategory = useArchitectureStore((s) => s.showOnlyCrossCategory);

  const visibleEntities = useArchitectureStore(selectVisibleEntities);
  const visibleRelations = useArchitectureStore(selectVisibleRelations);

  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const selectRelation = useArchitectureStore((s) => s.selectRelation);

  const layout = useFlowLayout(architecture, visibleEntities, visibleRelations);

  // Compute focus neighbors so we can dim non-related nodes/edges
  const focusedNeighbors = useMemo(() => {
    if (!architecture || (!selectedEntityId && !focusedSubsystemId)) return null;
    const focusId = selectedEntityId ?? focusedSubsystemId!;
    const set = new Set<string>([focusId]);
    const relSet = new Set<string>();
    for (const r of architecture.relations) {
      if (r.source === focusId) { set.add(r.target); relSet.add(r.id); }
      if (r.target === focusId) { set.add(r.source); relSet.add(r.id); }
    }
    // Also add components belonging to the focused subsystem
    for (const e of architecture.entities) {
      if (e.parentId === focusId) set.add(e.id);
    }
    return { entityIds: set, relationIds: relSet };
  }, [architecture, selectedEntityId, focusedSubsystemId]);

  /* ── Build React Flow nodes ──────────────────────────────────── */
  const flowNodes: Node[] = useMemo(() => {
    if (!architecture) return [];
    const rowWidth =
      Math.max(layout.bounds.maxX - layout.bounds.minX, NODE_WIDTH) + 400;
    const rowX = layout.bounds.minX - 200;

    const rowNodes: Node[] = layout.rows.map((row) => ({
      id: `row-${row.id}`,
      type: 'rowbg',
      position: { x: rowX, y: row.y },
      data: {
        label: row.label,
        color: row.color,
        width: rowWidth,
        height: row.height,
      },
      selectable: false,
      draggable: false,
      focusable: false,
      style: { zIndex: -1 },
      zIndex: -1,
    }));

    const entityNodes: Node[] = visibleEntities.map((entity) => {
      const pos = layout.positions.get(entity.id) ?? { x: 0, y: 0 };
      const cat = architecture.categoriesById[entity.category];
      const isSelected = entity.id === selectedEntityId;
      const isHighlighted = focusedNeighbors?.entityIds.has(entity.id) ?? false;
      const isDimmed =
        (selectedEntityId !== null || focusedSubsystemId !== null) && !isHighlighted;

      const data: ArchitectureNodeData = {
        entityId: entity.id,
        name: entity.name,
        category: cat,
        status: entity.status,
        isSelected,
        isDimmed,
        isHighlighted: isHighlighted && !isSelected,
        step: entity.step,
        parentId: entity.parentId,
      };
      return {
        id: entity.id,
        type: 'entity',
        position: { x: pos.x, y: pos.y },
        data: data as unknown as Record<string, unknown>,
        draggable: false,
        connectable: false,
        zIndex: isSelected ? 20 : 10,
      };
    });

    return [...rowNodes, ...entityNodes];
  }, [
    architecture, visibleEntities, layout, selectedEntityId, focusedSubsystemId, focusedNeighbors,
  ]);

  /* ── Build React Flow edges ──────────────────────────────────── */
  const flowEdges: Edge[] = useMemo(() => {
    if (!architecture) return [];
    return visibleRelations.map((relation) => {
      const rt = architecture.relationTypesById[relation.type];
      const source = architecture.entitiesById[relation.source];
      const target = architecture.entitiesById[relation.target];
      const isSelected = relation.id === selectedRelationId;
      const inFocus = focusedNeighbors?.relationIds.has(relation.id) ?? false;
      const isDimmed =
        (selectedEntityId !== null || focusedSubsystemId !== null) && !inFocus && !isSelected;
      const isEmphasized = isSelected || inFocus;

      const vs = getRelationVisualStyle(relation, rt, source, target, {
        selected: isSelected,
        emphasizedByFilter: isEmphasized,
        dimmed: isDimmed,
      });

      const data: ArchitectureEdgeData = {
        relationId: relation.id,
        style: vs,
        relationTypeLabel: rt.label,
        relationIndex: rt.index,
        description: rt.description,
        isSelected,
        isDimmed,
        isEmphasized,
        onClick: selectRelation,
      };

      return {
        id: relation.id,
        source: relation.source,
        target: relation.target,
        type: 'architecture',
        data: data as unknown as Record<string, unknown>,
        zIndex: isSelected ? 30 : isDimmed ? 1 : 5,
      };
    });
  }, [
    architecture, visibleRelations, selectedRelationId, selectedEntityId, focusedSubsystemId, focusedNeighbors, selectRelation,
  ]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      if (node.type === 'entity') selectEntity(node.id);
    },
    [selectEntity],
  );

  const onPaneClick = useCallback(() => {
    selectEntity(null);
    selectRelation(null);
  }, [selectEntity, selectRelation]);

  const showStats = visibleEntities.length;

  return (
    <div className="flow2d-shell">
      <div className="flow2d-toolbar">
        <span className="flow2d-toolbar__stat">
          <strong>{showStats}</strong> entidades · <strong>{visibleRelations.length}</strong> relações
        </span>
        {explorationMode === 'step' && architecture && (
          <span className="flow2d-toolbar__stat">
            Etapa <strong>{currentStep}</strong> / {architecture.maxStep}
          </span>
        )}
        {showOnlyCrossCategory && (
          <span className="flow2d-toolbar__chip">só relações entre categorias</span>
        )}
        {focusedSubsystemId && (
          <span className="flow2d-toolbar__chip">
            foco: {architecture?.entitiesById[focusedSubsystemId]?.name ?? focusedSubsystemId}
          </span>
        )}
      </div>

      <div className="flow2d-canvas">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          minZoom={0.08}
          maxZoom={1.8}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'architecture' }}
        >
          <FitOnChange depend={[architecture?.metadata.version, visibleCategories.size, visibleRelationTypes.size, explorationMode, currentStep]} />
          <Background variant={BackgroundVariant.Dots} color="#1e3a5f55" gap={32} size={1.2} />
          <Controls showInteractive={false} />
          <MiniMap
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.type === 'rowbg') return 'transparent';
              const d = node.data as ArchitectureNodeData | undefined;
              return d?.category?.color ?? '#475569';
            }}
            nodeStrokeWidth={0}
            maskColor="rgba(2,6,23,0.85)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

void NODE_HEIGHT;

export function ArchitectureFlow() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
