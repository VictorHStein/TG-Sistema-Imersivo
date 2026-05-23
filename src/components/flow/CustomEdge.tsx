import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { RELATION_COLORS } from '../../types/architecture';
import type { RelationType } from '../../types/architecture';

function RelationEdgeComponent({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, style,
}: EdgeProps) {
  const d = data as Record<string, unknown> | undefined;
  const relType = d?.relationType as RelationType | undefined;
  const faint = Boolean(d?.faint);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const color = relType ? (RELATION_COLORS[relType] ?? '#475569') : '#475569';
  const strokeWidth = style?.strokeWidth ?? (faint ? 1 : selected ? 2.5 : 1.5);
  const opacity = faint ? 0.25 : selected ? 1 : (style?.opacity ?? 0.8);
  const dashArray = faint ? 'none' : getDash(relType);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: faint ? '#253f60' : color,
          strokeWidth: Number(strokeWidth),
          strokeDasharray: String(dashArray),
          opacity: Number(opacity),
        }}
        markerEnd={faint ? undefined : `url(#arrowhead-${relType ?? 'default'})`}
      />

      {selected && !faint && relType && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              background: 'var(--bg-surface)',
              border: `1px solid ${color}`,
              color,
            }}
          >
            {relType.replace(/_/g, ' ')}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Arrowhead marker definition */}
      {!faint && relType && (
        <defs>
          <marker
            id={`arrowhead-${relType}`}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={color} opacity={0.8} />
          </marker>
        </defs>
      )}
    </>
  );
}

function getDash(relType?: RelationType): string {
  switch (relType) {
    case 'satisfies':
    case 'verifies':
    case 'validates':
      return '7 4';
    case 'depends_on':
    case 'constrains':
      return '4 4';
    case 'mitigates':
      return '3 6';
    default:
      return 'none';
  }
}

export const CustomEdge = memo(RelationEdgeComponent);
