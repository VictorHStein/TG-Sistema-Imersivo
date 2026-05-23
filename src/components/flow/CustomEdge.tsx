import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { RELATION_COLORS } from '../../types/architecture';
import type { RelationType } from '../../types/architecture';

function RelationEdgeComponent({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}: EdgeProps) {
  const relType = (data as Record<string, unknown>)?.relationType as RelationType | undefined;
  const color = relType ? (RELATION_COLORS[relType] ?? '#475569') : '#475569';

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 8,
  });

  const strokeWidth = selected ? 2.5 : 1.5;
  const dashStyle = getDashStyle(relType);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth,
          strokeDasharray: dashStyle,
          opacity: selected ? 1 : 0.7,
        }}
      />

      {selected && relType && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="edge-label"
          >
            {relType.replace(/_/g, ' ')}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function getDashStyle(relType?: RelationType): string {
  switch (relType) {
    case 'satisfies':
    case 'verifies':
    case 'validates':
      return '6 3';
    case 'depends_on':
    case 'constrains':
      return '4 4';
    default:
      return 'none';
  }
}

export const CustomEdge = memo(RelationEdgeComponent);
