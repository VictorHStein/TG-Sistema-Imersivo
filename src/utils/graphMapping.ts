import type { Node, Edge } from '@xyflow/react';
import type { ArchitectureEntity, ArchitectureRelation, EntityType } from '../types/architecture';
import { ENTITY_ACCENT, ENTITY_COLORS, RELATION_COLORS, ENTITY_LAYERS } from '../types/architecture';

export interface EntityNodeData extends Record<string, unknown> {
  label: string;
  entityId: string;
  entityType: EntityType;
  status?: string;
  layer: number;
  color: string;
  accent: string;
  selected: boolean;
}

export type EntityNode = Node<EntityNodeData, 'entity'>;

const LAYER_GAP_X = 260;
const LAYER_GAP_Y = 90;

export function entitiesToNodes(
  entities: ArchitectureEntity[],
  selectedId: string | null,
): EntityNode[] {
  const byLayer: Record<number, ArchitectureEntity[]> = {};
  for (const e of entities) {
    const l = e.layer ?? ENTITY_LAYERS[e.type] ?? 0;
    if (!byLayer[l]) byLayer[l] = [];
    byLayer[l].push(e);
  }

  const nodes: EntityNode[] = [];
  for (const [layerStr, group] of Object.entries(byLayer)) {
    const layer = Number(layerStr);
    group.forEach((entity, idx) => {
      nodes.push({
        id: entity.id,
        type: 'entity',
        position: {
          x: layer * LAYER_GAP_X,
          y: idx * LAYER_GAP_Y - ((group.length - 1) * LAYER_GAP_Y) / 2,
        },
        data: {
          label: entity.name,
          entityId: entity.id,
          entityType: entity.type,
          status: entity.status,
          layer,
          color: ENTITY_COLORS[entity.type],
          accent: ENTITY_ACCENT[entity.type],
          selected: entity.id === selectedId,
        },
      });
    });
  }
  return nodes;
}

export function relationsToEdges(
  relations: ArchitectureRelation[],
  visibleIds: Set<string>,
): Edge[] {
  return relations
    .filter((r) => visibleIds.has(r.source) && visibleIds.has(r.target))
    .map((rel) => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      type: 'relation',
      label: rel.label ?? rel.type,
      data: { relationType: rel.type, description: rel.description },
      style: {
        stroke: RELATION_COLORS[rel.type] ?? '#475569',
        strokeWidth: 1.5,
      },
      animated: ['sends_data_to', 'receives_command_from', 'controls'].includes(rel.type),
    }));
}
