export type EntityType =
  | 'mission' | 'objective' | 'requirement' | 'function'
  | 'system' | 'segment' | 'subsystem' | 'component'
  | 'interface' | 'budget' | 'risk' | 'verification'
  | 'test' | 'operation' | 'model';

export type RelationType =
  | 'contains' | 'satisfies' | 'allocated_to' | 'verifies'
  | 'depends_on' | 'provides_power_to' | 'sends_data_to'
  | 'receives_command_from' | 'mechanically_attached_to'
  | 'thermally_coupled_to' | 'controls' | 'measures'
  | 'actuates' | 'communicates_with' | 'constrains'
  | 'mitigates' | 'uses' | 'validates';

export type VerificationMethod =
  | 'Test' | 'Analysis' | 'Inspection' | 'Review of Design' | 'Demonstration';

export type EntityStatus =
  | 'draft' | 'planned' | 'in_progress' | 'validated'
  | 'verified' | 'passed' | 'failed' | 'open' | 'waived';

export interface BudgetEntry {
  kind: 'mass' | 'power' | 'data' | 'thermal' | 'cost' | 'volume';
  allocated: number;
  estimated: number;
  unit: string;
  margin?: number;
}

export interface RiskEntry {
  id: string;
  title: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigation: string;
  status: 'open' | 'mitigated' | 'accepted' | 'closed';
}

export interface VerificationEntry {
  id: string;
  requirementId: string;
  itemId: string;
  method: VerificationMethod;
  status: EntityStatus;
  evidence?: string;
  description?: string;
}

export interface ArchitectureEntity {
  id: string;
  name: string;
  type: EntityType;
  parentId?: string;
  description: string;
  status?: EntityStatus;
  layer?: number;
  budgets?: BudgetEntry[];
  metadata?: Record<string, string | number | boolean>;
}

export interface ArchitectureRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label?: string;
  description?: string;
  layer?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface ArchitectureModel {
  id: string;
  name: string;
  version: string;
  description: string;
  missionId: string;
  entities: ArchitectureEntity[];
  relations: ArchitectureRelation[];
  risks?: RiskEntry[];
  verifications?: VerificationEntry[];
}

// ── Derived helpers ─────────────────────────────────────────
export const ENTITY_LAYERS: Record<EntityType, number> = {
  mission: 0, objective: 1, requirement: 2, function: 3,
  system: 4, segment: 4, subsystem: 5, component: 6,
  interface: 7, budget: 8, risk: 9, verification: 10,
  test: 10, operation: 3, model: 5,
};

export const RELATION_COLORS: Record<RelationType, string> = {
  contains:               '#475569',
  satisfies:              '#22d3ee',
  allocated_to:           '#a78bfa',
  verifies:               '#4ade80',
  depends_on:             '#64748b',
  provides_power_to:      '#facc15',
  sends_data_to:          '#38bdf8',
  receives_command_from:  '#818cf8',
  mechanically_attached_to: '#94a3b8',
  thermally_coupled_to:   '#fb923c',
  controls:               '#86efac',
  measures:               '#7dd3fc',
  actuates:               '#bbf7d0',
  communicates_with:      '#67e8f9',
  constrains:             '#f87171',
  mitigates:              '#34d399',
  uses:                   '#c4b5fd',
  validates:              '#f0f9ff',
};

export const ENTITY_COLORS: Record<EntityType, string> = {
  mission:     '#0b3d91',
  objective:   '#0e7490',
  requirement: '#92400e',
  function:    '#4c1d95',
  system:      '#065f46',
  segment:     '#064e3b',
  subsystem:   '#1e3a5f',
  component:   '#1e293b',
  interface:   '#7c2d12',
  budget:      '#14532d',
  risk:        '#7f1d1d',
  verification:'#1a2e05',
  test:        '#172554',
  operation:   '#1e3a8a',
  model:       '#3b0764',
};

export const ENTITY_ACCENT: Record<EntityType, string> = {
  mission:     '#38bdf8',
  objective:   '#22d3ee',
  requirement: '#facc15',
  function:    '#a78bfa',
  system:      '#4ade80',
  segment:     '#34d399',
  subsystem:   '#60a5fa',
  component:   '#94a3b8',
  interface:   '#fb923c',
  budget:      '#86efac',
  risk:        '#f87171',
  verification:'#4ade80',
  test:        '#93c5fd',
  operation:   '#818cf8',
  model:       '#c4b5fd',
};
