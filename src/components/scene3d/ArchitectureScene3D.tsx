import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line, useTexture } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import type * as THREE from 'three';
import type { ArchitectureModel } from '../../types/architecture';
import { ENTITY_ACCENT } from '../../types/architecture';
import { useArchitectureStore } from '../../store/useArchitectureStore';

// ── Spacecraft 3D positions for subsystems ──────────────────────
const SPACECRAFT_POS: Record<string, [number, number, number]> = {
  'SYS-001':    [0,    0,    0],
  'SEG-SPACE':  [0,    0,    0],
  'SUB-PL':     [0,    3.6,  0.6],   // payload top
  'SUB-EPS':    [0,    0,    0],      // EPS at core
  'SUB-OBC':    [0,    0.7, -0.4],   // OBC front
  'SUB-TTC':    [0,   -2.4,  0],     // TTC bottom
  'SUB-AOCS':   [-1.2, 0.5,  0],     // AOCS left
  'SUB-THER':   [0,    0,   -1.6],   // thermal back
  'SUB-STR':    [0,    0,    0],     // structure core
  'SEG-GROUND': [-6,  -5,    5],
  'SUB-GND':    [-7,  -4.2,  5],
  'SUB-OPS':    [-5,  -4.2,  5],
  'SEG-LAUNCH': [5,   -5,    0],
};

const INTERFACE_LINES = [
  { from: 'SUB-PL',   to: 'SUB-OBC',  color: '#38bdf8', label: 'Image Data',    animated: true },
  { from: 'SUB-EPS',  to: 'SUB-PL',   color: '#facc15', label: 'Power',         animated: false },
  { from: 'SUB-EPS',  to: 'SUB-OBC',  color: '#facc15', label: 'Power',         animated: false },
  { from: 'SUB-EPS',  to: 'SUB-TTC',  color: '#facc15', label: 'Power',         animated: false },
  { from: 'SUB-EPS',  to: 'SUB-AOCS', color: '#facc15', label: 'Power',         animated: false },
  { from: 'SUB-OBC',  to: 'SUB-TTC',  color: '#818cf8', label: 'TM/TC',         animated: true },
  { from: 'SUB-OBC',  to: 'SUB-AOCS', color: '#86efac', label: 'ADCS Control',  animated: true },
  { from: 'SUB-THER', to: 'SUB-PL',   color: '#fb923c', label: 'Thermal',       animated: false },
  { from: 'SUB-TTC',  to: 'SUB-GND',  color: '#67e8f9', label: 'S-Band RF',     animated: true },
  { from: 'SUB-GND',  to: 'SUB-OPS',  color: '#c4b5fd', label: 'Ops Link',      animated: false },
];

