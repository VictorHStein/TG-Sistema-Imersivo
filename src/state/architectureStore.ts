import { create } from 'zustand';
import type { NormalizedArchitecture } from '../domain/model/ArchitectureTypes';
import { normalizeArchitecture } from '../domain/parser/normalizeArchitecture';
import { validateArchitecture, type ValidationIssue } from '../domain/parser/validateArchitecture';
import demoJson from '../data/demoArchitecture.json';

export type ViewMode = '2d' | '3d' | 'split';
export type ExplorationMode = 'all' | 'step' | 'focus';
export type SidePanelTab = 'details' | 'budgets' | 'verifications' | 'risks' | 'overview';

interface ArchitectureState {
  /* ── Data ────────────────────────────────────────────────────── */
  architecture: NormalizedArchitecture | null;
  lastIssues: ValidationIssue[];
  jsonSourceName: string | null;

  /* ── Selection ──────────────────────────────────────────────── */
  selectedEntityId: string | null;
  selectedRelationId: string | null;

  /* ── Visualization mode ─────────────────────────────────────── */
  viewMode: ViewMode;
  explorationMode: ExplorationMode;
  currentStep: number;

  /* ── Filters ────────────────────────────────────────────────── */
  /** Set of relationType ids currently visible. */
  visibleRelationTypes: Set<string>;
  /** Set of category ids currently visible. */
  visibleCategories: Set<string>;
  /** When set, only the focused subsystem + its components/relations are emphasized. */
  focusedSubsystemId: string | null;
  /** When true, only cross-category relations are shown. */
  showOnlyCrossCategory: boolean;
  /** When true, only critical (criticality high|critical) relations are emphasized. */
  emphasizeOnlyCritical: boolean;

  /* ── Panel state ────────────────────────────────────────────── */
  sidePanelTab: SidePanelTab;
  legendOpen: boolean;

  /* ── Actions ────────────────────────────────────────────────── */
  loadArchitectureFromJson: (raw: unknown, sourceName?: string) => { ok: boolean; issues: ValidationIssue[] };
  resetToDemo: () => void;
  selectEntity: (id: string | null) => void;
  selectRelation: (id: string | null) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  toggleRelationType: (id: string) => void;
  setVisibleRelationTypes: (ids: string[]) => void;
  toggleCategory: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setExplorationMode: (mode: ExplorationMode) => void;
  focusSubsystem: (id: string | null) => void;
  clearFocus: () => void;
  setSidePanelTab: (tab: SidePanelTab) => void;
  setLegendOpen: (open: boolean) => void;
  toggleCrossCategoryOnly: () => void;
  toggleCriticalOnly: () => void;
}

function loadDemo() {
  const result = validateArchitecture(demoJson);
  if (!result.ok || !result.data) {
    // Should never happen — demo is hand-authored and validated.
    console.error('Demo architecture failed validation', result.issues);
    throw new Error('Demo architecture invalid');
  }
  return normalizeArchitecture(result.data);
}

const initialArchitecture = loadDemo();
const initialRelationTypeIds = new Set(initialArchitecture.relationTypes.map((r) => r.id));
const initialCategoryIds = new Set(initialArchitecture.categories.map((c) => c.id));

