export type ViewMode = '2d' | '3d';

export interface BaseElement {
  id: string;
  type: string;
  name: string;
  description: string;
  status?: string;
  tags?: string[];
}

export interface Mission extends BaseElement {
  type: 'mission';
  objectiveIds: string[];
}

export interface Objective extends BaseElement {
  type: 'objective';
  missionId: string;
  requirementIds: string[];
}

export interface Requirement extends BaseElement {
  type: 'requirement';
  objectiveId: string;
  functionIds: string[];
}

export interface FunctionItem extends BaseElement {
  type: 'function';
  requirementIds: string[];
  systemIds: string[];
}

export interface SystemSegment extends BaseElement {
  type: 'system';
  functionIds: string[];
  componentIds: string[];
}

export interface Component extends BaseElement {
  type: 'component';
  systemId: string;
  interfaceIds: string[];
}

export interface InterfaceDefinition extends BaseElement {
  type: 'interface';
  sourceId: string;
  targetId: string;
}

export interface Budget extends BaseElement {
  type: 'budget';
  relatedIds: string[];
  allocated: string;
  consumed: string;
}

export interface Risk extends BaseElement {
  type: 'risk';
  relatedIds: string[];
  probability: string;
  impact: string;
  mitigation: string;
}

export interface Verification extends BaseElement {
  type: 'verification';
  requirementId: string;
  itemId: string;
  method: string;
  evidence: string;
  status: string;
}

export interface TraceLink {
  id: string;
  from: string;
  to: string;
  description: string;
}

export interface SystemModel {
  mission: Mission;
  objectives: Objective[];
  requirements: Requirement[];
  functions: FunctionItem[];
  systems: SystemSegment[];
  components: Component[];
  interfaces: InterfaceDefinition[];
  budgets: Budget[];
  risks: Risk[];
  verifications: Verification[];
  traceLinks: TraceLink[];
}

export type ElementNode =
  | Mission
  | Objective
  | Requirement
  | FunctionItem
  | SystemSegment
  | Component
  | InterfaceDefinition;
