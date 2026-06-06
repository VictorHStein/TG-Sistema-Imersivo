import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * WASD + Q/E navigation for the 2D React Flow viewport.
 *
 *  • W / S → pan up / down
 *  • A / D → pan left / right
 *  • Q / E → zoom out / in
 *  • Shift  → sprint (3× speed)
 *
 * The keystroke handler ignores inputs/textareas/contenteditable so the
 * user can type in the search box or the Construtor without the canvas
 * stealing keys. Movement runs on a requestAnimationFrame loop so it stays
 * smooth even when the React tree isn't re-rendering.
 *
 * Pan speed scales inversely with the current zoom: panning a heavily
 * zoomed-in view at the same world-space speed would feel sluggish, so we
 * keep the screen-space speed constant by dividing by zoom.
 */
const PAN_BASE = 10;     // px/frame at zoom = 1
const ZOOM_STEP = 0.018; // per frame
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;

export function useKeyboardPan(active: boolean = true): void {
  const { getViewport, setViewport } = useReactFlow();
  const keys = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const isEditable = (t: EventTarget | null): boolean => {
      const e = t as HTMLElement | null;
      if (!e) return false;
      return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' || !!e.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(k)) {
        keys.current[k] = true;
        e.preventDefault();
      }
      if (e.key === 'Shift') keys.current.shift = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = false;
      if (e.key === 'Shift') keys.current.shift = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const loop = () => {
      const v = getViewport();
      const sprint = keys.current.shift ? 3 : 1;
      const speed = (PAN_BASE / v.zoom) * sprint;

      let dx = 0, dy = 0;
      if (keys.current.w) dy += speed;
      if (keys.current.s) dy -= speed;
      if (keys.current.a) dx += speed;
      if (keys.current.d) dx -= speed;

      let dz = 0;
      if (keys.current.q) dz -= ZOOM_STEP * sprint;
      if (keys.current.e) dz += ZOOM_STEP * sprint;

      if (dx !== 0 || dy !== 0 || dz !== 0) {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, v.zoom + dz));
        setViewport({ x: v.x + dx, y: v.y + dy, zoom: newZoom });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      keys.current = {};
    };
  }, [active, getViewport, setViewport]);
}
