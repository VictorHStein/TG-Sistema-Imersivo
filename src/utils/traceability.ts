import type { ArchitectureModel, ArchitectureEntity } from '../types/architecture';

export interface TraceChainNode {
  entity: ArchitectureEntity;
  relationType?: string;
  direction: 'up' | 'down' | 'root';
}

export function buildUpwardChain(
  entityId: string,
  model: ArchitectureModel,
  maxDepth = 12,
): TraceChainNode[] {
  const chain: TraceChainNode[] = [];
  const visited = new Set<string>();
  let currentId = entityId;

  for (let depth = 0; depth < maxDepth; depth++) {
    if (visited.has(currentId)) break;
    visited.add(currentId);

    const entity = model.entities.find((e) => e.id === currentId);
    if (!entity) break;

    chain.unshift({
      entity,
      direction: depth === 0 ? 'root' : 'up',
    });

    const parentRel = model.relations.find(
      (r) => r.target === currentId && r.type === 'contains',
    );
    if (!parentRel) break;
    currentId = parentRel.source;
  }

  return chain;
}

export function buildDownwardChain(
  entityId: string,
  model: ArchitectureModel,
  maxDepth = 3,
): TraceChainNode[] {
  const result: TraceChainNode[] = [];

  function recurse(id: string, depth: number, relType?: string) {
    if (depth > maxDepth) return;
    const entity = model.entities.find((e) => e.id === id);
    if (!entity) return;
    result.push({ entity, relationType: relType, direction: depth === 0 ? 'root' : 'down' });

    const children = model.relations.filter((r) => r.source === id && r.type === 'contains');
    for (const child of children) {
      recurse(child.target, depth + 1, child.type);
    }
  }

  recurse(entityId, 0);
  return result;
}

export function buildSatisfiesChain(
  requirementId: string,
  model: ArchitectureModel,
): { objective?: ArchitectureEntity; functions: ArchitectureEntity[]; components: ArchitectureEntity[] } {
  const objective = (() => {
    const rel = model.relations.find((r) => r.target === requirementId && r.type === 'contains');
    if (!rel) return undefined;
    return model.entities.find((e) => e.id === rel.source);
  })();

  const functions = model.relations
    .filter((r) => r.target === requirementId && r.type === 'satisfies')
    .map((r) => model.entities.find((e) => e.id === r.source))
    .filter((e): e is ArchitectureEntity => !!e);

  const components: ArchitectureEntity[] = [];
  for (const fn of functions) {
    const allocs = model.relations
      .filter((r) => r.source === fn.id && r.type === 'allocated_to')
      .map((r) => model.entities.find((e) => e.id === r.target))
      .filter((e): e is ArchitectureEntity => !!e);
    components.push(...allocs);
  }

  return { objective, functions, components };
}
