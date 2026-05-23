import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ENTITY_ACCENT } from '../../types/architecture';
import type { EntityType } from '../../types/architecture';

interface EntityNodeData extends Record<string, unknown> {
  label: string;
  entityId: string;
  entityType: EntityType;
  status?: string;
  accent: string;
  selected: boolean;
}

function EntityNodeComponent({ data, selected }: NodeProps) {
  const d = data as EntityNodeData;
  const accent = ENTITY_ACCENT[d.entityType] ?? '#94a3b8';

  return (
    <div className={`entity-node${selected || d.selected ? ' selected' : ''}`}>
      <div className="entity-node__accent" style={{ background: accent }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      <div className="entity-node__type" style={{ color: accent }}>
        {d.entityType}
      </div>
      <div className="entity-node__name">{String(d.label)}</div>
      <div className="entity-node__id">{String(d.entityId)}</div>

      {d.status && (
        <span
          className={`entity-node__status ${d.status}`}
          style={{
            background: statusBg(String(d.status)),
            color: statusColor(String(d.status)),
          }}
        >
          {String(d.status)}
        </span>
      )}

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function statusBg(status: string) {
  switch (status) {
    case 'verified': case 'passed': return 'rgba(74,222,128,.15)';
    case 'in_progress': return 'rgba(56,189,248,.15)';
    case 'failed': return 'rgba(248,113,113,.15)';
    case 'open': return 'rgba(251,146,60,.15)';
    default: return 'rgba(148,163,184,.1)';
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'verified': case 'passed': return '#4ade80';
    case 'in_progress': return '#38bdf8';
    case 'failed': return '#f87171';
    case 'open': return '#fb923c';
    default: return '#94a3b8';
  }
}

export const CustomNode = memo(EntityNodeComponent);
