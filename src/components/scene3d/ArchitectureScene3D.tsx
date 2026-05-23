import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo } from 'react';
import type { SystemModel } from '../../types';
import { SpaceSystemObject } from './SpaceSystemObject';
import { InterfaceLine3D } from './InterfaceLine3D';

export const typeColors: Record<string, string> = {
  mission:     '#7b9eff',
  objective:   '#3ad8d6',
  requirement: '#8be6ca',
  function:    '#f7b32b',
  system:      '#9b8cff',
  component:   '#e375f7',
  interface:   '#79d2ff'
};

// Layout based on actual IDs from demo.ts
const layoutPositions: Record<string, [number, number, number]> = {
  // ── Mission ──────────────────────────────────────────────
  'MIS-SAT-OBS-001': [0, 14, 0],

  // ── Objectives (3) ───────────────────────────────────────
  'OBJ-IMAGING':    [-7, 10, 0],
  'OBJ-OPERATIONS': [0,  10, 0],
  'OBJ-SCIENCE':    [7,  10, 0],

  // ── Requirements (9): step 3.5, x: -14 → +14 ─────────────
  'REQ-GSD-PAN':      [-14,  6, 0],
  'REQ-GSD-MS':       [-10.5, 6, 0],
  'REQ-RADIOMETRIC':  [-7,   6, 0],
  'REQ-TEMPORAL':     [-3.5, 6, 0],
  'REQ-RELIABILITY':  [0,    6, 0],
  'REQ-POWER':        [3.5,  6, 0],
  'REQ-THERMAL':      [7,    6, 0],
  'REQ-DATA-ARCHIVE': [10.5, 6, 0],
  'REQ-CALIBRATION':  [14,   6, 0],

  // ── Functions (17): 13 at y=2.5, 4 at y=1.0 ─────────────
  'FUN-ACQUIRE-PAN':      [-14,   2.5, 0],
  'FUN-ACQUIRE-MS':       [-11.5, 2.5, 0],
  'FUN-FOCUS-OPTICS':     [-9,    2.5, 0],
  'FUN-CALIBRATE-BANDS':  [-6.5,  2.5, 0],
  'FUN-DIGITALIZE-SIGNAL':[-4,    2.5, 0],
  'FUN-SCHEDULE-PASS':    [-1.5,  2.5, 0],
  'FUN-MANAGE-ATTITUDE':  [1,     2.5, 0],
  'FUN-MONITOR-HEALTH':   [3.5,   2.5, 0],
  'FUN-FAULT_TOLERANCE':  [6,     2.5, 0],
  'FUN-GEN-SOLAR':        [8.5,   2.5, 0],
  'FUN-STORE-ENERGY':     [11,    2.5, 0],
  'FUN-DISSIPATE-HEAT':   [13,    2.5, 0],
  'FUN-REGULATE_TEMP':    [15,    2.5, 0],
  // overflow row
  'FUN-STORE-DATA':       [-5,    1.0, 0],
  'FUN-COMPRESS-IMAGE':   [-2.5,  1.0, 0],
  'FUN-GEO-REFERENCE':    [0,     1.0, 0],
  'FUN-VALIDATE-CALIB':   [2.5,   1.0, 0],

  // ── Systems (8): step 4, x: -14 → +14 ───────────────────
  'SYS-PAYLOAD':   [-14, -1, 0],
  'SYS-DPE':       [-10, -1, 0],
  'SYS-EPS':       [-6,  -1, 0],
  'SYS-AOCS':      [-2,  -1, 0],
  'SYS-THERMAL':   [2,   -1, 0],
  'SYS-OBC':       [6,   -1, 0],
  'SYS-TTC':       [10,  -1, 0],
  'SYS-STRUCTURE': [14,  -1, 0],

  // ── Components row 1 (y=-4): PAYLOAD, DPE, EPS, AOCS ────
  'CMP-PAN-CAM':      [-16,  -4, 0],
  'CMP-MS-CAM':       [-14,  -4, 0],
  'CMP-OPTICS':       [-12.5,-4, 0],
  'CMP-FEE':          [-11,  -4, 0],

  'CMP-FPGA':         [-8.5, -4, 0],
  'CMP-SSD':          [-7,   -4, 0],
  'CMP-MEMORY':       [-5.5, -4, 0],

  'CMP-SOLAR':        [-3.5, -4, 0],
  'CMP-BATTERY':      [-2,   -4, 0],
  'CMP-PDU':          [-0.5, -4, 0],
  'CMP-DCDC':         [1,    -4, 0],

  'CMP-STAR-TRACKER': [2.5,  -4, 0],
  'CMP-RW':           [4,    -4, 0],
  'CMP-GYRO':         [5.5,  -4, 0],
  'CMP-MAGNET':       [7,    -4, 0],

  // ── Components row 2 (y=-6.5): THERMAL, OBC, TTC, STRUCTURE
  'CMP-RADIATOR':     [-7,   -6.5, 0],
  'CMP-HEATER':       [-5.5, -6.5, 0],
  'CMP-INSULATION':   [-4,   -6.5, 0],

  'CMP-CPU':          [-2.5, -6.5, 0],
  'CMP-ROM':          [-1,   -6.5, 0],
  'CMP-RAM':          [0.5,  -6.5, 0],

  'CMP-TX':           [2,    -6.5, 0],
  'CMP-RX':           [3.5,  -6.5, 0],
  'CMP-ANTENNA-TX':   [5,    -6.5, 0],
  'CMP-ANTENNA-RX':   [6.5,  -6.5, 0],

  'CMP-FRAME':        [8,    -6.5, 0],
  'CMP-PANELS':       [9.5,  -6.5, 0],
  'CMP-DEPLOY':       [11,   -6.5, 0],

  // ── Interfaces row 1 (y=-9) ──────────────────────────────
  'INT-PAN-SIGNAL':    [-12,  -9, 0],
  'INT-MS-SIGNAL':     [-9,   -9, 0],
  'INT-PL-POWER':      [-6,   -9, 0],
  'INT-DPE-DATA':      [-3,   -9, 0],
  'INT-DPE-POWER':     [0,    -9, 0],
  'INT-SOLAR-BUS':     [3,    -9, 0],
  'INT-BATT-BUS':      [6,    -9, 0],
  'INT-BUS-28V':       [9,    -9, 0],
  'INT-AOCS-POWER':    [12,   -9, 0],

  // ── Interfaces row 2 (y=-11) ─────────────────────────────
  'INT-AOCS-DATA':     [-12,  -11, 0],
  'INT-AOCS-CTRL':     [-9,   -11, 0],
  'INT-THERMAL-POWER': [-6,   -11, 0],
  'INT-OBC-POWER':     [-3,   -11, 0],
  'INT-OBC-DATA':      [0,    -11, 0],
  'INT-TTC-POWER':     [3,    -11, 0],
  'INT-TTC-DATA':      [6,    -11, 0],
  'INT-MECH-SUPPORT':  [9,    -11, 0],
};

