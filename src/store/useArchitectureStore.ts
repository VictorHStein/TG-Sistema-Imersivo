import { create } from 'zustand';
import type { ArchitectureModel, ArchitectureEntity, RelationType, EntityType } from '../types/architecture';
import { demoArchitecture } from '../data/demoArchitecture';

export type ViewMode = 'ALL' | 'POWER' | 'DATA' | 'COMMAND' | 'THERMAL' | 'STRUCTURAL' | 'VERIFICATION';
export type PanelTab = 'details' | 'relations' | 'budget' | 'verification' | 'risk' | 'traceability';

const RELATION_VIEW_MAP: Record<ViewMode, RelationType[]> = {
  ALL: [],
  POWER: ['provides_power_to', 'allocated_to'],
  DATA: ['sends_data_to', 'communicates_with', 'uses'],
  COMMAND: ['receives_command_from', 'controls', 'actuates'],
  THERMAL: ['thermally_coupled_to'],
  STRUCTURAL: ['mechanically_attached_to', 'contains'],
  VERIFICATION: ['verifies', 'validates', 'constrains'],
};

interface ArchitectureState {
  model: ArchitectureModel;
  selectedId: string | null;
  activeLayer: number;
  viewMode: ViewMode;
  activePanel: PanelTab;
  highlightedRelationTypes: RelationType[];
  visibleEntityTypes: EntityType[];
  sidebarOpen: boolean;

  // actions
  setSelectedId: (id: string | null) => void;
  setActiveLayer: (layer: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setActivePanel: (tab: PanelTab) => void;
  toggleSidebar: () => void;
  setVisibleEntityTypes: (types: EntityType[]) => void;
  getSelectedEntity: () => ArchitectureEntity | null;
  getVisibleEntities: () => ArchitectureEntity[];
  getActiveRelationTypes: () => RelationType[];
}

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
  model: demoArchitecture,
  selectedId: 'MSN-001',
  activeLayer: 6,
  viewMode: 'ALL',
  activePanel: 'details',
  highlightedRelationTypes: [],
  visibleEntityTypes: [
    'mission', 'objective', 'requirement', 'function',
    'system', 'segment', 'subsystem', 'component',
    'interface', 'budget', 'risk', 'verification',
    'test', 'operation', 'model',
  ],
  sidebarOpen: true,

  setSelectedId: (id) => set({ selectedId: id }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setViewMode: (mode) => {
    set({ viewMode: mode, highlightedRelationTypes: RELATION_VIEW_MAP[mode] });
  },
  setActivePanel: (tab) => set({ activePanel: tab }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setVisibleEntityTypes: (types) => set({ visibleEntityTypes: types }),

  getSelectedEntity: () => {
    const { model, selectedId } = get();
    return model.entities.find((e) => e.id === selectedId) ?? null;
  },

  getVisibleEntities: () => {
    const { model, activeLayer, visibleEntityTypes } = get();
    return model.entities.filter(
      (e) => (e.layer ?? 0) <= activeLayer && visibleEntityTypes.includes(e.type),
    );
  },

  getActiveRelationTypes: () => {
    const { viewMode } = get();
    return RELATION_VIEW_MAP[viewMode];
  },
}));
