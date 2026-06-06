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
 * One handle per side, each declared both as source AND target so any edge
 * can leave or enter the card on whichever side gets it closest to its
 * partner. The picker in ArchitectureFlow decides which side.
 */
const HANDLE_POSITIONS: { id: 'top' | 'right' | 'bottom' | 'left'; pos: Position }[] = [
  { id: 'top',    pos: Position.Top },
  { id: 'right',  pos: Position.Right },
  { id: 'bottom', pos: Position.Bottom },
  { id: 'left',   pos: Position.Left },
];

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
      {HANDLE_POSITIONS.map((h) => (
        <Handle key={`s-${h.id}`} id={h.id} type="source" position={h.pos} className="arch-node__handle" />
      ))}
      {HANDLE_POSITIONS.map((h) => (
        <Handle key={`t-${h.id}`} id={h.id} type="target" position={h.pos} className="arch-node__handle" />
      ))}

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
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeImpl);