interface ArchitectureScene3DProps {
  model: SystemModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureScene3D({ model, selectedId, onSelect }: ArchitectureScene3DProps) {
  const objects = useMemo(
    () => [
      model.mission,
      ...model.objectives,
      ...model.requirements,
      ...model.functions,
      ...model.systems,
      ...model.components,
      ...model.interfaces
    ],
    [model]
  );

  return (
    <Canvas camera={{ position: [0, 1.5, 42], fov: 52 }}>
      <color attach="background" args={['#040610']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} color="#cce0ff" />
      <pointLight position={[-15, 15, 5]} intensity={0.4} color="#5580ff" />
      <pointLight position={[15, -5, 5]} intensity={0.3} color="#aa88ff" />
      <Stars radius={100} depth={80} count={4000} factor={3} saturation={0} fade />

      {objects.map((item) => {
        const pos = layoutPositions[item.id] ?? [0, 0, 0];
        const color = typeColors[item.type] ?? '#8888ff';
        return (
          <SpaceSystemObject
            key={item.id}
            position={pos}
            id={item.id}
            name={item.name}
            color={color}
            active={item.id === selectedId}
            onClick={() => onSelect(item.id)}
          />
        );
      })}

      {model.traceLinks.map((link) => {
        const start = layoutPositions[link.from] ?? [0, 0, 0];
        const end   = layoutPositions[link.to]   ?? [0, 0, 0];
        return <InterfaceLine3D key={link.id} start={start} end={end} />;
      })}

      <OrbitControls
        target={[0, 1, 0]}
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={120}
      />
    </Canvas>
  );
}
