import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ArchitectureNode, type ArchitectureNodeData } from './ArchitectureNode';
import { ArchitectureEdge, type ArchitectureEdgeData } from './ArchitectureEdge';
import { RowBackground } from './RowBackground';
import { SmartMinimap } from './SmartMinimap';
import { useKeyboardPan } from './useKeyboardPan';
import { NavHint } from '../layout/NavHint';
import { useFlowLayout, NODE_WIDTH, NODE_HEIGHT } from './useFlowLayout';
import { getRelationVisualStyle } from '../../domain/parser/relationStyle';
import {
  useArchitectureStore,
  computeVisibleEntities,
  computeVisibleRelations,
} from '../../state/architectureStore';

const NODE_TYPES = { entity: ArchitectureNode, rowbg: RowBackground } as const;
const EDGE_TYPES = { architecture: ArchitectureEdge } as const;

type HandleId = 'top' | 'right' | 'bottom' | 'left';

/**
 * Gap routing for cross-row edges.
 *
 *   1. Find every card on the rows STRICTLY BETWEEN source.row and target.row.
 *   2. If the geometric midpoint of the straight curve lands inside any of
 *      them (with 20 px tolerance), the curve would cross a card.
 *   3. Walk the cards left-to-right; identify the empty gaps between them.
 *      Also add a sentinel gap to the far left/right of the row.
 *   4. Pick the empty gap whose centre is CLOSEST to the straight midpoint.
 *   5. Return the control-point shift that makes the bezier midpoint land
 *      in that gap's centre. The bezier midpoint moves ~75 % of the
 *      control-point shift, so we divide by 0.75.
 *
 *   Returns 0 when no detour is needed.
 */
function computeObstacleShift(
  src: { x: number; y: number; row: number } | undefined,
  tgt: { x: number; y: number; row: number } | undefined,
  layoutPositions: Map<string, { x: number; y: number; row: number }>,
  nodeWidth: number,
): number {
  if (!src || !tgt) return 0;
  if (Math.abs(src.row - tgt.row) < 2) return 0;

  const minRow = Math.min(src.row, tgt.row);
  const maxRow = Math.max(src.row, tgt.row);
  const midX = (src.x + tgt.x) / 2 + nodeWidth / 2;

  // Collect cards on intermediate rows
  const cardRanges: Array<[number, number]> = [];
  for (const pos of layoutPositions.values()) {
    if (pos.row <= minRow || pos.row >= maxRow) continue;
    cardRanges.push([pos.x, pos.x + nodeWidth]);
  }
  if (cardRanges.length === 0) return 0;

  // Is midX colliding with any card (with tolerance)?
  const collides = cardRanges.some(([l, r]) => midX >= l - 20 && midX <= r + 20);
  if (!collides) return 0;

  // Sort by X
  cardRanges.sort((a, b) => a[0] - b[0]);

  // Build the list of empty gaps (centres). Each gap needs ≥ 80 px of room
  // so the curve actually fits.
  const gapCentres: number[] = [];
  for (let i = 0; i < cardRanges.length - 1; i++) {
    const right = cardRanges[i][1];
    const left = cardRanges[i + 1][0];
    if (left - right >= 80) gapCentres.push((right + left) / 2);
  }
  // Far-left and far-right outside the cards
  gapCentres.push(cardRanges[0][0] - 140);
  gapCentres.push(cardRanges[cardRanges.length - 1][1] + 140);

  // Pick the gap centre closest to the straight midpoint
  let bestGap = gapCentres[0];
  let bestDist = Math.abs(bestGap - midX);
  for (const g of gapCentres) {
    const d = Math.abs(g - midX);
    if (d < bestDist) {
      bestDist = d;
      bestGap = g;
    }
  }

  // Control-point shift that lands the bezier midpoint inside bestGap.
  const desiredMidShift = bestGap - midX;
  return desiredMidShift / 0.75;
}

/**
 * Pick the pair of (sourceHandle, targetHandle) that yields the most
 * natural connection given where the two cards sit relative to each other.
 *
 *  • Same row (|Δy| < 12 px) → top–top (the edge will arc above the row).
 *  • One row apart vertically  → bottom–top (or top–bottom going up).
 *  • Far horizontal, same height → right–left (or left–right).
 *
 * The actual curve is drawn by ArchitectureEdge as a cubic bezier whose
 * control points extend in the normal direction of each chosen side, so
 * the line always leaves and enters perpendicular to the card edge.
 */