export const useArchitectureStore = create<ArchitectureState>((set, get) => ({
  architecture: initialArchitecture,
  lastIssues: [],
  jsonSourceName: 'demoArchitecture.json',

  selectedEntityId: null,
  selectedRelationId: null,

  viewMode: '2d',
  explorationMode: 'all',
  currentStep: initialArchitecture.views?.defaultStep ?? initialArchitecture.maxStep,

  visibleRelationTypes: initialRelationTypeIds,
  visibleCategories: initialCategoryIds,
  focusedSubsystemId: null,
  showOnlyCrossCategory: false,
  emphasizeOnlyCritical: false,

  sidePanelTab: 'overview',
  legendOpen: true,

  loadArchitectureFromJson: (raw, sourceName) => {
    const result = validateArchitecture(raw);
    if (!result.ok || !result.data) {
      set({ lastIssues: result.issues });
      return { ok: false, issues: result.issues };
    }
    const normalized = normalizeArchitecture(result.data);
    set({
      architecture: normalized,
      lastIssues: [],
      jsonSourceName: sourceName ?? null,
      selectedEntityId: null,
      selectedRelationId: null,
      visibleRelationTypes: new Set(normalized.relationTypes.map((r) => r.id)),
      visibleCategories: new Set(normalized.categories.map((c) => c.id)),
      currentStep: normalized.views?.defaultStep ?? normalized.maxStep,
      explorationMode: 'all',
      focusedSubsystemId: null,
      showOnlyCrossCategory: false,
      emphasizeOnlyCritical: false,
    });
    return { ok: true, issues: [] };
  },

  resetToDemo: () => {
    const normalized = loadDemo();
    set({
      architecture: normalized,
      lastIssues: [],
      jsonSourceName: 'demoArchitecture.json',
      selectedEntityId: null,
      selectedRelationId: null,
      visibleRelationTypes: new Set(normalized.relationTypes.map((r) => r.id)),
      visibleCategories: new Set(normalized.categories.map((c) => c.id)),
      currentStep: normalized.views?.defaultStep ?? normalized.maxStep,
      explorationMode: 'all',
      focusedSubsystemId: null,
      showOnlyCrossCategory: false,
      emphasizeOnlyCritical: false,
    });
  },

  selectEntity: (id) => set({ selectedEntityId: id, selectedRelationId: null, sidePanelTab: id ? 'details' : 'overview' }),
  selectRelation: (id) => set({ selectedRelationId: id, selectedEntityId: null, sidePanelTab: id ? 'details' : 'overview' }),

  setStep: (step) => {
    const arch = get().architecture;
    if (!arch) return;
    const clamped = Math.max(1, Math.min(step, arch.maxStep));
    set({ currentStep: clamped });
  },
  nextStep: () => {
    const { currentStep, architecture } = get();
    if (!architecture) return;
    set({ currentStep: Math.min(currentStep + 1, architecture.maxStep) });
  },
  previousStep: () => {
    const { currentStep } = get();
    set({ currentStep: Math.max(currentStep - 1, 1) });
  },

  toggleRelationType: (id) =>
    set((s) => {
      const next = new Set(s.visibleRelationTypes);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { visibleRelationTypes: next };
    }),

  setVisibleRelationTypes: (ids) => set({ visibleRelationTypes: new Set(ids) }),

  toggleCategory: (id) =>
    set((s) => {
      const next = new Set(s.visibleCategories);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { visibleCategories: next };
    }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setExplorationMode: (mode) => set({ explorationMode: mode }),
  focusSubsystem: (id) => set({ focusedSubsystemId: id }),
  clearFocus: () => set({ focusedSubsystemId: null }),
  setSidePanelTab: (tab) => set({ sidePanelTab: tab }),
  setLegendOpen: (open) => set({ legendOpen: open }),
  toggleCrossCategoryOnly: () => set((s) => ({ showOnlyCrossCategory: !s.showOnlyCrossCategory })),
  toggleCriticalOnly: () => set((s) => ({ emphasizeOnlyCritical: !s.emphasizeOnlyCritical })),
}));

/* ── Selectors ────────────────────────────────────────────────── */

export const selectVisibleEntities = (state: ArchitectureState) => {
  const a = state.architecture;
  if (!a) return [];
  return a.entities.filter((e) => {
    if (!state.visibleCategories.has(e.category)) return false;
    if (state.explorationMode === 'step' && e.step > state.currentStep) return false;
    return true;
  });
};

export const selectVisibleRelations = (state: ArchitectureState) => {
  const a = state.architecture;
  if (!a) return [];
  const visibleEntityIds = new Set(selectVisibleEntities(state).map((e) => e.id));
  return a.relations.filter((r) => {
    if (!state.visibleRelationTypes.has(r.type)) return false;
    if (state.explorationMode === 'step' && r.step > state.currentStep) return false;
    if (!visibleEntityIds.has(r.source) || !visibleEntityIds.has(r.target)) return false;
    if (state.showOnlyCrossCategory) {
      const s = a.entitiesById[r.source];
      const t = a.entitiesById[r.target];
      if (!s || !t || s.category === t.category) return false;
    }
    return true;
  });
};

export const selectSelectedEntity = (state: ArchitectureState) => {
  const a = state.architecture;
  if (!a || !state.selectedEntityId) return null;
  return a.entitiesById[state.selectedEntityId] ?? null;
};

export const selectSelectedRelation = (state: ArchitectureState) => {
  const a = state.architecture;
  if (!a || !state.selectedRelationId) return null;
  return a.relations.find((r) => r.id === state.selectedRelationId) ?? null;
};
