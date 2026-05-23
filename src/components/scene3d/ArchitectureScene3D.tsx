import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import type * as THREE from 'three';
import type { ArchitectureModel } from '../../types/architecture';
import { ENTITY_ACCENT } from '../../types/architecture';
import { useArchitectureStore } from '../../store/useArchitectureStore';

// ── Spacecraft layout: subsystem positions in 3D ───────────────
const SPACECRAFT_POS: Record<string, [number, number, number]> = {
  // Space segment (satellite)
  'SYS-001':    [0,    0,    0],      // system center
  'SEG-SPACE':  [0,    0,    0],
  'SUB-PL':     [0,    3.5,  0.5],   // payload (top)
  'SUB-EPS':    [0,    0,    0],      // EPS at center
  'SUB-OBC':    [0,    0.6,  -0.3],  // OBC (front of bus)
  'SUB-TTC':    [0,   -2.2,  0],     // TTC (below)
  'SUB-AOCS':   [-1,   0.4,  0],     // AOCS (left side)
  'SUB-THER':   [0,    0,    -1.5],  // thermal (back)
  'SUB-STR':    [0,    0,    0],     // structure (bus)

  // Ground segment
  'SEG-GROUND': [-6,  -5,   4],
  'SUB-GND':    [-6,  -4,   4],
  'SUB-OPS':    [-4,  -4,   4],

  // Launch segment
  'SEG-LAUNCH': [5,   -5,   0],
};

// Interfaces to draw as lines
const INTERFACE_LINES: Array<{ from: string; to: string; color: string; label: string }> = [
  { from: 'SUB-PL',   to: 'SUB-OBC',  color: '#38bdf8', label: 'Image Data' },
  { from: 'SUB-EPS',  to: 'SUB-PL',   color: '#facc15', label: 'Power' },
  { from: 'SUB-EPS',  to: 'SUB-OBC',  color: '#facc15', label: 'Power' },
  { from: 'SUB-EPS',  to: 'SUB-TTC',  color: '#facc15', label: 'Power' },
  { from: 'SUB-EPS',  to: 'SUB-AOCS', color: '#facc15', label: 'Power' },
  { from: 'SUB-OBC',  to: 'SUB-TTC',  color: '#818cf8', label: 'TM/TC' },
  { from: 'SUB-OBC',  to: 'SUB-AOCS', color: '#86efac', label: 'ADCS Ctrl' },
  { from: 'SUB-TTC',  to: 'SUB-GND',  color: '#67e8f9', label: 'S-Band RF' },
  { from: 'SUB-GND',  to: 'SUB-OPS',  color: '#c4b5fd', label: 'Ops Link' },
];

interface SubsystemBubbleProps {
  id: string;
  position: [number, number, number];
  label: string;
  type: string;
  isSelected: boolean;
  onClick: () => void;
}

function SubsystemBubble({ id, position, label, type, isSelected, onClick }: SubsystemBubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const accent = ENTITY_ACCENT[type as keyof typeof ENTITY_ACCENT] ?? '#94a3b8';

  useFrame((_, delta) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  const radius = type === 'subsystem' ? 0.55 : type === 'segment' ? 0.35 : type === 'system' ? 0.8 : 0.4;

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 20, 20]} />
        <meshStandardMaterial
          color={accent}
          emissive={isSelected ? accent : '#000'}
          emissiveIntensity={isSelected ? 0.6 : 0.1}
          transparent
          opacity={isSelected ? 1 : 0.75}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.15, 0.04, 8, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={0.8} />
        </mesh>
      )}
      <Text
        position={[0, radius + 0.35, 0]}
        fontSize={0.22}
        color={isSelected ? accent : '#94a3b8'}
        anchorX="center"
        anchorY="bottom"
        maxWidth={2.5}
      >
        {label.length > 22 ? label.slice(0, 20) + '…' : label}
      </Text>
      <Text
        position={[0, radius + 0.08, 0]}
        fontSize={0.13}
        color="#475569"
        anchorX="center"
        anchorY="bottom"
      >
        {id}
      </Text>
    </group>
  );
}

interface InterfaceLineProps {
  points: [number, number, number][];
  color: string;
  label: string;
  isActive: boolean;
}

