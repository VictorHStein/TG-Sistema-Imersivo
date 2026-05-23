import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ENTITY_ACCENT } from '../../types/architecture';
import type { EntityType } from '../../types/architecture';
import { useArchitectureStore } from '../../store/useArchitectureStore';

interface EntityNodeData extends Record<string, unknown> {
  label: string;
  entityId: string;
  entityType: EntityType;
  status?: string;
  accent: string;
}

const TYPE_LABEL: Partial<Record<EntityType, string>> = {
  mission: 'MIS', objective: 'OBJ', requirement: 'REQ',
  function: 'FUN', system: 'SYS', segment: 'SEG',
  subsystem: 'SUB', component: 'CMP', interface: 'INT',
  budget: 'BDG', risk: 'RSK', verification: 'VER',
  test: 'TST', operation: 'OPS', model: 'MDL',
};

function EntityNodeComponent({ id, data }: NodeProps) {
  const d = data as EntityNodeData;
  const selectedId = useArchitectureStore((s) => s.selectedId);
  const isSelected = id === selectedId;
  const accent = ENTITY_ACCENT[d.entityType] ?? '#94a3b8';
  const typeTag = TYPE_LABEL[d.entityType] ?? d.entityType.slice(0, 3).toUpperCase();

  return (
    <div className={`entity-node${isSelected ? ' selected' : ''}`}
      style={{ '--node-accent': accent } as React.CSSProperties}
    >
      {/* Top accent bar */}
      <div className="entity-node__topbar" style={{ background: accent }} />

      <Handle type="target" position={Position.Top} style={{ opacity: 0, top: 0 }} />

      <div className="entity-node__inner">
        <div className="entity-node__header">
          <span className="entity-node__tag" style={{ color: accent }}>
            {typeTag}
          </span>
          <span className="entity-node__id">{String(d.entityId)}</span>
          {d.status && (
            <span className={`entity-node__status-dot status-${d.status}`} title={String(d.status)} />
          )}
        </div>
        <div className="entity-node__name">{String(d.label)}</div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, bottom: 0 }} />
    </div>
  );
}

export const CustomNode = memo(EntityNodeComponent);
