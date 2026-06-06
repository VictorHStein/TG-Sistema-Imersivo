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
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const isIntraRow = Math.abs(dy) < 12;

  let mx: number;
  let my: number;

  if (isIntraRow) {
    // Force a strong upward arc above the row. Tall enough to clear card
    // heights (~86px) plus padding. Parallel edges fan out by index.
    const horizDist = Math.abs(dx);
    const arcHeight = Math.max(110, Math.min(horizDist * 0.32, 220));
    mx = (sourceX + targetX) / 2 + d.pairOffset * 22;
    my = (sourceY + targetY) / 2 - arcHeight - Math.abs(d.pairOffset) * 18;
  } else {
    // Cross-row: perpendicular bezier with parallel-edge offset.
    const px = -dy / len;
    const py = dx / len;
    const baseCurl = Math.min(len * 0.18, 60);
    const parallelOffset = d.pairOffset * 60;
    const offset = baseCurl + parallelOffset;
    mx = (sourceX + targetX) / 2 + px * offset;
    my = (sourceY + targetY) / 2 + py * offset;
  }

  const path = `M ${sourceX} ${sourceY} Q ${mx} ${my} ${targetX} ${targetY}`;

  // Bezier midpoint at t=0.5
  const labelX = 0.25 * sourceX + 0.5 * mx + 0.25 * targetX;
  const labelY = 0.25 * sourceY + 0.5 * my + 0.25 * targetY;

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
          stroke: isDimmed ? '#1f3050' : vs.color,
          strokeWidth: vs.strokeWidth,
          strokeDasharray: strokeDashArray,
          strokeLinecap: 'round',
          opacity: isDimmed ? 0.18 : vs.opacity,
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
