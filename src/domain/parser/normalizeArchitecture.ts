import type {
  ArchitectureInput,
  ArchitectureRelation,
  NormalizedArchitecture,
} from '../model/ArchitectureTypes';

/**
 * Build lookup tables and derived counters from a validated ArchitectureInput.
 * The output is what every visualization actually consumes.
 */
export function normalizeArchitecture(input: ArchitectureInput): NormalizedArchitecture {
  const entitiesById = Object.fromEntries(input.entities.map((e) => [e.id, e]));
  const relationTypesById = Object.fromEntries(input.relationTypes.map((r) => [r.id, r]));
  const categoriesById = Object.fromEntries(input.categories.map((c) => [c.id, c]));

  const relationsByEntity: Record<string, { incoming: ArchitectureRelation[]; outgoing: ArchitectureRelation[] }> = {};
  for (const e of input.entities) {
    relationsByEntity[e.id] = { incoming: [], outgoing: [] };
  }
  for (const r of input.relations) {
    if (relationsByEntity[r.source]) relationsByEntity[r.source].outgoing.push(r);
    if (relationsByEntity[r.target]) relationsByEntity[r.target].incoming.push(r);
  }

  // maxStep — preferred from views.maxStep, otherwise scan entities + relations
  const declaredMax = input.views?.maxStep ?? 0;
  const scannedMax = Math.max(
    0,
    ...input.entities.map((e) => e.step),
    ...input.relations.map((r) => r.step),
  );
  const maxStep = Math.max(declaredMax, scannedMax, 1);

  return {
    ...input,
    entitiesById,
    relationTypesById,
    categoriesById,
    relationsByEntity,
    maxStep,
  };
}
