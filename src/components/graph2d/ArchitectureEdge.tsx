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
  /** Where to put the badge along the curve, in (0,1). 0.5 = midpoint. */
  badgeT: number;
  /** Signed horizontal shift in px for obstacle avoidance (cross-row edges). */
  obstacleShift: number;
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

  // Obstacle avoidance: signed horizontal X shift applied to both control
  // points. The bezier bows around any intermediate-row card that sits on
  // the straight path.
  const ox = d.obstacleShift ?? 0;

  const cp1x = sourceX + sNorm.x * extension + perpX * fan + ox;
  const cp1y = sourceY + sNorm.y * extension + perpY * fan;
  const cp2x = targetX + tNorm.x * extension + perpX * fan + ox;
  const cp2y = targetY + tNorm.y * extension + perpY * fan;

  const path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${targetX} ${targetY}`;

  // Badge position along the curve. t comes from the flow component: it
  // picks t=0.5 (midpoint) when source and target are at most one row
  // apart, and t=0.25 (closer to source) when farther, so the badge sits
  // in the empty gap below the source row instead of stacking on top of
  // an intermediate card.
  const t = d.badgeT ?? 0.5;
  const omt = 1 - t;
  const a = omt * omt * omt;
  const b = 3 * omt * omt * t;
  const c = 3 * omt * t * t;
  const e = t * t * t;
  const labelX = a * sourceX + b * cp1x + c * cp2x + e * targetX;
  const labelY = a * sourceY + b * cp1y + c * cp2y + e * targetY;

  const markerId = `arrow-${d.relationId}`;

  const dashFromStyle = vs.dashArray === 'none' ? undefined : vs.dashArray;
  const animDash = d.animated && !isDimmed ? '12 8' : undefined;
  const strokeDashArray = animDash ?? dashFromStyle;

  // When something is selected and this edge is unrelated, show only a
  // faint outline so the user can still feel the overall project shape
  // without it competing with the active relations.
  if (isDimmed) {
    return (
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: vs.color,
          strokeWidth: 1.2,
          opacity: 0.12,
          fill: 'none',
        }}
      />
    );
  }

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
              fill={vs.color}
              opacity={1}
            />
          </marker>
        )}
      </defs>

      {/* Soft glow underline for emphasized / selected cross-category edges */}
      {(isSelected || (isEmphasized && vs.isCrossCategory)) && (
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
          strokeWidth: vs.strokeWidth,
          strokeDasharray: strokeDashArray,
          strokeLinecap: 'round',
          opacity: vs.opacity,
          fill: 'none',
          animation: d.animated
            ? `arch-edge-flow ${isSelected ? 1.4 : 2.2}s linear infinite`
            : undefined,
        }}
        markerEnd={vs.isDirected ? `url(#${markerId})` : undefined}
      />

      {/* Numeric badge with tooltip */}
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