// ── Solar panels with texture ────────────────────────────────────
function SolarPanels() {
  const texture = useTexture('/images/textures/01_texture_solar_panel_cells.png');
  return (
    <group>
      <mesh position={[-3.4, 0, 0]}>
        <boxGeometry args={[3.0, 0.06, 1.3]} />
        <meshStandardMaterial map={texture} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[3.4, 0, 0]}>
        <boxGeometry args={[3.0, 0.06, 1.3]} />
        <meshStandardMaterial map={texture} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Booms */}
      {([-1.9, 1.9] as number[]).map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ── Satellite bus ────────────────────────────────────────────────
function SatelliteBus() {
  const metalTex = useTexture('/images/textures/02_texture_dark_metal_panel.png');
  return (
    <group>
      {/* Main bus box */}
      <mesh>
        <boxGeometry args={[1.5, 1.7, 1.5]} />
        <meshStandardMaterial
          map={metalTex}
          metalness={0.75}
          roughness={0.3}
          transparent
          opacity={0.7}
          color="#0d1f35"
        />
      </mesh>
      {/* Structural ribs */}
      {([-0.6, 0, 0.6] as number[]).map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.02, 1.72, 1.52]} />
          <meshStandardMaterial color="#1e3a5f" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ── OBC component with circuit texture ──────────────────────────
function OBCBox({ position }: { position: [number, number, number] }) {
  const circuitTex = useTexture('/images/textures/04_texture_circuit_board_blue.png');
  return (
    <mesh position={position}>
      <boxGeometry args={[0.45, 0.28, 0.38]} />
      <meshStandardMaterial map={circuitTex} metalness={0.5} roughness={0.5} emissive="#001830" emissiveIntensity={0.3} />
    </mesh>
  );
}

// ── Thermal radiator ────────────────────────────────────────────
function Radiator({ position }: { position: [number, number, number] }) {
  const radTex = useTexture('/images/textures/05_texture_radiator_louver.png');
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[1.2, 0.6]} />
      <meshStandardMaterial map={radTex} side={2} metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

// ── Ground station dish ──────────────────────────────────────────
function GroundStation({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0.5, 0, 0]}>
        <coneGeometry args={[1.1, 0.35, 20, 1, true]} />
        <meshStandardMaterial color="#334155" side={2} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

// ── Subsystem bubble ─────────────────────────────────────────────
function SubsystemBubble({ id, position, label, type, isSelected, isNeighbor, onClick }: {
  id: string;
  position: [number, number, number];
  label: string;
  type: string;
  isSelected: boolean;
  isNeighbor: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const accent  = ENTITY_ACCENT[type as keyof typeof ENTITY_ACCENT] ?? '#94a3b8';
  const radius  = type === 'system' ? 0.9 : type === 'segment' ? 0.4 : 0.55;
  const opacity = isSelected ? 1 : isNeighbor ? 0.85 : 0.55;

  useFrame((_, dt) => {
    if (meshRef.current && isSelected) meshRef.current.rotation.y += dt * 0.7;
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={isSelected ? accent : isNeighbor ? accent : '#000'}
          emissiveIntensity={isSelected ? 0.55 : isNeighbor ? 0.15 : 0.05}
          transparent
          opacity={opacity}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.18, 0.045, 10, 36]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
      )}

      {/* Label — always show for main subsystems */}
      <Text
        position={[0, radius + 0.4, 0]}
        fontSize={0.21}
        color={isSelected ? accent : isNeighbor ? '#e2e8f0' : '#64748b'}
        anchorX="center"
        anchorY="bottom"
        maxWidth={2.8}
        renderOrder={10}
      >
        {label.length > 24 ? label.slice(0, 22) + '…' : label}
      </Text>
      <Text
        position={[0, radius + 0.1, 0]}
        fontSize={0.13}
        color={isSelected ? accent : '#475569'}
        anchorX="center"
        anchorY="bottom"
        renderOrder={10}
      >
        {id}
      </Text>
    </group>
  );
}

// ── Scene content (needs Suspense for useTexture) ─────────────────
function SceneContent({ model, selectedId, onSelect }: {
  model: ArchitectureModel;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const spacecraftEntities = useMemo(
    () => model.entities.filter(
      (e) => (e.type === 'system' || e.type === 'segment' || e.type === 'subsystem') &&
              SPACECRAFT_POS[e.id],
    ),
    [model.entities],
  );

  const neighborIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const ids = new Set<string>();
    for (const line of INTERFACE_LINES) {
      if (line.from === selectedId) ids.add(line.to);
      if (line.to   === selectedId) ids.add(line.from);
    }
    return ids;
  }, [selectedId]);

  const activeLineKeys = useMemo(() => {
    const s = new Set<string>();
    for (const line of INTERFACE_LINES) {
      if (line.from === selectedId || line.to === selectedId) {
        s.add(`${line.from}→${line.to}`);
      }
    }
    return s;
  }, [selectedId]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[8,14,8]}   intensity={1.3} color="#cce0ff" castShadow />
      <pointLight       position={[-8,6,-4]}  intensity={0.5} color="#5580ff" />
      <pointLight       position={[8,-4,4]}   intensity={0.3} color="#aa88ff" />

      <Stars radius={130} depth={80} count={5500} factor={3.5} saturation={0} fade />

      {/* Spacecraft assembly */}
      <SatelliteBus />
      <SolarPanels />
      <OBCBox position={[0, 0.7, -0.4]} />
      <Radiator position={[0, 0, -1.7]} />
      <GroundStation position={[-7, -4.5, 5]} />

      {/* Earth (far backdrop) */}
      <mesh position={[0, -65, -22]}>
        <sphereGeometry args={[30, 36, 36]} />
        <meshStandardMaterial color="#0a3060" emissive="#051833" emissiveIntensity={0.35} transparent opacity={0.9} />
      </mesh>
      {/* Atmosphere rim */}
      <mesh position={[0, -65, -22]}>
        <sphereGeometry args={[31.5, 36, 36]} />
        <meshStandardMaterial color="#1a4090" transparent opacity={0.12} side={1} />
      </mesh>

      {/* Subsystem bubbles */}
      {spacecraftEntities.map((e) => {
        const pos = SPACECRAFT_POS[e.id];
        if (!pos) return null;
        return (
          <SubsystemBubble
            key={e.id}
            id={e.id}
            position={pos}
            label={e.name}
            type={e.type}
            isSelected={e.id === selectedId}
            isNeighbor={neighborIds.has(e.id)}
            onClick={() => onSelect(e.id)}
          />
        );
      })}

      {/* Interface lines */}
      {INTERFACE_LINES.map((line) => {
        const fromPos = SPACECRAFT_POS[line.from];
        const toPos   = SPACECRAFT_POS[line.to];
        if (!fromPos || !toPos) return null;
        const key    = `${line.from}→${line.to}`;
        const active = activeLineKeys.has(key);
        return (
          <Line
            key={key}
            points={[fromPos, toPos]}
            color={line.color}
            lineWidth={active ? 3 : 1}
            transparent
            opacity={active ? 1 : 0.2}
            dashed={!active}
            dashSize={0.3}
            gapSize={0.2}
          />
        );
      })}

      {/* RF link beam from satellite to ground */}
      {selectedId === 'SUB-TTC' || selectedId === 'SUB-GND' ? (
        <Line
          points={[[0, -2.4, 0], [-7, -4.2, 5]]}
          color="#67e8f9"
          lineWidth={2}
          transparent
          opacity={0.6}
          dashed
          dashSize={0.4}
          gapSize={0.3}
        />
      ) : null}
    </>
  );
}

