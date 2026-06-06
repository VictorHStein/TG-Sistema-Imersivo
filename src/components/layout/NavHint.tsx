import { useEffect, useState } from 'react';

/**
 * Tiny floating chip in the bottom-left corner of the canvas reminding
 * the user that WASD works. Dismissable; remembers the dismissal in
 * localStorage so it shows up exactly once per browser.
 */
const KEY = 'tg-nav-hint-dismissed-v1';

export function NavHint({ mode }: { mode: '2d' | '3d' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch { /* localStorage disabled */ }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  };

  if (!open) return null;

  return (
    <div className="nav-hint" role="status">
      <div className="nav-hint__row">
        <span className="nav-hint__title">Navegação por teclado</span>
        <button className="nav-hint__close" onClick={dismiss} aria-label="Fechar dica">×</button>
      </div>
      <div className="nav-hint__keys">
        <Kbd>W</Kbd> <Kbd>A</Kbd> <Kbd>S</Kbd> <Kbd>D</Kbd>
        <span className="nav-hint__sep">{mode === '3d' ? 'mover (XZ)' : 'pan'}</span>
        <Kbd>Q</Kbd> <Kbd>E</Kbd>
        <span className="nav-hint__sep">{mode === '3d' ? 'descer / subir' : 'zoom −/+'}</span>
        <Kbd>Shift</Kbd>
        <span className="nav-hint__sep">acelerar</span>
      </div>
      <div className="nav-hint__row nav-hint__sub">
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> busca · <Kbd>Esc</Kbd> limpa
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="nav-hint__kbd">{children}</kbd>;
}
