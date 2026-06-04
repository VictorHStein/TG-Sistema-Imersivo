import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CategoryDef } from '../../domain/model/ArchitectureTypes';

export interface ArchitectureNodeData extends Record<string, unknown> {
  entityId: string;
  name: string;
  category: CategoryDef;
  status?: string;
  isSelected: boolean;
  isDimmed: boolean;
  isHighlighted: boolean;
  step: number;
  parentId?: string;
  /** WBS/PBS-style hierarchical code, e.g. "1.2.1". */
  breakdownCode: string;
}

/**
 * Custom React Flow node. Renders an entity with its category color/shape.
 * Long descriptions stay in the side panel; only id + name appear here.
 */
function ArchitectureNodeImpl({ data }: NodeProps) {
  const d = data as ArchitectureNodeData;
  const color = d.category.color;
  const shape = d.category.shape2D ?? 'box';
  const dimmed = d.isDimmed;
  const selected = d.isSelected;
  const highlighted = d.isHighlighted;

  return (
    <div
      className={`arch-node arch-node-${shape}${selected ? ' is-selected' : ''}${dimmed ? ' is-dimmed' : ''}${highlighted ? ' is-highlighted' : ''}`}
      style={{
        ['--node-color' as never]: color,
      }}
    >
      <Handle type="target" position={Position.Top} className="arch-node__handle" />
      <div className="arch-node__bar" style={{ background: color }} />
      <div className="arch-node__body">
        <div className="arch-node__category" style={{ color }}>
          <span className="arch-node__cat-dot" style={{ background: color }} />
          {d.category.label}
          <span className="arch-node__breakdown" style={{ background: `${color}22`, color, borderColor: `${color}55` }}>
            {d.breakdownCode}
          </span>
        </div>
        <div className="arch-node__name" title={d.name}>{d.name}</div>
        <div className="arch-node__meta">
          <span className="arch-node__id">{d.entityId}</span>
          {d.status && <span className={`arch-node__status status-${d.status}`}>{d.status.replace('_', ' ')}</span>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="arch-node__handle" />
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeImpl);
