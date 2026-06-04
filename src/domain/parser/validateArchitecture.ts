import { z } from 'zod';
import { architectureSchema } from '../schema/architectureSchema';
import type { ArchitectureInput } from '../model/ArchitectureTypes';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  data?: ArchitectureInput;
  issues: ValidationIssue[];
}

/**
 * Validates a raw JSON value against the architecture schema and runs cross-reference
 * checks (entity ids referenced by relations exist, relation types exist, …).
 *
 * Errors are surfaced as ValidationIssue[] with a human-readable Portuguese message.
 */
export function validateArchitecture(raw: unknown): ValidationResult {
  // 1) Schema parse
  const parsed = architectureSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map(formatZodIssue),
    };
  }

  const data = parsed.data as ArchitectureInput;

  // 2) Cross-reference checks
  const issues: ValidationIssue[] = [];
  const entityIds = new Set(data.entities.map((e) => e.id));
  const categoryIds = new Set(data.categories.map((c) => c.id));
  const relationTypeIds = new Set(data.relationTypes.map((r) => r.id));
  const relationTypeIndices = new Map<number, string>();

  for (const c of data.relationTypes) {
    const existing = relationTypeIndices.get(c.index);
    if (existing) {
      issues.push({
        path: `relationTypes/${c.id}`,
        message: `O número (index) ${c.index} está duplicado entre "${existing}" e "${c.id}". Cada tipo de relação precisa de um número único.`,
      });
    }
    relationTypeIndices.set(c.index, c.id);
  }

  // entity.category must exist
  for (const e of data.entities) {
    if (!categoryIds.has(e.category)) {
      issues.push({
        path: `entities/${e.id}/category`,
        message: `Entidade "${e.id}" usa categoria "${e.category}" que não está definida em "categories".`,
      });
    }
    if (e.parentId && !entityIds.has(e.parentId)) {
      issues.push({
        path: `entities/${e.id}/parentId`,
        message: `Entidade "${e.id}" referencia parent "${e.parentId}" que não existe em "entities".`,
      });
    }
  }

  // relation.source/target must exist; relation.type must exist
  for (const r of data.relations) {
    if (!entityIds.has(r.source)) {
      issues.push({
        path: `relations/${r.id}/source`,
        message: `Relação "${r.id}" referencia source "${r.source}", mas não existe entidade com esse id.`,
      });
    }
    if (!entityIds.has(r.target)) {
      issues.push({
        path: `relations/${r.id}/target`,
        message: `Relação "${r.id}" referencia target "${r.target}", mas não existe entidade com esse id.`,
      });
    }
    if (!relationTypeIds.has(r.type)) {
      issues.push({
        path: `relations/${r.id}/type`,
        message: `Relação "${r.id}" usa o tipo "${r.type}" que não está definido em "relationTypes".`,
      });
    }
  }

  // Duplicate ids check (entities / relations / relationTypes / categories)
  duplicateIds(data.entities, 'entities', issues);
  duplicateIds(data.relations, 'relations', issues);
  duplicateIds(data.relationTypes, 'relationTypes', issues);
  duplicateIds(data.categories, 'categories', issues);

  // verifications.requirementId must exist
  for (const v of data.verifications ?? []) {
    if (!entityIds.has(v.requirementId)) {
      issues.push({
        path: `verifications/${v.id}/requirementId`,
        message: `Verificação "${v.id}" referencia requirementId "${v.requirementId}", que não existe em "entities".`,
      });
    }
  }

  // budgets.items.entityId must exist
  for (const b of data.budgets ?? []) {
    for (const item of b.items) {
      if (!entityIds.has(item.entityId)) {
        issues.push({
          path: `budgets/${b.id}/items`,
          message: `Budget "${b.id}" referencia entidade "${item.entityId}" que não existe.`,
        });
      }
    }
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, data, issues: [] };
}

function duplicateIds(arr: { id: string }[], path: string, out: ValidationIssue[]): void {
  const seen = new Set<string>();
  for (const item of arr) {
    if (seen.has(item.id)) {
      out.push({
        path: `${path}/${item.id}`,
        message: `O id "${item.id}" aparece mais de uma vez em "${path}". Cada id precisa ser único.`,
      });
    }
    seen.add(item.id);
  }
}

function formatZodIssue(issue: z.ZodIssue): ValidationIssue {
  const path = issue.path.join('/') || '(raiz)';
  return { path, message: humanizeZodMessage(issue) };
}

function humanizeZodMessage(issue: z.ZodIssue): string {
  switch (issue.code) {
    case 'invalid_type':
      return `Tipo inválido em "${issue.path.join('/')}": esperado ${issue.expected}, recebido ${issue.received}.`;
    case 'too_small':
      return `Valor muito pequeno em "${issue.path.join('/')}": ${issue.message}.`;
    case 'too_big':
      return `Valor muito grande em "${issue.path.join('/')}": ${issue.message}.`;
    case 'invalid_string':
      return `String inválida em "${issue.path.join('/')}": ${issue.message}.`;
    case 'invalid_enum_value':
      return `Valor não aceito em "${issue.path.join('/')}": ${issue.message}.`;
    default:
      return issue.message;
  }
}
