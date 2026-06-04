import { useMemo } from 'react';
import type {
  ArchitectureEntity,
  ArchitectureRelation,
  NormalizedArchitecture,
} from '../../domain/model/ArchitectureTypes';

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 86;
const COL_GAP = 60;
const ROW_GAP = 150;

/**
 * Layered top-to-bottom layout: each category is a horizontal row.
 *
 * Within a row, entities are ordered by:
 *  1. parentId's X position (so children appear below/around the parent),
 *  2. id alphabetic order, for stable layout.
 *
 * If an entity already has `position2D`, that wins.
 */
export interface LayoutPosition {
  x: number;
  y: number;
  row: number;
  col: number;
}

export interface FlowLayoutResult {
  positions: Map<string, LayoutPosition>;
  rows: Array<{ id: string; label: string; color: string; y: number; height: number }>;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

/**
 * Compute layered positions. The order of categories in the architecture
 * defines the row order — that is also intentional: it lets the JSON author
 * influence layout.
 */
export function computeFlowLayout(
  architecture: NormalizedArchitecture,
  visibleEntities: ArchitectureEntity[],
): FlowLayoutResult {
  const positions = new Map<string, LayoutPosition>();
  const rowsOut: FlowLayoutResult['rows'] = [];

  const categoryOrder = architecture.categories.map((c) => c.id);

  // Group entities by category
  const byCategory = new Map<string, ArchitectureEntity[]>();
  for (const e of visibleEntities) {
    const list = byCategory.get(e.category) ?? [];
    list.push(e);
    byCategory.set(e.category, list);
  }

  // Build parentId lookup for stable column placement
  const parentX = new Map<string, number>();

  let rowIndex = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (const catId of categoryOrder) {
    const list = byCategory.get(catId);
    if (!list || list.length === 0) continue;

    const cat = architecture.categoriesById[catId];

    // Sort: by parent X if any, else alphabetical
    const sorted = [...list].sort((a, b) => {
      const pa = a.parentId ? parentX.get(a.parentId) ?? Infinity : Infinity;
      const pb = b.parentId ? parentX.get(b.parentId) ?? Infinity : Infinity;
      if (pa !== pb) return pa - pb;
      return a.id.localeCompare(b.id);
    });

    const n = sorted.length;
    const step = NODE_WIDTH + COL_GAP;
    const totalW = n * step - COL_GAP;
    const rowY = rowIndex * (NODE_HEIGHT + ROW_GAP);

    sorted.forEach((entity, i) => {
      let x: number, y: number;
      if (entity.position2D) {
        x = entity.position2D.x;
        y = entity.position2D.y;
      } else {
        x = i * step - totalW / 2;
        y = rowY;
      }
      positions.set(entity.id, { x, y, row: rowIndex, col: i });
      parentX.set(entity.id, x);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + NODE_WIDTH);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + NODE_HEIGHT);
    });

    rowsOut.push({
      id: catId,
      label: cat?.label ?? catId,
      color: cat?.color ?? '#94a3b8',
      y: rowY - 30,
      height: NODE_HEIGHT + 60,
    });

    rowIndex += 1;
  }

  if (!isFinite(minX)) {
    minX = 0; maxX = 0; minY = 0; maxY = 0;
  }

  return { positions, rows: rowsOut, bounds: { minX, maxX, minY, maxY } };
}

export function useFlowLayout(
  architecture: NormalizedArchitecture | null,
  visibleEntities: ArchitectureEntity[],
  _relations: ArchitectureRelation[],
): FlowLayoutResult {
  return useMemo(
    () => {
      if (!architecture) return { positions: new Map(), rows: [], bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 } };
      return computeFlowLayout(architecture, visibleEntities);
    },
    [architecture, visibleEntities],
  );
}
