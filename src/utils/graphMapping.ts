import type { Node, Edge } from '@xyflow/react';
import type { ArchitectureEntity, ArchitectureRelation, EntityType, RelationType } from '../types/architecture';
import { ENTITY_ACCENT, ENTITY_COLORS, RELATION_COLORS } from '../types/architecture';
import { computeHierarchicalPositions } from './hierarchicalLayout';

export interface EntityNodeData extends Record<string, unknown> {
  label: string;
  entityId: string;
  entityType: EntityType;
  status?: string;
  accent: string;
  color: string;
}

export type EntityNode = Node<EntityNodeData, 'entity'>;

export function entitiesToNodes(entities: ArchitectureEntity[], relations: ArchitectureRelation[]): EntityNode[] {
  const positions = computeHierarchicalPositions(entities, relations);

  return entities.map((entity) => {
    const pos = positions.get(entity.id) ?? { x: 0, y: 0 };
    return {
      id: entity.id,
      type: 'entity',
      position: pos,
      data: {
        label: entity.name,
        entityId: entity.id,
        entityType: entity.type,
        status: entity.status,
        accent: ENTITY_ACCENT[entity.type] ?? '#94a3b8',
        color: ENTITY_COLORS[entity.type] ?? '#1e293b',
      },
    };
  });
}

export function relationsToEdges(
  relations: ArchitectureRelation[],
  visibleIds: Set<string>,
  viewMode: string,
): Edge[] {
  return relations
    .filter((r) => visibleIds.has(r.source) && visibleIds.has(r.target))
    .map((rel) => {
      const isContains = rel.type === 'contains';
      const color = RELATION_COLORS[rel.type as RelationType] ?? '#475569';
      const faint = isContains && viewMode !== 'ALL' && viewMode !== 'STRUCTURAL';

      return {
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: 'relation',
        data: {
          relationType: rel.type,
          description: rel.description,
          faint,
        },
        style: {
          stroke: faint ? '#1e3a5f' : color,
          strokeWidth: faint ? 1 : isContains ? 1.5 : 2,
          opacity: faint ? 0.3 : isContains ? 0.55 : 0.9,
        },
        animated: !faint && ['sends_data_to', 'receives_command_from', 'controls', 'provides_power_to'].includes(rel.type),
        zIndex: faint ? 0 : 10,
      };
    });
}
