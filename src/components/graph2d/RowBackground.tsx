import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

interface RowBackgroundData extends Record<string, unknown> {
  label: string;
  color: string;
  width: number;
  height: number;
}

/**
 * Translucent swimlane background drawn behind a row of entities, with the
 * category label on the left edge.
 */
function RowBackgroundImpl({ data }: NodeProps) {
  const d = data as RowBackgroundData;
  return (
    <div
      className="arch-row-bg"
      style={{
        width: d.width,
        height: d.height,
        background: `linear-gradient(90deg, ${d.color}1a 0%, ${d.color}06 35%, transparent 100%)`,
        borderTop: `1px solid ${d.color}22`,
        borderBottom: `1px solid ${d.color}22`,
      }}
    >
      <div className="arch-row-bg__label" style={{ color: d.color, borderColor: `${d.color}55` }}>
        {d.label}
      </div>
    </div>
  );
}

export const RowBackground = memo(RowBackgroundImpl);
