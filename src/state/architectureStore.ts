import { create } from 'zustand';
import type {
  ArchitectureEntity,
  ArchitectureRelation,
  NormalizedArchitecture,
} from '../domain/model/ArchitectureTypes';
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

/* ── Helpers ──────────────────────────────────────────────────
 *
 * These take the primitives explicitly so consumers can wrap them in `useMemo`
 * with the right dependency list. We deliberately do NOT export them as
 * Zustand selectors (`useStore(selector)`), because the selectors return new
 * arrays on every call which breaks React's `useSyncExternalStore` ref check
 * and produces an infinite render loop inside React Flow.
 */

export function computeVisibleEntities(
  architecture: NormalizedArchitecture | null,
  visibleCategories: Set<string>,
  explorationMode: ExplorationMode,
  currentStep: number,
): ArchitectureEntity[] {
  if (!architecture) return [];
  return architecture.entities.filter((e) => {
    if (!visibleCategories.has(e.category)) return false;
    if (explorationMode === 'step' && e.step > currentStep) return false;
    return true;
  });
}

export function computeVisibleRelations(
  architecture: NormalizedArchitecture | null,
  visibleEntities: ArchitectureEntity[],
  visibleRelationTypes: Set<string>,
  explorationMode: ExplorationMode,
  currentStep: number,
  showOnlyCrossCategory: boolean,
): ArchitectureRelation[] {
  if (!architecture) return [];
  const visibleIds = new Set(visibleEntities.map((e) => e.id));
  return architecture.relations.filter((r) => {
    if (!visibleRelationTypes.has(r.type)) return false;
    if (explorationMode === 'step' && r.step > currentStep) return false;
    if (!visibleIds.has(r.source) || !visibleIds.has(r.target)) return false;
    if (showOnlyCrossCategory) {
      const s = architecture.entitiesById[r.source];
      const t = architecture.entitiesById[r.target];
      if (!s || !t || s.category === t.category) return false;
    }
    return true;
  });
}

/**
 * Selectors that return the SAME object reference when nothing relevant
 * changed. Safe to use as `useArchitectureStore(selectSelectedEntity)`.
 */
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
