import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

interface SwimlaneData extends Record<string, unknown> {
  label: string;
  color: string;
  accent: string;
  layerIndex: number;
}

function SwimlaneNodeComponent({ data }: NodeProps) {
  const d = data as SwimlaneData;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: String(d.color),
        borderRadius: 10,
        borderLeft: `3px solid ${String(d.accent)}22`,
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Label */}
      <div style={{
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        color: String(d.accent),
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        opacity: 0.55,
        whiteSpace: 'nowrap',
      }}>
        {String(d.label)}
      </div>
      {/* Right fade */}
      <div style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: 60,
        background: 'linear-gradient(to right, transparent, rgba(4,6,16,0.4))',
        borderRadius: '0 10px 10px 0',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export const SwimlaneNode = memo(SwimlaneNodeComponent);
