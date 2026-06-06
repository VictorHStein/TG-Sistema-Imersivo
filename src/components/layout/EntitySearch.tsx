import { useEffect, useMemo, useRef, useState } from 'react';
import { useArchitectureStore } from '../../state/architectureStore';
import type { ArchitectureEntity } from '../../domain/model/ArchitectureTypes';

/**
 * Top-bar search box. Lets the user jump to any entity by name, id, or
 * breakdown code. Matches are scored:
 *   3 → name starts with the query
 *   2 → name contains the query
 *   2 → breakdown code is exact prefix (e.g. "1.2" matches 1.2.1, 1.2.2…)
 *   1 → id contains the query
 *
 * Up to 8 best matches are shown. Enter / click selects.
 * Ctrl+K (or ⌘K) focuses the input from anywhere.
 */
export function EntitySearch() {
  const architecture = useArchitectureStore((s) => s.architecture);
  const selectEntity = useArchitectureStore((s) => s.selectEntity);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Ctrl+K / Cmd+K focuses search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const matches = useMemo(() => {
    if (!architecture || q.trim().length === 0) return [];
    const query = q.trim().toLowerCase();
    type Match = { entity: ArchitectureEntity; score: number; code: string };
    const out: Match[] = [];
    for (const e of architecture.entities) {
      const name = e.name.toLowerCase();
      const id = e.id.toLowerCase();
      const code = (architecture.breakdownCodes[e.id] ?? '').toLowerCase();
      let score = 0;
      if (name.startsWith(query)) score = Math.max(score, 3);
      else if (name.includes(query)) score = Math.max(score, 2);
      if (code.startsWith(query)) score = Math.max(score, 2);
      if (id.includes(query)) score = Math.max(score, 1);
      if (score > 0) out.push({ entity: e, score, code: architecture.breakdownCodes[e.id] ?? '' });
    }
    out.sort((a, b) => b.score - a.score || a.entity.name.localeCompare(b.entity.name));
    return out.slice(0, 8);
  }, [architecture, q]);

  // Reset selection cursor when matches change
  useEffect(() => {
    setActiveIdx(0);
  }, [matches.length]);

  const pick = (id: string) => {
    selectEntity(id);
    setQ('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && matches[activeIdx]) {
      pick(matches[activeIdx].entity.id);
    } else if (e.key === 'Escape') {
      setQ('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="entity-search" ref={wrapRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar… (Ctrl+K)"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="entity-search__input"
        spellCheck={false}
      />
      {open && matches.length > 0 && (
        <ul className="entity-search__menu">
          {matches.map((m, i) => {
            const cat = architecture?.categoriesById[m.entity.category];
            return (
              <li
                key={m.entity.id}
                className={`entity-search__item${i === activeIdx ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => pick(m.entity.id)}
              >
                <span className="entity-search__code" style={{ background: `${cat?.color}1a`, color: cat?.color, borderColor: `${cat?.color}55` }}>
                  {m.code || m.entity.id}
                </span>
                <span className="entity-search__name">{m.entity.name}</span>
                <span className="entity-search__cat" style={{ color: cat?.color }}>{cat?.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
