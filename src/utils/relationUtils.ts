import type { ArchitectureModel, ArchitectureEntity, ArchitectureRelation, RelationType } from '../types/architecture';
import type { ViewMode } from '../store/useArchitectureStore';

export function getNeighbors(
  entityId: string,
  model: ArchitectureModel,
  direction: 'out' | 'in' | 'both' = 'both',
): { relation: ArchitectureRelation; entity: ArchitectureEntity }[] {
  const results: { relation: ArchitectureRelation; entity: ArchitectureEntity }[] = [];
  for (const rel of model.relations) {
    if ((direction === 'out' || direction === 'both') && rel.source === entityId) {
      const target = model.entities.find((e) => e.id === rel.target);
      if (target) results.push({ relation: rel, entity: target });
    }
    if ((direction === 'in' || direction === 'both') && rel.target === entityId) {
      const source = model.entities.find((e) => e.id === rel.source);
      if (source) results.push({ relation: rel, entity: source });
    }
  }
  return results;
}

export function filterRelationsByView(
  relations: ArchitectureRelation[],
  viewMode: ViewMode,
): ArchitectureRelation[] {
  const VIEW_TYPES: Record<ViewMode, RelationType[]> = {
    ALL: [],
    POWER: ['provides_power_to', 'allocated_to'],
    DATA: ['sends_data_to', 'communicates_with', 'uses'],
    COMMAND: ['receives_command_from', 'controls', 'actuates'],
    THERMAL: ['thermally_coupled_to'],
    STRUCTURAL: ['mechanically_attached_to', 'contains'],
    VERIFICATION: ['verifies', 'validates', 'constrains'],
  };
  const types = VIEW_TYPES[viewMode];
  if (types.length === 0) return relations;
  return relations.filter((r) => types.includes(r.type));
}

export function groupRelationsByType(
  relations: ArchitectureRelation[],
): Record<RelationType, ArchitectureRelation[]> {
  const result = {} as Record<RelationType, ArchitectureRelation[]>;
  for (const rel of relations) {
    if (!result[rel.type]) result[rel.type] = [];
    result[rel.type].push(rel);
  }
  return result;
}

export function getEntityRelations(
  entityId: string,
  model: ArchitectureModel,
): { outgoing: ArchitectureRelation[]; incoming: ArchitectureRelation[] } {
  const outgoing = model.relations.filter((r) => r.source === entityId);
  const incoming = model.relations.filter((r) => r.target === entityId);
  return { outgoing, incoming };
}