function InterfaceLine({ points, color, isActive }: InterfaceLineProps) {
  if (points.length < 2) return null;
  return (
    <Line
      points={points}
      color={color}
      lineWidth={isActive ? 2.5 : 1}
      transparent
      opacity={isActive ? 0.9 : 0.25}
      dashed={!isActive}
      dashSize={0.3}
      gapSize={0.2}
    />
  );
}

// Solar panels as flat boxes
function SolarPanels() {
  return (
    <>
      {/* Left panel */}
      <mesh position={[-3.2, 0, 0]}>
        <boxGeometry args={[2.8, 0.05, 1.2]} />
        <meshStandardMaterial color="#1a3a6a" emissive="#0a1e3d" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right panel */}
      <mesh position={[3.2, 0, 0]}>
        <boxGeometry args={[2.8, 0.05, 1.2]} />
        <meshStandardMaterial color="#1a3a6a" emissive="#0a1e3d" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Panel mounts */}
      <mesh position={[-1.8, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.8, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </>
  );
}

// Satellite bus body
function SatelliteBus() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.4, 1.6, 1.4]} />
      <meshStandardMaterial
        color="#0f2040"
        emissive="#060e20"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

// Ground station dish
function GroundStationDish({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Dish */}
      <mesh rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.9, 0.3, 16, 1, true]} />
        <meshStandardMaterial color="#475569" side={2} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

interface SceneContentProps {
  model: ArchitectureModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

function SceneContent({ model, selectedId, onSelect }: SceneContentProps) {
  // Show only system, segments and subsystems in 3D
  const spacecraftEntities = useMemo(
    () => model.entities.filter(
      (e) => (e.type === 'system' || e.type === 'segment' || e.type === 'subsystem') &&
              SPACECRAFT_POS[e.id],
    ),
    [model.entities],
  );

  const activeLines = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const active = new Set<string>();
    for (const line of INTERFACE_LINES) {
      if (line.from === selectedId || line.to === selectedId) {
        active.add(`${line.from}→${line.to}`);
      }
    }
    return active;
  }, [selectedId]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 8]}  intensity={1.2} color="#cce0ff" castShadow />
      <pointLight       position={[-8, 6, -4]} intensity={0.5} color="#5580ff" />
      <pointLight       position={[8, -4, 4]}  intensity={0.3} color="#aa88ff" />

      {/* Space environment */}
      <Stars radius={120} depth={80} count={5000} factor={3} saturation={0} fade />

      {/* Spacecraft hardware */}
      <SatelliteBus />
      <SolarPanels />
      <GroundStationDish position={[-6, -4.5, 4]} />

      {/* Subsystem bubbles */}
      {spacecraftEntities.map((entity) => {
        const pos = SPACECRAFT_POS[entity.id];
        if (!pos) return null;
        return (
          <SubsystemBubble
            key={entity.id}
            id={entity.id}
            position={pos}
            label={entity.name}
            type={entity.type}
            isSelected={entity.id === selectedId}
            onClick={() => onSelect(entity.id)}
          />
        );
      })}

      {/* Interface lines */}
      {INTERFACE_LINES.map((line) => {
        const fromPos = SPACECRAFT_POS[line.from];
        const toPos   = SPACECRAFT_POS[line.to];
        if (!fromPos || !toPos) return null;
        const key = `${line.from}→${line.to}`;
        return (
          <InterfaceLine
            key={key}
            points={[fromPos, toPos]}
            color={line.color}
            label={line.label}
            isActive={activeLines.has(key)}
          />
        );
      })}

      {/* Earth glow (very far below) */}
      <mesh position={[0, -60, -20]}>
        <sphereGeometry args={[28, 32, 32]} />
        <meshStandardMaterial
          color="#0a3060"
          emissive="#051833"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </>
  );
}

interface ArchitectureScene3DProps {
  model: ArchitectureModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureScene3D({ model, selectedId, onSelect }: ArchitectureScene3DProps) {
  return (
    <Canvas camera={{ position: [6, 4, 12], fov: 48 }} shadows>
      <color attach="background" args={['#040610']} />
      <SceneContent model={model} selectedId={selectedId} onSelect={onSelect} />
      <OrbitControls
        target={[0, 0.5, 0]}
        minDistance={4}
        maxDistance={60}
        enablePan
        enableZoom
        enableRotate
      />
    </Canvas>
  );
}
