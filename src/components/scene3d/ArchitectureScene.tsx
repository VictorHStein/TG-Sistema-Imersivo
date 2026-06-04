import { Suspense, useMemo, useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';

import {
  useArchitectureStore,
  computeVisibleEntities,
  computeVisibleRelations,
} from '../../state/architectureStore';
import { EntityMesh } from './EntityMesh';
import { RelationTube } from './RelationTube';
import { SceneMiniMap } from './SceneMiniMap';
import { use3DLayout, type ThreeDPosition } from './use3DLayout';
import { getRelationVisualStyle } from '../../domain/parser/relationStyle';

function CameraControls({
  controlsRef,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  // Bind ref via useEffect on mount of OrbitControls
  return (
    <OrbitControls
      ref={(instance) => {
        if (instance) controlsRef.current = instance;
      }}
      enablePan
      enableZoom
      enableRotate
      minDistance={6}
      maxDistance={90}
      target={[0, 0, 0]}
      maxPolarAngle={Math.PI * 0.85}
    />
  );
}

function CameraFocus({
  target,
  controlsRef,
}: {
  target: ThreeDPosition | null;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (!target) return;
    const t = new Vector3(target.x, target.y, target.z);
    const dist = camera.position.distanceTo(t);
    const dir = new Vector3().subVectors(camera.position, t).normalize();
    const next = t.clone().add(dir.multiplyScalar(Math.min(Math.max(dist * 0.55, 7), 14)));
    camera.position.copy(next);
    if (controlsRef.current) {
      controlsRef.current.target.copy(t);
      controlsRef.current.update();
    }
  }, [target, camera, controlsRef]);
  return null;
}

function SceneContent({
  controlsRef,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectedEntityId = useArchitectureStore((s) => s.selectedEntityId);
  const selectedRelationId = useArchitectureStore((s) => s.selectedRelationId);
  const focusedSubsystemId = useArchitectureStore((s) => s.focusedSubsystemId);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const selectRelation = useArchitectureStore((s) => s.selectRelation);

  const visibleCategories = useArchitectureStore((s) => s.visibleCategories);
  const visibleRelationTypes = useArchitectureStore((s) => s.visibleRelationTypes);
  const explorationMode = useArchitectureStore((s) => s.explorationMode);
  const currentStep = useArchitectureStore((s) => s.currentStep);
  const showOnlyCrossCategory = useArchitectureStore((s) => s.showOnlyCrossCategory);

  const visibleEntities = useMemo(
    () => computeVisibleEntities(architecture, visibleCategories, explorationMode, currentStep),
    [architecture, visibleCategories, explorationMode, currentStep],
  );
  const visibleRelations = useMemo(
    () => computeVisibleRelations(architecture, visibleEntities, visibleRelationTypes, explorationMode, currentStep, showOnlyCrossCategory),
    [architecture, visibleEntities, visibleRelationTypes, explorationMode, currentStep, showOnlyCrossCategory],
  );

  const layout = use3DLayout(architecture);

  const focusedNeighbors = useMemo(() => {
    if (!architecture || (!selectedEntityId && !focusedSubsystemId)) return null;
    const focusId = selectedEntityId ?? focusedSubsystemId!;
    const set = new Set<string>([focusId]);
    const relSet = new Set<string>();
    for (const r of architecture.relations) {
      if (r.source === focusId) { set.add(r.target); relSet.add(r.id); }
      if (r.target === focusId) { set.add(r.source); relSet.add(r.id); }
    }
    for (const e of architecture.entities) {
      if (e.parentId === focusId) set.add(e.id);
    }
    return { entityIds: set, relationIds: relSet };
  }, [architecture, selectedEntityId, focusedSubsystemId]);

  const focusTarget = useMemo<ThreeDPosition | null>(() => {
    if (!architecture) return null;
    const id = selectedEntityId ?? focusedSubsystemId;
    if (!id) return null;
    return layout.positions.get(id) ?? null;
  }, [architecture, selectedEntityId, focusedSubsystemId, layout]);

  if (!architecture) return null;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[12, 16, 8]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-12, 8, -8]} intensity={0.5} color="#5b85ff" />
      <pointLight position={[0, -10, 0]} intensity={0.3} color="#a78bfa" />
      <pointLight position={[0, 6, 0]} intensity={0.4} color="#38bdf8" distance={20} />

      <Stars radius={120} depth={70} count={5500} factor={3.5} saturation={0} fade />

      {/* Radial-fan platform — concentric rings one per layer */}
      {[2.4, 5.0, 7.0, 9.5, 12.5, 14.5].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]} position={[0, -3.6, 0]}>
          <ringGeometry args={[r, r + 0.06, 96]} />
          <meshBasicMaterial color="#38bdf8" opacity={i === 0 ? 0.22 : 0.08} transparent />
        </mesh>
      ))}
      {/* Center marker */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -3.55, 0]}>
        <circleGeometry args={[0.6, 36]} />
        <meshBasicMaterial color="#38bdf8" opacity={0.18} transparent />
      </mesh>

      <CameraFocus target={focusTarget} controlsRef={controlsRef} />

      {/* Entity meshes */}
      {visibleEntities.map((entity) => {
        const pos = layout.positions.get(entity.id) ?? { x: 0, y: 0, z: 0 };
        const cat = architecture.categoriesById[entity.category];
        const isSelected = entity.id === selectedEntityId;
        const isHighlighted = focusedNeighbors?.entityIds.has(entity.id) ?? false;
        const isDimmed =
          (selectedEntityId !== null || focusedSubsystemId !== null) && !isHighlighted;
        const showLabel =
          isSelected
          || isHighlighted
          || entity.category === 'mission'
          || entity.category === 'subsystem'
          || !!focusedSubsystemId && entity.id === focusedSubsystemId;
        return (
          <EntityMesh
            key={entity.id}
            entity={entity}
            category={cat}
            position={[pos.x, pos.y, pos.z]}
            breakdownCode={architecture.breakdownCodes[entity.id]}
            isSelected={isSelected}
            isHighlighted={isHighlighted && !isSelected}
            isDimmed={isDimmed}
            showLabel={showLabel}
            onSelect={selectEntity}
          />
        );
      })}

      {/* Relation tubes */}
      {visibleRelations.map((relation) => {
        const rt = architecture.relationTypesById[relation.type];
        const fromPos = layout.positions.get(relation.source);
        const toPos = layout.positions.get(relation.target);
        if (!fromPos || !toPos) return null;
        const source = architecture.entitiesById[relation.source];
        const target = architecture.entitiesById[relation.target];

        const isSelected = relation.id === selectedRelationId;
        const inFocus = focusedNeighbors?.relationIds.has(relation.id) ?? false;
        const isDimmed =
          (selectedEntityId !== null || focusedSubsystemId !== null) && !inFocus && !isSelected;

        const vs = getRelationVisualStyle(relation, rt, source, target, {
          selected: isSelected,
          emphasizedByFilter: inFocus,
          dimmed: isDimmed,
        });

        const showBadge =
          isSelected || inFocus || vs.isCrossCategory || vs.isCritical;

        return (
          <RelationTube
            key={relation.id}
            relationId={relation.id}
            relationIndex={rt.index}
            from={[fromPos.x, fromPos.y, fromPos.z]}
            to={[toPos.x, toPos.y, toPos.z]}
            style={vs}
            selected={isSelected}
            emphasizedByFilter={inFocus}
            showBadge={showBadge}
            onSelect={selectRelation}
          />
        );
      })}
    </>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export function ArchitectureScene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const focusSubsystem = useArchitectureStore((s) => s.focusSubsystem);
  const focusedId = useArchitectureStore((s) => s.focusedSubsystemId);

  const recenter = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  const subsystems = useMemo(
    () => architecture?.entities.filter((e) => e.category === 'subsystem') ?? [],
    [architecture],
  );

  return (
    <div className="scene3d-shell">
      <Canvas
        camera={{ position: [22, 17, 22], fov: 48 }}
        style={{ width: '100%', height: '100%' }}
        onPointerMissed={() => { selectEntity(null); }}
      >
        <color attach="background" args={['#02050f']} />
        <Suspense fallback={null}>
          <SceneContent controlsRef={controlsRef} />
        </Suspense>
        <CameraControls controlsRef={controlsRef} />
      </Canvas>

      {/* Camera HUD */}
      <div className="scene3d-hud">
        <button className="hud-btn" onClick={() => { selectEntity(null); focusSubsystem(null); recenter(); }}>
          Centralizar
        </button>
        <div className="hud-divider" />
        <div className="hud-label">Focar subsistema:</div>
        <div className="hud-chips">
          {subsystems.map((s) => (
            <button
              key={s.id}
              className={`hud-chip${focusedId === s.id ? ' is-on' : ''}`}
              onClick={() => focusSubsystem(focusedId === s.id ? null : s.id)}
            >
              {s.subsystem ?? s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <SceneMiniMap />
    </div>
  );
}
