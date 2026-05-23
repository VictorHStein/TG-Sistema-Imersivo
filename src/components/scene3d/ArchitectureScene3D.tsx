import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo } from 'react';
import type { ArchitectureModel } from '../../types/architecture';
import { ENTITY_ACCENT } from '../../types/architecture';
import { SpaceSystemObject } from './SpaceSystemObject';
import { InterfaceLine3D } from './InterfaceLine3D';

// 3D positions for all entities in the new demo model
const layoutPositions: Record<string, [number, number, number]> = {
  // Mission (y=14)
  'MSN-001': [0, 14, 0],

  // Objectives (y=10)
  'OBJ-IMG': [-7, 10, 0],
  'OBJ-OPS': [0,  10, 0],
  'OBJ-SCI': [7,  10, 0],

  // Requirements (y=6) — 12 total, step=2.5
  'REQ-GSD-PAN': [-13.75, 6, 0],
  'REQ-GSD-MS':  [-11.25, 6, 0],
  'REQ-RAD':     [-8.75,  6, 0],
  'REQ-TEMP':    [-6.25,  6, 0],
  'REQ-RELI':    [-3.75,  6, 0],
  'REQ-PWR':     [-1.25,  6, 0],
  'REQ-THER':    [1.25,   6, 0],
  'REQ-DAT':     [3.75,   6, 0],
  'REQ-CALIB':   [6.25,   6, 0],
  'REQ-TTC':     [8.75,   6, 0],
  'REQ-STR':     [11.25,  6, 0],
  'REQ-SAFE':    [13.75,  6, 0],

  // Functions (y=2.5) — 16 total, step=2
  'FUNC-CAP-PAN':    [-15, 2.5, 0],
  'FUNC-CAP-MS':     [-13, 2.5, 0],
  'FUNC-STORE-DATA': [-11, 2.5, 0],
  'FUNC-COMPRESS':   [-9,  2.5, 0],
  'FUNC-DOWNLINK':   [-7,  2.5, 0],
  'FUNC-RCV-CMD':    [-5,  2.5, 0],
  'FUNC-GEN-PWR':    [-3,  2.5, 0],
  'FUNC-STORE-NRG':  [-1,  2.5, 0],
  'FUNC-DIST-PWR':   [1,   2.5, 0],
  'FUNC-EST-ATT':    [3,   2.5, 0],
  'FUNC-CTRL-ATT':   [5,   2.5, 0],
  'FUNC-THERM':      [7,   2.5, 0],
  'FUNC-FDIR':       [9,   2.5, 0],
  'FUNC-GEO':        [11,  2.5, 0],
  'FUNC-PLAN-PASS':  [13,  2.5, 0],
  'FUNC-SAFE':       [15,  2.5, 0],

  // Operations (y=1)
  'OPS-IMAGING':  [-4.5, 1, 0],
  'OPS-DOWNLINK': [-1.5, 1, 0],
  'OPS-CONTACT':  [1.5,  1, 0],
  'OPS-SAFE':     [4.5,  1, 0],

  // System (y=-1)
  'SYS-001': [0, -1, 0],

  // Segments (y=-2.5)
  'SEG-SPACE':  [-6, -2.5, 0],
  'SEG-GROUND': [0,  -2.5, 0],
  'SEG-LAUNCH': [6,  -2.5, 0],

  // Subsystems (y=-4.5) — 9 total
  'SUB-PL':   [-16, -4.5, 0],
  'SUB-EPS':  [-12, -4.5, 0],
  'SUB-OBC':  [-8,  -4.5, 0],
  'SUB-TTC':  [-4,  -4.5, 0],
  'SUB-AOCS': [0,   -4.5, 0],
  'SUB-THER': [4,   -4.5, 0],
  'SUB-STR':  [8,   -4.5, 0],
  'SUB-GND':  [12,  -4.5, 0],
  'SUB-OPS':  [16,  -4.5, 0],

  // Components row 1 (y=-7) — PL, EPS, OBC
  'CMP-PAN-CAM':  [-19,  -7, 0],
  'CMP-MS-CAM':   [-17,  -7, 0],
  'CMP-OPTICS':   [-15,  -7, 0],
  'CMP-FEE':      [-13,  -7, 0],

  'CMP-SOLAR':    [-10,  -7, 0],
  'CMP-BATT':     [-8,   -7, 0],
  'CMP-PCDU':     [-6,   -7, 0],

  'CMP-OBC':      [-3,   -7, 0],
  'CMP-MMEM':     [-1,   -7, 0],
  'CMP-SW-FDIR':  [1,    -7, 0],

  // Components row 2 (y=-9) — TTC, AOCS, THER, STR, GND, OPS
  'CMP-TXRX':     [-14,  -9, 0],
  'CMP-ANT-SAT':  [-12,  -9, 0],

  'CMP-RWA':      [-9,   -9, 0],
  'CMP-MTQ':      [-7,   -9, 0],
  'CMP-SSENS':    [-5,   -9, 0],
  'CMP-STRK':     [-3,   -9, 0],
  'CMP-IMU':      [-1,   -9, 0],

  'CMP-RAD':      [2,    -9, 0],
  'CMP-HEAT':     [4,    -9, 0],

  'CMP-STR':      [7,    -9, 0],

  'CMP-GND-ANT':  [10,   -9, 0],
  'CMP-MCC':      [12,   -9, 0],

  // Interfaces row 1 (y=-11.5)
  'INT-PAN-FEE':   [-18,  -11.5, 0],
  'INT-MS-FEE':    [-15,  -11.5, 0],
  'INT-FEE-OBC':   [-12,  -11.5, 0],
  'INT-OBC-MMEM':  [-9,   -11.5, 0],
  'INT-MMEM-TTC':  [-6,   -11.5, 0],
  'INT-TTC-GND':   [-3,   -11.5, 0],
  'INT-PWR-PL':    [0,    -11.5, 0],

  // Interfaces row 2 (y=-13)
  'INT-PWR-OBC':   [-12,  -13, 0],
  'INT-PWR-TTC':   [-9,   -13, 0],
  'INT-PWR-AOCS':  [-6,   -13, 0],
  'INT-AOCS-OBC':  [-3,   -13, 0],
  'INT-OBC-RWA':   [0,    -13, 0],
  'INT-GND-OPS':   [3,    -13, 0],
  'INT-MECH-PL':   [6,    -13, 0],
};

