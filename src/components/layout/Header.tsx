import type { ElementNode, SystemModel } from '../../types';

interface HeaderProps {
  model: SystemModel;
  selectedNode: ElementNode;
}

export function Header({ model, selectedNode }: HeaderProps) {
  return (
    <header className="panel-card" style={{ margin: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.55rem' }}>
            Sistema Imersivo de Modelagem Espacial
          </h1>
          <p className="summary-text" style={{ marginTop: '10px', maxWidth: '760px' }}>
            Visualize a cadeia de engenharia de sistemas para uma missão de observação da Terra em órbita baixa. Esse MVP demonstra missão, objetivos, requisitos, funções, sistemas, subsistemas, componentes, interfaces, budgets, riscos e verificação.
          </p>
        </div>
        <div className="header-meta">
          <div>
            <strong>Missão</strong>
            <p>{model.mission.name}</p>
          </div>
          <div>
            <strong>Elemento selecionado</strong>
            <p>{selectedNode.name}</p>
          </div>
          <div>
            <strong>Status de modelo</strong>
            <p>Estrutura validada</p>
          </div>
        </div>
      </div>
    </header>
  );
}
