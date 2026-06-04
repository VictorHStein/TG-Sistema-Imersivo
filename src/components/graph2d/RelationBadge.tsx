interface RelationBadgeProps {
  index: number;
  color: string;
  emphasized?: boolean;
  selected?: boolean;
}

/**
 * Circular numeric badge rendered above a relation edge (2D) or floating
 * near a 3D tube. Number comes from RelationTypeDef.index. The colour
 * matches the relation type — same value the legend uses.
 */
export function RelationBadge({ index, color, emphasized, selected }: RelationBadgeProps) {
  const size = selected ? 24 : emphasized ? 20 : 17;
  const fontSize = selected ? 13 : emphasized ? 11 : 10;
  return (
    <div
      className="relation-badge"
      style={{
        width: size,
        height: size,
        fontSize,
        background: color,
        boxShadow: selected
          ? `0 0 0 3px ${color}55, 0 2px 8px rgba(0,0,0,0.6)`
          : '0 2px 6px rgba(0,0,0,0.5)',
      }}
    >
      {index}
    </div>
  );
}
