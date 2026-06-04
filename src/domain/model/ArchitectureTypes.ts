/**
 * Unified architecture model — single source of truth for 2D, 3D, panels and timeline.
 *
 * The JSON the user provides is validated by Zod (see schema/architectureSchema.ts) and
 * normalized into the `NormalizedArchitecture` shape below. All visualizations and panels
 * consume that normalized shape.
 */

export type LineStyle = 'solid' | 'dashed' | 'dotted';

export type Shape2D =
  | 'hexagon' | 'document' | 'rounded' | 'group' | 'box' | 'check' | 'diamond';

export type Shape3D =
  | 'sphere' | 'flatPanel' | 'capsule' | 'box' | 'smallBox' | 'diamond' | 'bar';

export type VerificationMethod =
  | 'Test' | 'Analysis' | 'Inspection' | 'Review of Design' | 'Demonstration';

export type VerificationStatus =
  | 'planned' | 'in_progress' | 'passed' | 'failed' | 'verified' | 'waived';

export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed';
export type Criticality = 'low' | 'medium' | 'high' | 'critical';

/** Visual + semantic descriptor for a kind of entity (mission, requirement, subsystem, …). */
export interface CategoryDef {
  id: string;
  label: string;
  color: string;
  shape2D?: Shape2D;
  shape3D?: Shape3D;
  description?: string;
}

/** Visual + semantic descriptor for a kind of relation (provides_power_to, satisfies, …). */
export interface RelationTypeDef {
  id: string;
  /** Sequential number — appears as the badge on edges and tubes. */
  index: number;
  label: string;
  color: string;
  lineStyle: LineStyle;
  directed: boolean;
  description: string;
}

export interface BudgetEntry {
  kind: string;
  allocated: number;
  estimated: number;
  unit: string;
  margin?: number;
}

export interface ArchitectureEntity {
  id: string;
  name: string;
  /** Must reference an existing CategoryDef.id. */
  category: string;
  description: string;
  /** Optional hierarchy parent (for `contains`-like grouping in the same JSON). */
  parentId?: string;
  /** Optional subsystem grouping (used by 3D layout to cluster components). */
  subsystem?: string;
  /** Step in which this entity first appears (1..maxStep). */
  step: number;
  /** Optional explicit 2D position (otherwise computed by useFlowLayout). */
  position2D?: { x: number; y: number };
  /** Optional explicit 3D position (otherwise computed by use3DLayout). */
  position3D?: { x: number; y: number; z: number };
  budgets?: BudgetEntry[];
  status?: VerificationStatus;
  metadata?: Record<string, string | number | boolean>;
}

export interface ArchitectureRelation {
  id: string;
  /** Must reference an existing RelationTypeDef.id. */
  type: string;
  /** Must reference an existing ArchitectureEntity.id. */
  source: string;
  /** Must reference an existing ArchitectureEntity.id. */
  target: string;
  label?: string;
  description?: string;
  /** Step in which this relation first appears. */
  step: number;
  criticality?: Criticality;
  metadata?: Record<string, string | number | boolean>;
}

export interface RiskEntry {
  id: string;
  title: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigation: string;
  status: RiskStatus;
}

export interface VerificationEntry {
  id: string;
  requirementId: string;
  method: VerificationMethod;
  level?: string;
  status: VerificationStatus;
  description?: string;
  evidence?: string;
}

export interface BudgetSummary {
  id: string;
  label: string;
  unit: string;
  items: { entityId: string; value: number }[];
}

export interface ArchitectureMetadata {
  projectName: string;
  version: string;
  description?: string;
}

export interface MissionSummary {
  id: string;
  name: string;
  objectives?: string[];
}

export interface ViewSettings {
  defaultStep: number;
  maxStep: number;
  layout2D?: 'layered' | 'radial' | 'manual';
  layout3D?: 'radial-fan' | 'cluster' | 'manual';
}

/** Raw architecture as it appears in the JSON file (after Zod parsing). */
export interface ArchitectureInput {
  metadata: ArchitectureMetadata;
  mission?: MissionSummary;
  categories: CategoryDef[];
  relationTypes: RelationTypeDef[];
  entities: ArchitectureEntity[];
  relations: ArchitectureRelation[];
  budgets?: BudgetSummary[];
  verifications?: VerificationEntry[];
  risks?: RiskEntry[];
  views?: ViewSettings;
}

/** Architecture after normalization — entity/relation lookups + step bounds. */
export interface NormalizedArchitecture extends ArchitectureInput {
  entitiesById: Record<string, ArchitectureEntity>;
  relationTypesById: Record<string, RelationTypeDef>;
  categoriesById: Record<string, CategoryDef>;
  maxStep: number;
  /** Convenience: relations indexed by entity id (both directions). */
  relationsByEntity: Record<string, { incoming: ArchitectureRelation[]; outgoing: ArchitectureRelation[] }>;
}
