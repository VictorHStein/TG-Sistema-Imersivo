import { useState, useMemo } from 'react';
import { useArchitectureStore } from '../../store/useArchitectureStore';
import { RELATION_COLORS } from '../../types/architecture';
import type { RelationType } from '../../types/architecture';

const ALL_TYPES: RelationType[] = [
  'contains', 'satisfies', 'allocated_to', 'verifies', 'depends_on',
  'provides_power_to', 'sends_data_to', 'receives_command_from',
  'mechanically_attached_to', 'thermally_coupled_to', 'controls',
  'measures', 'actuates', 'communicates_with', 'constrains',
  'mitigates', 'uses', 'validates',
];

export function RelationshipExplorer() {
  const { model, setSelectedId } = useArchitectureStore();
  const [filter, setFilter] = useState<RelationType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let rels = model.relations;
    if (filter !== 'ALL') rels = rels.filter((r) => r.type === filter);
    if (search) {
      const q = search.toLowerCase();
      rels = rels.filter((r) => {
        const src = model.entities.find((e) => e.id === r.source);
        const tgt = model.entities.find((e) => e.id === r.target);
        return (
          r.type.includes(q) ||
          src?.name.toLowerCase().includes(q) ||
          tgt?.name.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q) ||
          r.target.toLowerCase().includes(q)
        );
      });
    }
    return rels;
  }, [model.relations, model.entities, filter, search]);

  const counts = useMemo(() => {
    const map: Partial<Record<RelationType, number>> = {};
    for (const r of model.relations) {
      map[r.type] = (map[r.type] ?? 0) + 1;
    }
    return map;
  }, [model.relations]);

  return (
    <div className="panel-body" style={{ paddingTop: 8 }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search entities or relation types..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 4,
          color: 'var(--text-primary)',
          fontSize: 'var(--text-xs)',
          padding: '6px 10px',
          fontFamily: 'var(--font-mono)',
          marginBottom: 10,
          boxSizing: 'border-box',
        }}
      />

      {/* Type filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        <button
          onClick={() => setFilter('ALL')}
          style={{
            fontSize: 8,
            fontFamily: 'var(--font-mono)',
            padding: '2px 7px',
            borderRadius: 3,
            border: '1px solid var(--border-subtle)',
            background: filter === 'ALL' ? 'var(--bg-selected)' : 'var(--bg-card)',
            color: filter === 'ALL' ? 'var(--text-accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ALL ({model.relations.length})
        </button>
        {ALL_TYPES.map((type) => {
          const count = counts[type] ?? 0;
          if (count === 0) return null;
          const color = RELATION_COLORS[type] ?? '#475569';
          const active = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                padding: '2px 7px',
                borderRadius: 3,
                border: `1px solid ${active ? color : 'var(--border-subtle)'}`,
                background: active ? 'var(--bg-selected)' : 'var(--bg-card)',
                color: active ? color : 'var(--text-muted)',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {type.replace(/_/g, ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Relations list */}
      <div className="rel-section__title" style={{ marginBottom: 6 }}>
        {filtered.length} relation{filtered.length !== 1 ? 's' : ''}
      </div>

      {filtered.map((rel) => {
        const src = model.entities.find((e) => e.id === rel.source);
        const tgt = model.entities.find((e) => e.id === rel.target);
        const color = RELATION_COLORS[rel.type] ?? '#475569';
        return (
          <div
            key={rel.id}
            style={{
              padding: '6px 8px',
              borderRadius: 4,
              marginBottom: 3,
              background: 'var(--bg-card)',
              borderLeft: `3px solid ${color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {rel.type.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer', flex: 1 }}
                onClick={() => src && setSelectedId(src.id)}
              >
                {src?.name ?? rel.source}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>→</span>
              <span
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer', flex: 1, textAlign: 'right' }}
                onClick={() => tgt && setSelectedId(tgt.id)}
              >
                {tgt?.name ?? rel.target}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
