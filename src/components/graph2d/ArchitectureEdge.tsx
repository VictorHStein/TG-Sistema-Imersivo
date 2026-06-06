import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';
import { RelationBadge } from './RelationBadge';
import type { RelationVisualStyle } from '../../domain/parser/relationStyle';

export interface ArchitectureEdgeData extends Record<string, unknown> {
  relationId: string;
  style: RelationVisualStyle;
  relationTypeLabel: string;
  relationIndex: number;
  description?: string;
  isSelected: boolean;
  isDimmed: boolean;
  isEmphasized: boolean;
  onClick?: (id: string) => void;
  /** Symmetric offset for parallel edges between the same node pair (… -1, 0, +1 …). */
  pairOffset: number;
  pairTotal: number;
  /** When true, animate a dash flow along the path. */
  animated: boolean;
}

/**
 * Edge with two routing strategies, depending on geometry:
 *
 *   • Intra-row  (sourceY ≈ targetY)  — typical for subsystem↔subsystem
 *     interfaces. The edge arcs HIGH above the row so it never crosses
 *     intermediate cards. Parallel edges fan out vertically.
 *
 *   • Cross-row  — quadratic bezier with a perpendicular control offset
 *     so parallel edges don't overlap.
 *
 * The numeric badge sits at the curve's midpoint. The text relation-type
 * label is NOT rendered on the edge anymore — the colour + numbered badge
 * already encode the type, and stacking a text pill on every selected edge
 * (when one entity has 6+ relations) produces visual noise.
 */
function ArchitectureEdgeImpl(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, data } = props;
  const d = data as ArchitectureEdgeData;
  const { style: vs, isSelected, isDimmed, isEmphasized, relationIndex } = d;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const isIntraRow = Math.abs(dy) < 12;

  let path: string;
  let labelX: number;
  let labelY: number;

  if (isIntraRow) {
    // Strong upward bezier arc above the row so edges between subsystems
    // don't cross intermediate cards. Parallel edges fan out vertically.
    const horizDist = Math.abs(dx);
    const arcHeight = Math.max(110, Math.min(horizDist * 0.32, 220));
    const mx = (sourceX + targetX) / 2 + d.pairOffset * 22;
    const my = (sourceY + targetY) / 2 - arcHeight - Math.abs(d.pairOffset) * 18;
    path = `M ${sourceX} ${sourceY} Q ${mx} ${my} ${targetX} ${targetY}`;
    labelX = 0.25 * sourceX + 0.5 * mx + 0.25 * targetX;
    labelY = 0.25 * sourceY + 0.5 * my + 0.25 * targetY;
  } else {
    // Cross-row: orthogonal "step" routing. The edge leaves the source
    // vertically, runs along a horizontal lane between the rows, then
    // descends vertically into the target. This never crosses through
    // a card — each segment is in the gap between rows or in the
    // vertical channel a node occupies.
    //
    // Parallel edges between the same pair offset their lane by `pairOffset`.
    const laneY = sourceY + dy / 2 + d.pairOffset * 22;
    const r = 16; // corner radius
    // If horizontal distance is small, the rounded corners would overlap →
    // fall back to a smooth bezier
    if (Math.abs(dx) < r * 2 + 4) {
      const cx = (sourceX + targetX) / 2 + d.pairOffset * 28;
      path = `M ${sourceX} ${sourceY} C ${cx} ${laneY} ${cx} ${laneY} ${targetX} ${targetY}`;
      labelX = (sourceX + targetX) / 2;
      labelY = laneY;
    } else {
      const dir = dx > 0 ? 1 : -1;
      path = [
        `M ${sourceX} ${sourceY}`,
        `L ${sourceX} ${laneY - r * Math.sign(dy)}`,
        // Round corner from vertical → horizontal
        `Q ${sourceX} ${laneY} ${sourceX + r * dir} ${laneY}`,
        `L ${targetX - r * dir} ${laneY}`,
        // Round corner from horizontal → vertical
        `Q ${targetX} ${laneY} ${targetX} ${laneY + r * Math.sign(dy)}`,
        `L ${targetX} ${targetY}`,
      ].join(' ');
      labelX = (sourceX + targetX) / 2;
      labelY = laneY;
    }
  }

  const markerId = `arrow-${d.relationId}`;

  const dashFromStyle = vs.dashArray === 'none' ? undefined : vs.dashArray;
  const animDash = d.animated && !isDimmed ? '12 8' : undefined;
  const strokeDashArray = animDash ?? dashFromStyle;

  return (
    <>
      <defs>
        {vs.isDirected && (
          <marker
            id={markerId}
            markerWidth="14"
            markerHeight="14"
            refX="11"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M0,1 L0,9 L11,5 z"
              fill={isDimmed ? '#2a3a55' : vs.color}
              opacity={isDimmed ? 0.45 : 1}
            />
          </marker>
        )}
      </defs>

      {/* Soft glow underline for emphasized / selected cross-category edges */}
      {(isSelected || (isEmphasized && vs.isCrossCategory)) && !isDimmed && (
        <BaseEdge
          id={`${id}-glow`}
          path={path}
          style={{
            stroke: vs.color,
            strokeWidth: vs.strokeWidth + 8,
            opacity: 0.18,
            filter: `blur(2px)`,
            fill: 'none',
          }}
        />
      )}

      <BaseEdge
        id={id}
        path={path}
        style={{
          // Dimmed edges keep their type colour but at low opacity, so the
          // user can still read the project's overall shape while focusing
          // on one selection.
          stroke: isDimmed ? vs.color : vs.color,
          strokeWidth: isDimmed ? Math.max(vs.strokeWidth - 0.6, 1) : vs.strokeWidth,
          strokeDasharray: strokeDashArray,
          strokeLinecap: 'round',
          opacity: isDimmed ? 0.35 : vs.opacity,
          fill: 'none',
          animation: d.animated && !isDimmed
            ? `arch-edge-flow ${isSelected ? 1.4 : 2.2}s linear infinite`
            : undefined,
        }}
        markerEnd={vs.isDirected && !isDimmed ? `url(#${markerId})` : undefined}
      />

      {/* Numeric badge — only when not dimmed. Tooltip carries the label
          and description so the user can identify the relation without us
          stacking pills on every edge. */}
      {!isDimmed && (
        <EdgeLabelRenderer>
          <div
            className="arch-edge-badge-wrap"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={(e) => {
              e.stopPropagation();
              d.onClick?.(d.relationId);
            }}
            title={`${relationIndex}. ${d.relationTypeLabel}${d.description ? ` — ${d.description}` : ''}`}
          >
            <RelationBadge index={relationIndex} color={vs.color} emphasized={isEmphasized} selected={isSelected} />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const ArchitectureEdge = memo(ArchitectureEdgeImpl);
