import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/**
 * FPS-style fly camera for the 3D scene.
 *
 *  W / S → move forward / backward along the camera's look direction
 *           (in the horizontal plane — Y is locked, so you don't dive
 *           into the floor)
 *  A / D → strafe left / right
 *  Q / E → drop / lift (along world Y)
 *  Shift  → sprint (3×)
 *
 * Both the camera position AND the OrbitControls target are translated
 * by the same vector each frame, so the orientation stays put and the
 * orbit centre always sits in front of the user. Mouse-driven
 * pan/zoom/rotate still works through OrbitControls.
 */
const BASE_SPEED = 14; // units / second
const SPRINT = 3;

export function WASDFlyCam({
  controlsRef,
  active = true,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  active?: boolean;
}) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!active) return;

    const isEditable = (t: EventTarget | null): boolean => {
      const e = t as HTMLElement | null;
      if (!e) return false;
      return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' || !!e.isContentEditable;
    };

    const onDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(k)) {
        keys.current[k] = true;
        e.preventDefault();
      }
      if (e.key === 'Shift') keys.current.shift = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = false;
      if (e.key === 'Shift') keys.current.shift = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      keys.current = {};
    };
  }, [active]);

  useFrame((_, dt) => {
    if (!active) return;
    const k = keys.current;
    if (!k.w && !k.a && !k.s && !k.d && !k.q && !k.e) return;

    const sprint = k.shift ? SPRINT : 1;
    const speed = BASE_SPEED * sprint * dt;

    // Forward = camera's look direction, projected onto XZ
    const forward = new Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
    forward.normalize();

    // Right = forward × worldUp
    const right = new Vector3().crossVectors(forward, camera.up).normalize();

    const move = new Vector3();
    if (k.w) move.add(forward);
    if (k.s) move.sub(forward);
    if (k.d) move.add(right);
    if (k.a) move.sub(right);
    if (k.e) move.y += 1;
    if (k.q) move.y -= 1;
    if (move.lengthSq() === 0) return;
    move.normalize().multiplyScalar(speed);

    camera.position.add(move);
    if (controlsRef.current) {
      controlsRef.current.target.add(move);
      controlsRef.current.update();
    }
  });

  return null;
}
