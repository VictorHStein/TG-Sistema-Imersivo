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
 * Quadratic-bezier edge with:
 *  - control point offset perpendicular to (source→target) so parallel edges
 *    between the same pair never overlap
 *  - directional arrowhead at the target
 *  - numeric badge over the midpoint
 *  - optional animated dash flow for power/data/command relations
 */
function ArchitectureEdgeImpl(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, data } = props;
  const d = data as ArchitectureEdgeData;
  const { style: vs, isSelected, isDimmed, isEmphasized, relationIndex } = d;

  // Perpendicular offset → split parallel edges
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len;
  const py = dx / len;

  // Base "curl" — always curve a bit so straight-down edges still look organic
  const baseCurl = Math.min(len * 0.18, 60);
  const parallelOffset = d.pairOffset * 60; // 60px between adjacent parallels
  const offset = baseCurl + parallelOffset;

  const mx = (sourceX + targetX) / 2 + px * offset;
  const my = (sourceY + targetY) / 2 + py * offset;

  const path = `M ${sourceX} ${sourceY} Q ${mx} ${my} ${targetX} ${targetY}`;

  // Badge sits at the bezier midpoint (t=0.5)
  const labelX = 0.25 * sourceX + 0.5 * mx + 0.25 * targetX;
  const labelY = 0.25 * sourceY + 0.5 * my + 0.25 * targetY;

  const markerId = `arrow-${d.relationId}`;

  // Stroke dash either from line style OR from animation
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
          stroke: isDimmed ? '#2a3a55' : vs.color,
          strokeWidth: vs.strokeWidth,
          strokeDasharray: strokeDashArray,
          strokeLinecap: 'round',
          opacity: vs.opacity,
          fill: 'none',
          // Animate dash flow
          animation: d.animated && !isDimmed
            ? `arch-edge-flow ${isSelected ? 1.4 : 2.2}s linear infinite`
            : undefined,
        }}
        markerEnd={vs.isDirected && !isDimmed ? `url(#${markerId})` : undefined}
      />

      {/* Numeric badge */}
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

      {/* Pill label when selected / emphasized */}
      {(isSelected || isEmphasized) && !isDimmed && d.relationTypeLabel && (
        <EdgeLabelRenderer>
          <div
            className="arch-edge-pill"
            style={{
              position: 'absolute',
              transform: `translate(-50%, calc(-50% + 24px)) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              background: 'rgba(8,14,30,0.92)',
              color: vs.color,
              border: `1px solid ${vs.color}`,
            }}
          >
            {d.relationTypeLabel}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const ArchitectureEdge = memo(ArchitectureEdgeImpl);
