import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * Zoom-only keyboard control for the 2D React Flow viewport.
 *
 *   Q / − → zoom out
 *   E / + → zoom in
 *   Shift  → 3× (sprint)
 *
 * In 2D the "up/down/forward/back" concepts don't apply (it's a flat
 * graph), so only zoom is mapped to the keyboard. Pan still works with
 * mouse drag.
 *
 * The zoom step is set to ~0.08 per frame — about 4× faster than the
 * old WASD pan version — so a tap of E quickly zooms into the detail.
 */
const ZOOM_STEP = 0.08;
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
      // Q / - / _ zoom out; E / + / = zoom in
      if (k === 'q' || e.key === '-' || e.key === '_') {
        keys.current.out = true;
        e.preventDefault();
      } else if (k === 'e' || e.key === '+' || e.key === '=') {
        keys.current.in = true;
        e.preventDefault();
      }
      if (e.key === 'Shift') keys.current.shift = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'q' || e.key === '-' || e.key === '_') keys.current.out = false;
      if (k === 'e' || e.key === '+' || e.key === '=') keys.current.in = false;
      if (e.key === 'Shift') keys.current.shift = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const loop = () => {
      const v = getViewport();
      const sprint = keys.current.shift ? 3 : 1;

      let dz = 0;
      if (keys.current.out) dz -= ZOOM_STEP * sprint;
      if (keys.current.in) dz += ZOOM_STEP * sprint;

      if (dz !== 0) {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, v.zoom + dz));
        if (newZoom !== v.zoom) setViewport({ x: v.x, y: v.y, zoom: newZoom });
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
