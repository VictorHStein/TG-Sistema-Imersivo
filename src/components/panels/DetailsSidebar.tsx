import type {
  ElementNode,
  SystemModel,
  Mission,
  Objective,
  Requirement,
  FunctionItem,
  SystemSegment,
  Component,
  InterfaceDefinition
} from '../../types';

interface DetailsSidebarProps {
  node: ElementNode;
  model: SystemModel;
  onSelectNode: (id: string) => void;
}

interface RelGroup {
  label: string;
  direction: 'up' | 'down';
  items: { id: string; name: string }[];
}

function getRelatedGroups(node: ElementNode, model: SystemModel): RelGroup[] {
  const groups: RelGroup[] = [];

  switch (node.type) {
    case 'mission': {
      groups.push({
        label: 'Objetivos',
        direction: 'down',
        items: model.objectives.filter((o) => (node as Mission).objectiveIds.includes(o.id))
      });
      break;
    }
    case 'objective': {
      const obj = node as Objective;
      groups.push({
        label: 'Missão',
        direction: 'up',
        items: model.mission.id === obj.missionId ? [model.mission] : []
      });
      groups.push({
        label: 'Requisitos',
        direction: 'down',
        items: model.requirements.filter((r) => r.objectiveId === obj.id)
      });
      break;
    }
    case 'requirement': {
      const req = node as Requirement;
      const parentObj = model.objectives.find((o) => o.id === req.objectiveId);
      if (parentObj) groups.push({ label: 'Objetivo', direction: 'up', items: [parentObj] });
      groups.push({
        label: 'Funções',
        direction: 'down',
        items: model.functions.filter((f) => f.requirementIds.includes(req.id))
      });
      break;
    }
    case 'function': {
      const fun = node as FunctionItem;
      const parentReqs = model.requirements.filter((r) => r.functionIds.includes(fun.id));
      if (parentReqs.length) groups.push({ label: 'Requisitos', direction: 'up', items: parentReqs });
      groups.push({
        label: 'Sistemas',
        direction: 'down',
        items: model.systems.filter((s) => s.functionIds.includes(fun.id))
      });
      break;
    }
    case 'system': {
      const sys = node as SystemSegment;
      const parentFuns = model.functions.filter((f) => f.systemIds.includes(sys.id));
      if (parentFuns.length) groups.push({ label: 'Funções', direction: 'up', items: parentFuns });
      groups.push({
        label: 'Componentes',
        direction: 'down',
        items: model.components.filter((c) => c.systemId === sys.id)
      });
      break;
    }
    case 'component': {
      const cmp = node as Component;
      const parentSys = model.systems.find((s) => s.id === cmp.systemId);
      if (parentSys) groups.push({ label: 'Sistema', direction: 'up', items: [parentSys] });
      groups.push({
        label: 'Interfaces',
        direction: 'down',
        items: model.interfaces.filter(
          (i) => i.sourceId === cmp.id || i.targetId === cmp.id
        )
      });
      break;
    }
    case 'interface': {
      const iface = node as InterfaceDefinition;
      const src = model.components.find((c) => c.id === iface.sourceId);
      const tgt = model.components.find((c) => c.id === iface.targetId);
      const items = [src, tgt].filter(Boolean) as { id: string; name: string }[];
      if (items.length) groups.push({ label: 'Componentes', direction: 'up', items });
      break;
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

const typeLabels: Record<string, string> = {
  mission:     'MISSÃO',
  objective:   'OBJETIVO',
  requirement: 'REQUISITO',
  function:    'FUNÇÃO',
  system:      'SISTEMA',
  component:   'COMPONENTE',
  interface:   'INTERFACE',
};

export function DetailsSidebar({ node, model, onSelectNode }: DetailsSidebarProps) {
  const groups = getRelatedGroups(node, model);
  const traceLinks = model.traceLinks.filter(
    (l) => l.from === node.id || l.to === node.id
  );

  return (
    <div className="details-sidebar">
      <div className="details-header">
        <div className="details-badge" data-type={node.type}>
          {typeLabels[node.type] ?? node.type.toUpperCase()}
        </div>
        <h2>{node.name}</h2>
        <code className="details-id">{node.id}</code>
      </div>

      <div className="details-section">
        <div className="details-section-label">Descrição</div>
        <p>{node.description}</p>
      </div>

      {groups.length > 0 && (
        <div className="details-section">
          <div className="details-section-label">Relações</div>
          {groups.map((group) => (
            <div key={group.label} className="details-rel-group">
              <div className="details-rel-label">
                {group.direction === 'up' ? '↑' : '↓'} {group.label}
              </div>
              <ul className="details-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      className="details-link"
                      onClick={() => onSelectNode(item.id)}
                    >
                      <span>{item.name}</span>
                      <span className="details-link-id">{item.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {traceLinks.length > 0 && (
        <div className="details-section">
          <div className="details-section-label">Rastreabilidade</div>
          <ul className="details-list">
            {traceLinks.map((link) => (
              <li key={link.id}>
                <div className="trace-chain">
                  <div style={{ fontSize: '0.76rem', color: '#7080a0', marginBottom: 4 }}>
                    {link.description}
                  </div>
                  <code style={{ color: '#6a9aff' }}>{link.from}</code>
                  {' → '}
                  <code style={{ color: '#6a9aff' }}>{link.to}</code>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