// ── Main 3D component ────────────────────────────────────────────
interface Props {
  model: ArchitectureModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureScene3D({ model, selectedId, onSelect }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Space backdrop overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.3) 100%)',
        pointerEvents: 'none',
      }} />
      <Canvas
        camera={{ position: [7, 5, 14], fov: 46 }}
        shadows
        style={{ position: 'relative', zIndex: 1 }}
      >
        <color attach="background" args={['#020615']} />
        <Suspense fallback={null}>
          <SceneContent model={model} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
        <OrbitControls
          target={[0, 0.5, 0]}
          minDistance={4}
          maxDistance={70}
          enablePan
          enableZoom
          enableRotate
        />
      </Canvas>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        background: 'rgba(2,6,23,0.88)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 8,
        padding: '8px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        backdropFilter: 'blur(8px)',
        lineHeight: 1.9,
      }}>
        <div style={{ color: 'var(--text-accent)', fontWeight: 700, marginBottom: 4 }}>3D · Segmento Espacial</div>
        {[
          { color: '#facc15', label: 'Power' },
          { color: '#38bdf8', label: 'Data' },
          { color: '#818cf8', label: 'Comando' },
          { color: '#fb923c', label: 'Térmico' },
          { color: '#67e8f9', label: 'RF Link' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 2, background: item.color, borderRadius: 1, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
