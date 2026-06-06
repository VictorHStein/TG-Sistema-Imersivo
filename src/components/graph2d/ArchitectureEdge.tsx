import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, Position, type EdgeProps } from '@xyflow/react';
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
 * Cubic-bezier edge that leaves and enters each card PERPENDICULAR to the
 * chosen handle side.
 *
 *   source side normal     target side normal
 *           ↓                     ↑
 *      ╭────────────╮         ╭────────────╮
 *      │   source   │   ↘ ↗   │   target   │
 *      ╰────────────╯         ╰────────────╯
 *
 * The control points extend out along those normals so the curve looks
 * like it grew out of the card naturally instead of grazing its corner.
 * Extension length is proportional to the source→target distance, so
 * long edges curve gently and short edges turn quickly.
 *
 * Parallel edges between the same pair are offset perpendicular to the
 * source→target line so they fan out instead of stacking.
 */
function ArchitectureEdgeImpl(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
  const d = data as ArchitectureEdgeData;
  const { style: vs, isSelected, isDimmed, isEmphasized, relationIndex } = d;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  // Extension is the length of each control-point "arm". Longer edges →
  // longer arms → softer curve.
  const extension = Math.max(50, Math.min(distance * 0.42, 200));

  const sNorm = positionToNormal(sourcePosition);
  const tNorm = positionToNormal(targetPosition);

  // Perpendicular to the source→target line, used to fan parallel edges
  const perpX = -dy / distance;
  const perpY = dx / distance;
  const fan = d.pairOffset * 40;

  const cp1x = sourceX + sNorm.x * extension + perpX * fan;
  const cp1y = sourceY + sNorm.y * extension + perpY * fan;
  const cp2x = targetX + tNorm.x * extension + perpX * fan;
  const cp2y = targetY + tNorm.y * extension + perpY * fan;

  const path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${targetX} ${targetY}`;

  // Cubic bezier midpoint at t=0.5
  const labelX = 0.125 * sourceX + 0.375 * cp1x + 0.375 * cp2x + 0.125 * targetX;
  const labelY = 0.125 * sourceY + 0.375 * cp1y + 0.375 * cp2y + 0.125 * targetY;

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
              opacity={isDimmed ? 0.5 : 1}
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
          stroke: vs.color,
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

      {/* Numeric badge with tooltip — colour + number already identify the
          relation type, so no text pill on the edge itself. */}
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

/**
 * Outward normal vector for each Handle position. The bezier control
 * point extends along this vector so the curve leaves the card
 * perpendicular to the selected side.
 */
function positionToNormal(p: Position): { x: number; y: number } {
  switch (p) {
    case Position.Top:    return { x: 0,  y: -1 };
    case Position.Right:  return { x: 1,  y: 0 };
    case Position.Bottom: return { x: 0,  y: 1 };
    case Position.Left:   return { x: -1, y: 0 };
  }
}

export const ArchitectureEdge = memo(ArchitectureEdgeImpl);
