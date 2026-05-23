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

function EntityNodeComponent({ id, data }: NodeProps) {
  const d = data as EntityNodeData;
  const selectedId = useArchitectureStore((s) => s.selectedId);
  const isSelected = id === selectedId;
  const accent = ENTITY_ACCENT[d.entityType] ?? '#94a3b8';

  return (
    <div className={`entity-node${isSelected ? ' selected' : ''}`}>
      <div className="entity-node__accent" style={{ background: accent }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <div className="entity-node__type" style={{ color: accent }}>
        {String(d.entityType)}
      </div>
      <div className="entity-node__name">{String(d.label)}</div>
      <div className="entity-node__id">{String(d.entityId)}</div>

      {d.status && (
        <span
          className="entity-node__status"
          style={{
            background: statusBg(String(d.status)),
            color: statusColor(String(d.status)),
          }}
        >
          {String(d.status)}
        </span>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function statusBg(s: string) {
  if (s === 'verified' || s === 'passed') return 'rgba(74,222,128,.15)';
  if (s === 'in_progress') return 'rgba(56,189,248,.15)';
  if (s === 'failed') return 'rgba(248,113,113,.15)';
  if (s === 'open') return 'rgba(251,146,60,.15)';
  return 'rgba(148,163,184,.1)';
}
function statusColor(s: string) {
  if (s === 'verified' || s === 'passed') return '#4ade80';
  if (s === 'in_progress') return '#38bdf8';
  if (s === 'failed') return '#f87171';
  if (s === 'open') return '#fb923c';
  return '#94a3b8';
}

export const CustomNode = memo(EntityNodeComponent);
