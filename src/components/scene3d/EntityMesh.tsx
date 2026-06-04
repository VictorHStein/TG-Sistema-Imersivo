import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type {
  ArchitectureEntity,
  CategoryDef,
} from '../../domain/model/ArchitectureTypes';
import { TextBillboard } from './TextBillboard';

interface EntityMeshProps {
  entity: ArchitectureEntity;
  category: CategoryDef;
  position: [number, number, number];
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  showLabel: boolean;
  onSelect: (id: string) => void;
}

const SIZE_BY_CATEGORY: Record<string, number> = {
  mission: 1.1,
  requirement: 0.6,
  function: 0.65,
  subsystem: 0.95,
  component: 0.45,
  verification: 0.55,
};

/**
 * Renders a single entity in 3D using a primitive whose shape depends on
 * `category.shape3D`. Hover/select/dim are derived from store flags.
 */
export function EntityMesh({
  entity,
  category,
  position,
  isSelected,
  isHighlighted,
  isDimmed,
  showLabel,
  onSelect,
}: EntityMeshProps) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const shape = category.shape3D ?? 'box';
  const baseSize = SIZE_BY_CATEGORY[entity.category] ?? 0.7;

  const opacity = isDimmed ? 0.25 : isSelected ? 1 : isHighlighted ? 0.95 : 0.82;
  const emissiveIntensity = isSelected ? 0.7 : isHighlighted ? 0.35 : hovered ? 0.4 : 0.15;

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (isSelected) ref.current.rotation.y += dt * 0.4;
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onSelect(entity.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        {renderGeometry(shape, baseSize)}
        <meshStandardMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
          metalness={0.55}
          roughness={0.35}
        />
      </mesh>

      {/* Selection halo */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[baseSize + 0.4, 0.05, 12, 48]} />
          <meshBasicMaterial color={category.color} transparent opacity={0.85} />
        </mesh>
      )}

      {showLabel && (
        <>
          <TextBillboard
            position={[0, baseSize + 0.55, 0]}
            text={truncate(entity.name, 28)}
            color={isSelected ? category.color : isHighlighted ? '#e2e8f0' : '#a3b5cf'}
            size={isSelected ? 0.32 : 0.26}
          />
          <TextBillboard
            position={[0, baseSize + 0.25, 0]}
            text={entity.id}
            color={isSelected ? category.color : '#5e7595'}
            size={0.18}
          />
        </>
      )}
    </group>
  );
}

function renderGeometry(shape: string, size: number) {
  switch (shape) {
    case 'sphere':    return <sphereGeometry args={[size, 28, 28]} />;
    case 'flatPanel': return <boxGeometry args={[size * 2.2, size * 0.18, size * 1.4]} />;
    case 'capsule':   return <capsuleGeometry args={[size * 0.55, size * 1.1, 8, 16]} />;
    case 'box':       return <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />;
    case 'smallBox':  return <boxGeometry args={[size * 1.1, size * 1.1, size * 1.1]} />;
    case 'diamond':   return <octahedronGeometry args={[size * 1.1, 0]} />;
    case 'bar':       return <boxGeometry args={[size * 2.4, size * 0.3, size * 0.3]} />;
    default:          return <boxGeometry args={[size, size, size]} />;
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