function pickHandles(
  src: { x: number; y: number } | undefined,
  tgt: { x: number; y: number } | undefined,
): { source: HandleId; target: HandleId } {
  if (!src || !tgt) return { source: 'bottom', target: 'top' };
  const dx = tgt.x - src.x;
  const dy = tgt.y - src.y;

  // Intra-row: arc above the row
  if (Math.abs(dy) < 12) {
    return { source: 'top', target: 'top' };
  }

  // Different rows → vertical handles (most natural for hierarchy)
  if (Math.abs(dy) > 80) {
    return dy > 0
      ? { source: 'bottom', target: 'top' }
      : { source: 'top', target: 'bottom' };
  }

  // Slight vertical offset but mostly horizontal → side handles
  return dx > 0
    ? { source: 'right', target: 'left' }
    : { source: 'left', target: 'right' };
}

function FitOnChange({ depend, entityIds }: { depend: unknown[]; entityIds: string[] }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(
      () => fitView({
        padding: 0.06,
        duration: 450,
        maxZoom: 1.4,
        // Only entity nodes — ignore the wide swimlane backgrounds when fitting.
        nodes: entityIds.map((id) => ({ id })),
      }),
      80,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depend);
  return null;
}

/**
 * When a single entity becomes selected, smoothly re-frame the viewport
 * onto that entity AND its direct neighbours so the user can read every
 * incident relation without panning.
 *
 *   - selectedEntityId changes → fit-to (entity + neighbours)
 *   - selectedEntityId cleared  → fit-to (everything)
 *
 * The set of nodes to focus on is supplied by the parent (already computed
 * for the dim/highlight logic).
 */
