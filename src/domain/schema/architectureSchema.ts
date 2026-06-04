import { z } from 'zod';

/* ── Atoms ───────────────────────────────────────────────── */
const positiveInt = z.number().int().nonnegative();
const id = z.string().min(1, 'id obrigatório').regex(/^[A-Za-z0-9_\-]+$/, 'id pode usar apenas letras, números, "_" e "-"');
const color = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'cor inválida (use hex #rgb ou #rrggbb)');

/* ── Categories ──────────────────────────────────────────── */
export const categoryDefSchema = z.object({
  id,
  label: z.string().min(1),
  color,
  shape2D: z
    .enum(['hexagon', 'document', 'rounded', 'group', 'box', 'check', 'diamond'])
    .optional(),
  shape3D: z
    .enum(['sphere', 'flatPanel', 'capsule', 'box', 'smallBox', 'diamond', 'bar'])
    .optional(),
  description: z.string().optional(),
});

/* ── Relation types ──────────────────────────────────────── */
export const relationTypeDefSchema = z.object({
  id,
  index: positiveInt,
  label: z.string().min(1),
  color,
  lineStyle: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
  directed: z.boolean().default(true),
  description: z.string().min(1),
});

/* ── Budgets per-entity ──────────────────────────────────── */
export const budgetEntrySchema = z.object({
  kind: z.string().min(1),
  allocated: z.number(),
  estimated: z.number(),
  unit: z.string().min(1),
  margin: z.number().optional(),
});

/* ── Entities ────────────────────────────────────────────── */
export const entitySchema = z.object({
  id,
  name: z.string().min(1),
  category: id,
  description: z.string().default(''),
  parentId: id.optional(),
  subsystem: z.string().optional(),
  step: positiveInt,
  position2D: z.object({ x: z.number(), y: z.number() }).optional(),
  position3D: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
  budgets: z.array(budgetEntrySchema).optional(),
  status: z
    .enum(['planned', 'in_progress', 'passed', 'failed', 'verified', 'waived'])
    .optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

/* ── Relations ───────────────────────────────────────────── */
export const relationSchema = z.object({
  id,
  type: id,
  source: id,
  target: id,
  label: z.string().optional(),
  description: z.string().optional(),
  step: positiveInt,
  criticality: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

/* ── Budgets summaries ───────────────────────────────────── */
export const budgetSummarySchema = z.object({
  id,
  label: z.string().min(1),
  unit: z.string().min(1),
  items: z.array(
    z.object({
      entityId: id,
      value: z.number(),
    }),
  ),
});

/* ── Verifications ───────────────────────────────────────── */
export const verificationEntrySchema = z.object({
  id,
  requirementId: id,
  method: z.enum(['Test', 'Analysis', 'Inspection', 'Review of Design', 'Demonstration']),
  level: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'passed', 'failed', 'verified', 'waived']),
  description: z.string().optional(),
  evidence: z.string().optional(),
});

/* ── Risks ───────────────────────────────────────────────── */
export const riskEntrySchema = z.object({
  id,
  title: z.string().min(1),
  probability: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  mitigation: z.string(),
  status: z.enum(['open', 'mitigated', 'accepted', 'closed']),
});

/* ── Mission + Metadata + Views ──────────────────────────── */
export const metadataSchema = z.object({
  projectName: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
});

export const missionSchema = z.object({
  id,
  name: z.string().min(1),
  objectives: z.array(z.string()).optional(),
});

export const viewSettingsSchema = z.object({
  defaultStep: positiveInt.default(1),
  maxStep: positiveInt.default(10),
  layout2D: z.enum(['layered', 'radial', 'manual']).optional(),
  layout3D: z.enum(['radial-fan', 'cluster', 'manual']).optional(),
});

/* ── Top-level architecture ──────────────────────────────── */
export const architectureSchema = z.object({
  metadata: metadataSchema,
  mission: missionSchema.optional(),
  categories: z.array(categoryDefSchema).min(1, 'É necessário pelo menos uma categoria'),
  relationTypes: z.array(relationTypeDefSchema).min(1, 'É necessário pelo menos um tipo de relação'),
  entities: z.array(entitySchema).min(1, 'É necessário pelo menos uma entidade'),
  relations: z.array(relationSchema),
  budgets: z.array(budgetSummarySchema).optional(),
  verifications: z.array(verificationEntrySchema).optional(),
  risks: z.array(riskEntrySchema).optional(),
  views: viewSettingsSchema.optional(),
});

export type ArchitectureInputZ = z.infer<typeof architectureSchema>;
