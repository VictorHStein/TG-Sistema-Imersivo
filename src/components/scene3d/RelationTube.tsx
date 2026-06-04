import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { RelationVisualStyle } from '../../domain/parser/relationStyle';

interface RelationTubeProps {
  relationId: string;
  relationIndex: number;
  from: [number, number, number];
  to: [number, number, number];
  style: RelationVisualStyle;
  selected: boolean;
  emphasizedByFilter: boolean;
  showBadge: boolean;
  onSelect: (id: string) => void;
}

/**
 * Curved tube connecting two entity centers in 3D. Color and thickness come
 * from the unified relation style (so 2D and 3D look the same).
 *
 * A numeric badge is rendered with <Html> in the middle of the curve when
 * the relation is selected, emphasized, or cross-category.
 */
export function RelationTube({
  relationId,
  relationIndex,
  from,
  to,
  style,
  selected,
  emphasizedByFilter,
  showBadge,
  onSelect,
}: RelationTubeProps) {
  const tubeGeom = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const bend = (start.distanceTo(end) || 1) * 0.18;
    mid.y += bend; // arc upwards a bit for readability
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return new THREE.TubeGeometry(curve, 24, style.strokeWidth * 0.04, 8, false);
  }, [from, to, style.strokeWidth]);

  const midPoint: [number, number, number] = useMemo(() => {
    // The curve's actual midpoint at t=0.5: midOfStartEnd + bend/2 in Y.
    const dx = from[0] - to[0];
    const dz = from[2] - to[2];
    const bend = Math.sqrt(dx * dx + dz * dz) * 0.18;
    return [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + bend * 0.5,
      (from[2] + to[2]) / 2,
    ];
  }, [from, to]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect(relationId); }}>
      <mesh geometry={tubeGeom}>
        <meshStandardMaterial
          color={style.color}
          emissive={style.color}
          emissiveIntensity={selected ? 0.9 : emphasizedByFilter ? 0.45 : 0.2}
          transparent
          opacity={style.opacity}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {showBadge && (
        <Html
          center
          position={midPoint}
          distanceFactor={9}
          zIndexRange={[15, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="relation-tube-badge"
            style={{
              background: style.color,
              width: selected ? 26 : 20,
              height: selected ? 26 : 20,
              fontSize: selected ? 13 : 11,
              boxShadow: `0 0 0 2px ${style.color}66, 0 0 8px ${style.color}88`,
            }}
            title={`#${relationIndex}`}
          >
            {relationIndex}
          </div>
        </Html>
      )}
    </group>
  );
}