function FitOnSelection({
  selectedId,
  focusIds,
  allEntityIds,
}: {
  selectedId: string | null;
  focusIds: string[];
  allEntityIds: string[];
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => {
      const nodes = selectedId
        ? focusIds.map((id) => ({ id }))
        : allEntityIds.map((id) => ({ id }));
      fitView({
        padding: selectedId ? 0.25 : 0.06,
        duration: 600,
        maxZoom: selectedId ? 1.0 : 1.4,
        nodes,
      });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);
  return null;
}

function FlowCanvas({ active = true }: { active?: boolean }) {
  useKeyboardPan(active);
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectedEntityId = useArchitectureStore((s) => s.selectedEntityId);
  const selectedRelationId = useArchitectureStore((s) => s.selectedRelationId);
  const explorationMode = useArchitectureStore((s) => s.explorationMode);
  const currentStep = useArchitectureStore((s) => s.currentStep);
  const focusedSubsystemId = useArchitectureStore((s) => s.focusedSubsystemId);
  const visibleRelationTypes = useArchitectureStore((s) => s.visibleRelationTypes);
  const visibleCategories = useArchitectureStore((s) => s.visibleCategories);
  const showOnlyCrossCategory = useArchitectureStore((s) => s.showOnlyCrossCategory);

  const visibleEntities = useMemo(
    () => computeVisibleEntities(architecture, visibleCategories, explorationMode, currentStep),
    [architecture, visibleCategories, explorationMode, currentStep],
  );
  const visibleRelations = useMemo(
    () => computeVisibleRelations(architecture, visibleEntities, visibleRelationTypes, explorationMode, currentStep, showOnlyCrossCategory),
    [architecture, visibleEntities, visibleRelationTypes, explorationMode, currentStep, showOnlyCrossCategory],
  );

  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const selectRelation = useArchitectureStore((s) => s.selectRelation);
  const minimapOpen = useArchitectureStore((s) => s.minimapOpen);
  const toggleMinimap = useArchitectureStore((s) => s.toggleMinimap);

  const layout = useFlowLayout(architecture, visibleEntities, visibleRelations);

  // Compute focus neighbors so we can dim non-related nodes/edges.
  //
  //   - Selection (click on a node)  → only that node + endpoints of its
  //     declared relations. Children-via-parentId are NOT auto-included; the
  //     user explicitly asked for "só ela deve ficar marcada, mostrando os
  //     relacionamentos dela com outras partes".
  //   - Focus  (HUD "Focar este elemento" button) → adds parentId children
  //     so you can isolate a subsystem with its components.
  const focusedNeighbors = useMemo(() => {
    if (!architecture || (!selectedEntityId && !focusedSubsystemId)) return null;
    const focusId = selectedEntityId ?? focusedSubsystemId!;
    const set = new Set<string>([focusId]);
    const relSet = new Set<string>();
    for (const r of architecture.relations) {
      if (r.source === focusId) { set.add(r.target); relSet.add(r.id); }
      if (r.target === focusId) { set.add(r.source); relSet.add(r.id); }
    }
    // Only include children-via-parentId when the user explicitly focused
    // (not on simple click-selection).
    if (focusedSubsystemId === focusId) {
      for (const e of architecture.entities) {
        if (e.parentId === focusId) set.add(e.id);
      }
    }
    return { entityIds: set, relationIds: relSet };
  }, [architecture, selectedEntityId, focusedSubsystemId]);

  /* ── Build React Flow nodes ──────────────────────────────────── */
  const flowNodes: Node[] = useMemo(() => {
    if (!architecture) return [];
    const rowWidth =
      Math.max(layout.bounds.maxX - layout.bounds.minX, NODE_WIDTH) + 140;
    const rowX = layout.bounds.minX - 70;

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
        breakdownCode: architecture.breakdownCodes[entity.id] ?? entity.id,
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

    // Count how many relations exist between each (source,target) pair so we
    // can offset parallel edges and never draw two on top of each other.
    const pairTotals = new Map<string, number>();
    const pairUsed = new Map<string, number>();
    for (const r of visibleRelations) {
      // Normalize key so A↔B and B↔A count together (parallels in any direction)
      const a = r.source < r.target ? r.source : r.target;
      const b = r.source < r.target ? r.target : r.source;
      const key = `${a}|${b}`;
      pairTotals.set(key, (pairTotals.get(key) ?? 0) + 1);
    }

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

      // Pair offset for parallel edges
      const a = relation.source < relation.target ? relation.source : relation.target;
      const b = relation.source < relation.target ? relation.target : relation.source;
      const key = `${a}|${b}`;
      const total = pairTotals.get(key) ?? 1;
      const idx = pairUsed.get(key) ?? 0;
      pairUsed.set(key, idx + 1);
      // [-N/2 … +N/2] centred. e.g. for total=3 idx=0,1,2 → -1, 0, +1
      const pairOffset = total > 1 ? (idx - (total - 1) / 2) : 0;

      // Animate flow for "active" semantic relations (power/data/command) unless dimmed
      const isFlowy =
        !isDimmed &&
        (relation.type === 'provides_power_to' ||
         relation.type === 'sends_data_to' ||
         relation.type === 'receives_command_from');

      // Pick the closest pair of sides on (source, target). The picker
      // returns the Handle ids we registered on ArchitectureNode.
      const srcPos = layout.positions.get(relation.source);
      const tgtPos = layout.positions.get(relation.target);
      const handles = pickHandles(srcPos, tgtPos);

      // If source and target are more than one row apart, the bezier
      // midpoint can land on top of a card on an intermediate row. Slide
      // the badge along the curve toward source (t=0.25) so it sits in
      // the empty gap right below the source row.
      const rowDist = srcPos && tgtPos
        ? Math.abs(srcPos.row - tgtPos.row)
        : 0;
      const badgeT = rowDist > 1 ? 0.25 : 0.5;

      // If any intermediate-row card sits in the straight path, compute
      // a horizontal shift so the curve bows around it instead of
      // crashing through.
      const obstacleShift = computeObstacleShift(srcPos, tgtPos, layout.positions, NODE_WIDTH);

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
        pairOffset,
        pairTotal: total,
        animated: isFlowy,
        badgeT,
        obstacleShift,
      };

      return {
        id: relation.id,
        source: relation.source,
        target: relation.target,
        sourceHandle: handles.source,
        targetHandle: handles.target,
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
        <div className="flow2d-toolbar__spacer" />
        <button
          className={`flow2d-toolbar__toggle${minimapOpen ? ' is-on' : ''}`}
          onClick={toggleMinimap}
          title={minimapOpen ? 'Esconder minimapa' : 'Mostrar minimapa'}
        >
          ▦ {minimapOpen ? 'Esconder minimapa' : 'Mostrar minimapa'}
        </button>
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
          minZoom={0.2}
          maxZoom={2.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'architecture' }}
        >
          <FitOnChange
            depend={[architecture?.metadata.version, visibleCategories.size, visibleRelationTypes.size, explorationMode, currentStep]}
            entityIds={visibleEntities.map((e) => e.id)}
          />
          <FitOnSelection
            selectedId={selectedEntityId}
            focusIds={focusedNeighbors ? [...focusedNeighbors.entityIds] : []}
            allEntityIds={visibleEntities.map((e) => e.id)}
          />
          <Background variant={BackgroundVariant.Dots} color="#1e3a5f55" gap={32} size={1.2} />
          <Controls showInteractive={false} />
        </ReactFlow>
        {minimapOpen && <SmartMinimap />}
        <NavHint mode="2d" />
      </div>
    </div>
  );
}

void NODE_HEIGHT;

export function ArchitectureFlow({ active = true }: { active?: boolean }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas active={active} />
    </ReactFlowProvider>
  );
}