interface ArchitectureScene3DProps {
  model: ArchitectureModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureScene3D({ model, selectedId, onSelect }: ArchitectureScene3DProps) {
  const objects = useMemo(() => model.entities, [model]);

  const interfaceRelations = useMemo(
    () => model.relations.filter(
      (r) => ['sends_data_to', 'provides_power_to', 'communicates_with', 'contains'].includes(r.type),
    ).slice(0, 40),
    [model],
  );

  return (
    <Canvas camera={{ position: [0, 1.5, 55], fov: 52 }}>
      <color attach="background" args={['#040610']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} color="#cce0ff" />
      <pointLight position={[-15, 15, 5]} intensity={0.4} color="#5580ff" />
      <pointLight position={[15, -5, 5]} intensity={0.3} color="#aa88ff" />
      <Stars radius={100} depth={80} count={4000} factor={3} saturation={0} fade />

      {objects.map((entity) => {
        const pos = layoutPositions[entity.id] ?? [0, 0, 0];
        const color = ENTITY_ACCENT[entity.type] ?? '#8888ff';
        return (
          <SpaceSystemObject
            key={entity.id}
            position={pos}
            id={entity.id}
            name={entity.name}
            color={color}
            active={entity.id === selectedId}
            onClick={() => onSelect(entity.id)}
          />
        );
      })}

      {interfaceRelations.map((rel) => {
        const start = layoutPositions[rel.source] ?? [0, 0, 0];
        const end   = layoutPositions[rel.target] ?? [0, 0, 0];
        if (start[0] === 0 && start[1] === 0 && end[0] === 0 && end[1] === 0) return null;
        return <InterfaceLine3D key={rel.id} start={start} end={end} />;
      })}

      <OrbitControls
        target={[0, 1, 0]}
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={160}
      />
    </Canvas>
  );
}
