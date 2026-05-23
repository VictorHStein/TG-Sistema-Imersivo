import { Html } from '@react-three/drei';

interface SpaceSystemObjectProps {
  position: [number, number, number];
  id: string;
  name: string;
  color: string;
  active?: boolean;
  onClick: () => void;
}

const truncate = (s: string, max: number) =>
  s.length > max ? s.slice(0, max - 1) + '…' : s;

export function SpaceSystemObject({
  position,
  id,
  name,
  color,
  active,
  onClick
}: SpaceSystemObjectProps) {
  const radius = active ? 0.52 : 0.42;

  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[radius, 28, 28]} />
      <meshStandardMaterial
        color={active ? '#c8daff' : color}
        emissive={active ? color : '#000000'}
        emissiveIntensity={active ? 0.35 : 0}
        metalness={0.3}
        roughness={0.3}
      />
      <Html distanceFactor={12} position={[0, radius + 0.6, 0]} center>
        <div
          style={{
            padding: '5px 9px',
            background: active ? 'rgba(20, 35, 75, 0.96)' : 'rgba(8, 14, 32, 0.88)',
            color: active ? '#e8f0ff' : '#c0ccee',
            borderRadius: '10px',
            border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: active ? `0 0 12px ${color}55` : 'none',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.2 }}>
            {truncate(name, 22)}
          </div>
          <div style={{ fontSize: '0.65rem', color: active ? '#8090c0' : '#5060a0', marginTop: 2 }}>
            {id}
          </div>
        </div>
      </Html>
    </mesh>
  );
}
