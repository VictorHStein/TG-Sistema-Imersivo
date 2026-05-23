import type { ArchitectureEntity, ArchitectureRelation } from '../types/architecture';

export interface LayoutPos { x: number; y: number }

const NODE_W = 200;
const NODE_H = 80;
const H_GAP  = 28;   // gap between siblings (horizontal)
const V_GAP  = 120;  // gap between layers (vertical)

/**
 * Top-to-bottom hierarchical layout.
 * Sorts siblings by their proxy-parent's X so edges stay short and local.
 */
export function computeHierarchicalPositions(
  entities: ArchitectureEntity[],
  relations: ArchitectureRelation[],
): Map<string, LayoutPos> {
  const positions = new Map<string, LayoutPos>();

  // Build contains parent map
  const parentOf = new Map<string, string>();
  for (const rel of relations) {
    if (rel.type === 'contains') parentOf.set(rel.target, rel.source);
  }

  // Build proxy parent map for non-hierarchy entities (functions, operations)
  const proxyParentOf = new Map<string, string>();
  for (const rel of relations) {
    if (rel.type === 'satisfies') {
      // function → requirement: use requirement as proxy parent for sorting
      if (!parentOf.has(rel.source)) proxyParentOf.set(rel.source, rel.target);
    }
    if (rel.type === 'allocated_to') {
      if (!parentOf.has(rel.source) && !proxyParentOf.has(rel.source)) {
        proxyParentOf.set(rel.source, rel.target);
      }
    }
    if (rel.type === 'uses') {
      // operation → function: use function as proxy parent
      if (!parentOf.has(rel.source) && !proxyParentOf.has(rel.source)) {
        proxyParentOf.set(rel.source, rel.target);
      }
    }
  }

  // Group entities by layer
  const byLayer = new Map<number, ArchitectureEntity[]>();
  for (const e of entities) {
    const l = e.layer ?? 0;
    if (!byLayer.has(l)) byLayer.set(l, []);
    byLayer.get(l)!.push(e);
  }

  const layers = [...byLayer.keys()].sort((a, b) => a - b);

  for (const layer of layers) {
    const nodes = [...byLayer.get(layer)!];

    // Sort by proxy-parent X to minimize crossings
    nodes.sort((a, b) => {
      const xa = getParentX(a.id, parentOf, proxyParentOf, positions);
      const xb = getParentX(b.id, parentOf, proxyParentOf, positions);
      if (xa !== xb) return xa - xb;
      return a.id.localeCompare(b.id); // stable fallback
    });

    const n = nodes.length;
    const step = NODE_W + H_GAP;
    const totalW = n * step - H_GAP;

    nodes.forEach((entity, i) => {
      positions.set(entity.id, {
        x: i * step - totalW / 2,
        y: layer * (NODE_H + V_GAP),
      });
    });
  }

  return positions;
}

function getParentX(
  id: string,
  parentOf: Map<string, string>,
  proxyParentOf: Map<string, string>,
  positions: Map<string, LayoutPos>,
): number {
  const pid = parentOf.get(id) ?? proxyParentOf.get(id);
  if (pid) {
    const pos = positions.get(pid);
    if (pos) return pos.x;
  }
  return 0;
}
