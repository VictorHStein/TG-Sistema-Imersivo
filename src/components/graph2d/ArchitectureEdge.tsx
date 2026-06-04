import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
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
}

function ArchitectureEdgeImpl(props: EdgeProps) {
  const {
    id, sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition, data,
  } = props;
  const d = data as ArchitectureEdgeData;
  const { style: vs, isSelected, isDimmed, isEmphasized, relationIndex } = d;

  const [path, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    curvature: 0.3,
  });

  const markerId = `arch-arrow-${d.relationId}`;

  return (
    <>
      <defs>
        {vs.isDirected && (
          <marker
            id={markerId}
            markerWidth="10"
            markerHeight="10"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L7,3 z" fill={vs.color} opacity={vs.opacity} />
          </marker>
        )}
      </defs>

      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: isDimmed ? '#2a3a55' : vs.color,
          strokeWidth: vs.strokeWidth,
          strokeDasharray: vs.dashArray === 'none' ? undefined : vs.dashArray,
          opacity: vs.opacity,
          filter: isSelected ? `drop-shadow(0 0 6px ${vs.color})` : undefined,
        }}
        markerEnd={vs.isDirected && !isDimmed ? `url(#${markerId})` : undefined}
      />

      {/* Numeric badge in the middle of the edge */}
      {!isDimmed && (
        <EdgeLabelRenderer>
          <div
            className="arch-edge-badge-wrap"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              cursor: 'pointer',
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

      {/* Selection or emphasis pill with the relation label */}
      {(isSelected || isEmphasized) && !isDimmed && d.relationTypeLabel && (
        <EdgeLabelRenderer>
          <div
            className="arch-edge-pill"
            style={{
              position: 'absolute',
              transform: `translate(-50%, calc(-50% + 22px)) translate(${labelX}px,${labelY}px)`,
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
