# TG — Prompt Completo Visual NASA-Like para Claude Code

**Projeto:** Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual  
**Autor:** Victor Stein — Engenharia Aeroespacial — ITA  
**Objetivo deste Markdown:** servir como prompt completo para o Claude Code implementar um MVP visualmente forte, técnico, rastreável e apresentável para banca.  
**Versão:** v3 — foco em visualização profissional 2D/3D, rastreabilidade total de relações, clareza de projeto, estética espacial e engenharia de sistemas.

---

# 0. Como usar este arquivo

1. Abra o VS Code na pasta do projeto:

```txt
TG-Sistema-Imersivo
```

2. Abra o Claude Code.

3. Cole este Markdown inteiro como prompt.

4. Peça para o Claude Code implementar de forma incremental.

5. Autorize apenas comandos coerentes com o projeto, por exemplo:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install @xyflow/react three @react-three/fiber @react-three/drei zod zustand lucide-react
npm run build
npm run dev
```

6. O Claude Code deve sempre executar:

```bash
npm run build
```

7. O projeto só pode ser considerado pronto quando o build passar sem erros e a aplicação tiver aparência profissional.

---

# 1. Prompt principal

Você é o Claude Code atuando como:

- engenheiro de software sênior;
- desenvolvedor React + TypeScript;
- especialista em visualização técnica;
- especialista em UX/UI para dashboards de engenharia;
- engenheiro de sistemas aeroespaciais;
- arquiteto de MVP para Trabalho de Graduação em Engenharia Aeroespacial.

Você está dentro da pasta:

```txt
TG-Sistema-Imersivo
```

Implemente um MVP completo, funcional, robusto, visualmente profissional e apresentável para o Trabalho de Graduação em Engenharia Aeroespacial no ITA.

Atenção: este MVP será apresentado para banca. Portanto, além de funcionar, ele deve causar forte impressão visual. A interface deve ter aparência de software aeroespacial profissional, inspirado em mission control, sistemas NASA-like, painéis MBSE, visualização orbital e engenharia de sistemas espaciais.

Não entregue uma aplicação genérica.

A aplicação deve parecer:

```txt
NASA mission control + MBSE visual + dashboard de arquitetura espacial + visualizador 3D conceitual de satélite
```

---

# 2. Contexto acadêmico do TG

## 2.1 Título

**Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual**

## 2.2 Descrição

O trabalho propõe desenvolver um ambiente interativo para modelar, visualizar e explorar arquiteturas de sistemas espaciais em 2D e 3D.

A arquitetura espacial deve ser descrita por um arquivo JSON e visualizada como uma rede de entidades, relações, funções, requisitos, interfaces, budgets, riscos e verificações.

O objetivo do MVP não é simular física orbital real, atitude real, térmica real ou CFD/FEA.

O objetivo é provar que uma arquitetura espacial pode ser compreendida de forma mais clara por meio de uma representação visual, interativa, progressiva e rastreável.

## 2.3 Ideia central

A aplicação deve demonstrar que um sistema espacial não é uma lista de peças.

Ele é uma rede integrada de:

- missão;
- objetivos;
- requisitos;
- funções;
- sistema;
- segmentos;
- subsistemas;
- componentes;
- interfaces;
- budgets;
- riscos;
- verificações;
- validações;
- operações.

## 2.4 Cadeia obrigatória de Engenharia de Sistemas

Toda a aplicação deve deixar clara esta cadeia:

```txt
Missão
→ Objetivos
→ Requisitos
→ Funções
→ Sistema
→ Segmentos
→ Subsistemas
→ Componentes
→ Interfaces
→ Budgets
→ Riscos
→ Verificação
→ Validação
```

Essa cadeia deve aparecer em:

- modelo de dados;
- JSON demo;
- visualização 2D;
- visualização 3D;
- construção progressiva;
- painel de detalhes;
- painel de rastreabilidade;
- painel de budgets;
- painel de riscos;
- painel de verificação.

---

# 3. Princípios técnicos do projeto

## 3.1 Engenharia de Sistemas

Representar Engenharia de Sistemas como o processo de transformar uma necessidade de missão em uma solução técnica verificável.

O MVP deve mostrar, de forma visual:

1. a missão;
2. os objetivos;
3. os requisitos;
4. as funções;
5. a arquitetura lógica e física;
6. a alocação de funções para subsistemas e componentes;
7. as interfaces;
8. os budgets;
9. os riscos;
10. a verificação;
11. a validação.

## 3.2 Verificação e validação

Usar a distinção:

```txt
Verificação: confirmar que o sistema atende aos requisitos especificados.
Validação: confirmar que o sistema atende à necessidade real da missão/usuário.
```

Métodos de verificação obrigatórios:

- Test;
- Analysis;
- Inspection;
- Review of Design;
- Demonstration.

A aplicação deve mostrar esses métodos como badges ou colunas na matriz de verificação.

## 3.3 AIT/AIV

Representar AIT/AIV como:

```txt
Assembly
Integration
Test
Verification
```

No MVP, isso deve aparecer como:

- entidade `Verification`;
- entidade `Test`;
- painel de verificação;
- status de verificação por requisito;
- rastreabilidade entre requisito, item verificado e método.

## 3.4 Product Assurance e riscos

Representar Product Assurance de forma conceitual por meio de:

- riscos técnicos;
- severidade;
- probabilidade;
- mitigação;
- status;
- relação com componente, requisito ou subsistema;
- impacto em budget, missão ou verificação.

Não implementar PA completo. Apenas mostrar que a arquitetura pode conectar risco e verificação.

---

# 4. Escopo do MVP

## 4.1 O MVP deve implementar

1. projeto Vite + React + TypeScript;
2. leitura de um JSON demo local;
3. validação do JSON com Zod;
4. estado global com Zustand;
5. visualização 2D com React Flow;
6. visualização 3D com React Three Fiber;
7. construção progressiva por camadas;
8. seleção de entidades;
9. seleção de relações/arestas;
10. painel lateral de detalhes;
11. painel inferior de rastreabilidade;
12. explorador visual de relações;
13. filtros por tipo de relação;
14. matriz/tabela de relações;
15. destaque de caminho ponta a ponta;
16. painel de budgets;
17. painel de verificação;
18. painel de riscos;
19. visual NASA-like / mission control;
20. dados demo suficientemente ricos;
21. build passando.

O foco do MVP não é apenas mostrar objetos. O foco é mostrar **como cada elemento da arquitetura se conecta, por que se conecta e como essa conexão se rastreia** dentro da cadeia de Engenharia de Sistemas.

## 4.2 Fora do escopo inicial

Não implementar:

- backend;
- banco de dados;
- login;
- autenticação;
- edição colaborativa;
- VR completo;
- AR;
- simulação orbital real;
- propagação orbital;
- dinâmica de atitude real;
- modelo térmico físico;
- FEA;
- CFD;
- integração com hardware real;
- otimização numérica pesada.

Esses itens podem aparecer apenas como trabalhos futuros.

---

# 5. Stack obrigatória

Usar:

```txt
Vite
React
TypeScript
@xyflow/react
three
@react-three/fiber
@react-three/drei
zod
zustand
lucide-react
CSS puro organizado em arquivos
```

Não usar backend.

Não usar bibliotecas pesadas de UI.

Não depender de internet em runtime.

Assets externos, se usados, devem ser baixados para `src/assets/`.

---

# 6. Instalação esperada

Se o projeto estiver vazio, criar:

```bash
npm create vite@latest . -- --template react-ts
```

Instalar:

```bash
npm install
npm install @xyflow/react three @react-three/fiber @react-three/drei zod zustand lucide-react
```

Rodar build:

```bash
npm run build
```

Corrigir todos os erros.

---

# 7. Estrutura de arquivos obrigatória

Criar uma estrutura clara:

```txt
src/
  main.tsx
  App.tsx
  index.css

  assets/
    README_ASSETS.md
    images/
    models/

  data/
    demoArchitecture.json

  types/
    architecture.ts

  schema/
    architectureSchema.ts

  store/
    useArchitectureStore.ts

  utils/
    graphMapping.ts
    traceability.ts
    relationUtils.ts
    graphAnalysis.ts
    budgetUtils.ts
    verificationUtils.ts
    riskUtils.ts
    layout2d.ts
    sceneMapping3d.ts
    format.ts

  styles/
    visualTokens.css
    missionControl.css
    flow.css
    panels.css
    scene3d.css
    animations.css

  components/
    app/
      AppShell.tsx
      MissionHeader.tsx
      TelemetryBar.tsx
      ViewTabs.tsx
      LayerControls.tsx

    common/
      StatusBadge.tsx
      MetricCard.tsx
      SectionTitle.tsx
      Legend.tsx
      EmptyState.tsx
      Chip.tsx

    flow/
      ArchitectureFlow.tsx
      CustomNode.tsx
      CustomEdge.tsx
      FlowLegend.tsx
      LayerBand.tsx

    scene3d/
      ArchitectureScene3D.tsx
      SpaceEnvironment.tsx
      EarthBackdrop.tsx
      OrbitGrid.tsx
      SpacecraftAssembly.tsx
      ComponentMesh.tsx
      InterfaceLine3D.tsx
      GroundStation3D.tsx
      EntityLabel3D.tsx
      SelectionHalo.tsx

    panels/
      DetailsPanel.tsx
      TraceabilityPanel.tsx
      BudgetPanel.tsx
      VerificationPanel.tsx
      RiskPanel.tsx
      JsonValidationPanel.tsx
```

Se algum arquivo ficar pequeno, tudo bem. A prioridade é organização e clareza.

---

# 8. Modelo de dados TypeScript

Criar `src/types/architecture.ts`.

Usar tipos como:

```ts
export type EntityType =
  | "mission"
  | "objective"
  | "requirement"
  | "function"
  | "system"
  | "segment"
  | "subsystem"
  | "component"
  | "interface"
  | "budget"
  | "risk"
  | "verification"
  | "test"
  | "operation"
  | "model";

export type RelationType =
  | "contains"
  | "satisfies"
  | "allocated_to"
  | "verifies"
  | "depends_on"
  | "provides_power_to"
  | "sends_data_to"
  | "receives_command_from"
  | "mechanically_attached_to"
  | "thermally_coupled_to"
  | "controls"
  | "measures"
  | "actuates"
  | "communicates_with"
  | "constrains"
  | "mitigates"
  | "uses"
  | "validates";

export type VerificationMethod =
  | "Test"
  | "Analysis"
  | "Inspection"
  | "Review of Design"
  | "Demonstration";

export type EntityStatus =
  | "draft"
  | "planned"
  | "in_progress"
  | "validated"
  | "verified"
  | "passed"
  | "failed"
  | "open"
  | "waived";

export interface Position2D {
  x: number;
  y: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface BudgetEntry {
  kind: "mass" | "power" | "data" | "thermal" | "cost" | "volume";
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
  status: "open" | "mitigated" | "accepted" | "closed";
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
  requirements?: string[];
  functions?: string[];
  interfaces?: string[];
  verificationMethods?: VerificationMethod[];
  budgets?: BudgetEntry[];
  risks?: string[];
  status?: EntityStatus;
  modelType?: string;
  layer?: number;
  position2D?: Position2D;
  position3D?: Position3D;
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
  budgets?: BudgetEntry[];
  risks?: RiskEntry[];
  verifications?: VerificationEntry[];
  metadata?: Record<string, string | number | boolean>;
}
```

---

# 9. Schema Zod

Criar `src/schema/architectureSchema.ts`.

Validar:

- campos obrigatórios;
- IDs não vazios;
- tipos permitidos;
- relações com source e target;
- toda relação deve apontar para IDs existentes;
- toda relação deve ter `type` permitido;
- detectar relações órfãs;
- detectar entidades sem nenhuma relação, exceto se explicitamente marcado como isolado;
- permitir múltiplas relações entre os mesmos nós, desde que tenham tipos diferentes ou IDs diferentes;
- budgets numéricos;
- riscos com probabilidade e impacto entre 1 e 5;
- verificações com método válido.

O app deve mostrar:

```txt
JSON VALIDADO
```

ou

```txt
JSON INVÁLIDO
```

No caso de erro, mostrar painel com mensagens claras.

---

# 10. JSON demo obrigatório

Criar `src/data/demoArchitecture.json`.

O JSON deve representar uma missão de observação da Terra com satélite pequeno.

## 10.1 Missão

Exemplo:

```txt
Earth Observation Small Satellite Demo Mission
```

Objetivo de missão:

```txt
Demonstrar uma arquitetura conceitual de satélite de observação da Terra, conectando missão, requisitos, funções, subsistemas, componentes, interfaces, budgets, riscos e verificação.
```

## 10.2 Entidades mínimas

O JSON deve conter pelo menos:

```txt
1 missão
3 objetivos
10 requisitos
10 funções
1 sistema espacial
3 segmentos
8 subsistemas
18 componentes
10 interfaces
5 budgets
8 verificações
6 riscos
4 operações
```

## 10.3 Segmentos obrigatórios

Incluir:

- Space Segment;
- Ground Segment;
- Launch Segment.

## 10.4 Subsistemas obrigatórios

Incluir:

- Payload;
- Structure;
- EPS;
- OBC / C&DH;
- TT&C;
- ADCS;
- Thermal Control;
- Propulsion, mesmo que opcional ou not installed;
- Onboard Software;
- Ground Station;
- Mission Operations.

## 10.5 Componentes obrigatórios

Incluir pelo menos:

```txt
Optical Payload
Primary Structure
Solar Array
Battery Pack
PCDU
On-Board Computer
Mass Memory
S-Band Transceiver
Antenna
Reaction Wheel Assembly
Magnetorquer
Sun Sensor
Star Tracker
IMU
Thermal Radiator
Heater
Software FDIR Module
Ground Station Antenna
Mission Control Console
```

## 10.6 Requisitos obrigatórios

Criar requisitos como:

```txt
REQ-MSN-001: Mission shall acquire Earth observation imagery.
REQ-PAY-001: Payload shall provide imaging capability.
REQ-PWR-001: EPS shall provide positive power balance.
REQ-DAT-001: OBC shall store payload data before downlink.
REQ-TTC-001: TT&C shall provide command and telemetry link.
REQ-ADCS-001: ADCS shall provide pointing support for imaging.
REQ-THR-001: Thermal subsystem shall maintain components within operating range.
REQ-STR-001: Structure shall support components during launch loads.
REQ-SAF-001: System shall provide basic fault detection and recovery.
REQ-VER-001: Critical requirements shall have mapped verification method.
```

## 10.7 Funções obrigatórias

Criar funções como:

```txt
Capture Image
Generate Power
Store Energy
Distribute Power
Process Commands
Store Payload Data
Downlink Telemetry
Receive Commands
Estimate Attitude
Control Attitude
Maintain Thermal Range
Support Launch Loads
Detect Fault
Execute Safe Mode
Plan Ground Contact
```

## 10.8 Relações obrigatórias

O JSON deve conter relações suficientes para demonstrar que a arquitetura é uma **rede rastreável**, não uma lista de peças.

Cada relação deve ter:

```txt
id
source
target
type
label
description
layer
metadata opcional
```

O JSON deve conter relações que mostrem, no mínimo:

```txt
Mission contains objectives
Objectives derive requirements
Requirements are satisfied by functions
Functions are allocated to subsystems/components
System contains segments
Segments contain subsystems
Subsystems contain components
Components send data
Components receive commands
EPS provides power
Battery stores/provides power through EPS
PCDU distributes power to OBC, TT&C, Payload, ADCS and Thermal
OBC receives commands from TT&C
OBC sends commands to payload/ADCS
Payload sends data to OBC/Mass Memory
Mass Memory sends data to TT&C for downlink
TT&C communicates with ground station
Ground Station communicates with Mission Operations
ADCS controls pointing
Sensors measure attitude
Actuators actuate attitude control
Thermal subsystem thermally couples radiator/heater/components
Structure mechanically attaches components
Risks constrain requirements/components/interfaces
Mitigations mitigate risks
Verification verifies requirements
Tests produce evidence for verification
Operations use ground and space segment functions
Budgets constrain subsystems/components
```

Quantidade mínima de relações no JSON demo:

```txt
contains: pelo menos 25
satisfies: pelo menos 10
allocated_to: pelo menos 10
verifies: pelo menos 8
provides_power_to: pelo menos 8
sends_data_to: pelo menos 8
receives_command_from: pelo menos 5
communicates_with: pelo menos 4
mechanically_attached_to: pelo menos 6
thermally_coupled_to: pelo menos 4
controls: pelo menos 3
measures: pelo menos 3
actuates: pelo menos 2
constrains: pelo menos 5
mitigates: pelo menos 3
depends_on: pelo menos 5
uses: pelo menos 4
validates: pelo menos 3
```

O app deve conseguir mostrar visualmente **todas** essas relações, seja no grafo 2D, na cena 3D, no painel de relações ou na matriz de relações.

Nenhuma relação do JSON deve ficar invisível ou “perdida”.

## 10.9 Posições 2D e 3D

Adicionar `position2D` e `position3D` em entidades principais.

Se faltar posição, o app deve gerar layout automático.

---

# 11. Estado global com Zustand

Criar `src/store/useArchitectureStore.ts`.

Estado mínimo:

```ts
interface ArchitectureState {
  architecture: ArchitectureModel | null;
  validationErrors: string[];
  selectedEntityId: string | null;
  hoveredEntityId: string | null;
  activeView: "2d" | "3d";
  activeLayer: number;
  selectedRelationId: string | null;
  hoveredRelationId: string | null;
  showOnlyRelated: boolean;
  activeRelationTypes: RelationType[];
  relationViewMode:
    | "all"
    | "traceability"
    | "interfaces"
    | "power"
    | "data"
    | "command"
    | "mechanical"
    | "thermal"
    | "verification"
    | "risk";

  setArchitecture: (architecture: ArchitectureModel) => void;
  setValidationErrors: (errors: string[]) => void;
  selectEntity: (id: string | null) => void;
  selectRelation: (id: string | null) => void;
  hoverEntity: (id: string | null) => void;
  hoverRelation: (id: string | null) => void;
  setActiveView: (view: "2d" | "3d") => void;
  setActiveLayer: (layer: number) => void;
  setShowOnlyRelated: (value: boolean) => void;
  setActiveRelationTypes: (types: RelationType[]) => void;
  setRelationViewMode: (mode: ArchitectureState["relationViewMode"]) => void;
}
```

---

# 12. Construção progressiva

A aplicação deve permitir mostrar a arquitetura por camadas.

Camadas sugeridas:

```txt
0 — Missão
1 — Objetivos
2 — Requisitos
3 — Funções
4 — Sistema e segmentos
5 — Subsistemas
6 — Componentes
7 — Interfaces
8 — Budgets
9 — Riscos
10 — Verificação e validação
```

O usuário deve conseguir:

- avançar camada;
- voltar camada;
- mostrar tudo;
- ver qual camada está ativa;
- ver contagem de entidades visíveis;
- ver contagem de relações visíveis.

A construção progressiva deve ser visual e animada.

---

# 13. Direção visual obrigatória

A aplicação deve ter visual de sistema aeroespacial profissional.

O visual deve parecer:

```txt
mission control
painel orbital
dashboard MBSE
sala de controle
visualizador de arquitetura espacial
```

Não deve parecer:

```txt
template genérico
dashboard corporativo comum
site de landing page
brinquedo visual
grafo sem estilo
cena 3D com cubos soltos
```

## 13.1 Paleta visual

Usar tema escuro espacial:

```txt
fundo quase preto/azul profundo
ciano para informação orbital
azul NASA-like para hierarquia
vermelho/laranja para risco
amarelo para potência
verde para verificação positiva
violeta para funções/sistemas lógicos
cinza técnico para estruturas
```

## 13.2 Design tokens

Criar `src/styles/visualTokens.css`:

```css
:root {
  --space-980: #01040a;
  --space-950: #020617;
  --space-900: #06101f;
  --space-850: #081827;
  --space-800: #0b1f33;

  --panel-glass: rgba(8, 24, 39, 0.82);
  --panel-solid: #0b1f33;
  --panel-raised: #102a43;

  --nasa-blue: #0b3d91;
  --mission-cyan: #38bdf8;
  --orbit-cyan: #22d3ee;
  --vector-red: #fc3d21;
  --solar-gold: #facc15;
  --safe-green: #4ade80;
  --warning-orange: #fb923c;
  --danger-red: #f87171;
  --violet-system: #a78bfa;

  --text-main: #e5edf7;
  --text-muted: #9fb0c3;
  --text-dim: #64748b;

  --border-soft: rgba(148, 163, 184, 0.22);
  --border-strong: rgba(56, 189, 248, 0.45);

  --shadow-panel: 0 18px 60px rgba(0, 0, 0, 0.45);
  --shadow-glow-cyan: 0 0 28px rgba(34, 211, 238, 0.28);
  --shadow-glow-blue: 0 0 36px rgba(11, 61, 145, 0.45);

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;

  --font-ui: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;
}
```

## 13.3 Fundo

Criar fundo com:

- gradiente radial escuro;
- starfield sutil;
- grid técnico em baixa opacidade;
- linhas orbitais discretas;
- brilho ciano sutil no canto ou centro;
- textura visual sem atrapalhar leitura.

Não exagerar em neon.

O resultado deve parecer engenharia, não videogame arcade.

---

# 14. Layout Mission Control

Criar `AppShell`.

Layout obrigatório:

```txt
┌─────────────────────────────────────────────────────────────┐
│ Header: nome do TG, missão, status, view, camada             │
├─────────────────────────────────────────────────────────────┤
│ TelemetryBar: mass, power, data, risks, verification         │
├───────────────────────┬─────────────────────────────────────┤
│                       │ DetailsPanel                         │
│  2D Flow ou 3D Scene  │ entidade selecionada                 │
│                       │ interfaces, budgets, riscos          │
├───────────────────────┴─────────────────────────────────────┤
│ Painel inferior: rastreabilidade, budgets, verificação       │
└─────────────────────────────────────────────────────────────┘
```

## 14.1 Header

O header deve mostrar:

```txt
ITA Aerospace TG
Sistema Imersivo de Arquiteturas Espaciais
ARCH-EARTH-OBS-DEMO
JSON VALIDADO
2D GRAPH / 3D SCENE
CAMADA ATUAL
ENTIDADES VISÍVEIS
RELAÇÕES VISÍVEIS
```

## 14.2 TelemetryBar

Mostrar cartões pequenos:

```txt
MASS BUDGET
POWER BUDGET
DATA BUDGET
OPEN RISKS
VERIFIED REQS
TRACE CHAINS
ACTIVE LAYER
```

Valores devem ser derivados do JSON quando possível.

---

# 15. Visualização 2D com React Flow

A visualização 2D é a parte mais importante para a banca entender o projeto.

Ela deve ser clara, bonita e profissional.

## 15.1 Organização em camadas

Organizar o grafo por faixas ou colunas:

```txt
MISSÃO
OBJETIVOS
REQUISITOS
FUNÇÕES
SISTEMA / SEGMENTOS
SUBSISTEMAS
COMPONENTES
INTERFACES
BUDGETS
RISCOS
VERIFICAÇÃO
```

Cada camada deve ter:

- rótulo visual;
- fundo discreto;
- espaçamento amplo;
- alinhamento consistente;
- nós sem sobreposição;
- leitura possível sem zoom absurdo.

## 15.2 CustomNode

Criar nó customizado.

Cada nó deve mostrar:

```txt
ícone
tipo
ID curto
nome
status
badges de quantidade
```

Exemplo visual:

```txt
┌────────────────────────────┐
│ ◉ REQUIREMENT     PLANNED  │
│ REQ-PWR-001                │
│ Margem de potência         │
│ satisfies: 2 | verifies: 1 │
└────────────────────────────┘
```

## 15.3 Tipos e ícones

Usar `lucide-react`.

Mapeamento sugerido:

```txt
mission: Rocket
objective: Target
requirement: FileCheck
function: GitBranch
system: Boxes
segment: Network
subsystem: Package
component: Cpu
interface: Cable
budget: Gauge
risk: TriangleAlert
verification: ShieldCheck
test: FlaskConical
operation: RadioTower
model: Box
```

## 15.4 Cores por tipo

```txt
mission: azul profundo/ciano
objective: ciano
requirement: amarelo
function: violeta
system: verde azulado
segment: verde claro
subsystem: azul claro
component: cinza técnico
interface: laranja
budget: verde
risk: vermelho/laranja
verification: rosa/verde
operation: branco/azul
model: lilás
```

## 15.5 Arestas por tipo

Estilizar arestas por tipo:

```txt
contains: linha sólida discreta
satisfies: linha ciano
allocated_to: linha violeta
verifies: linha rosa/verde
depends_on: linha cinza tracejada
provides_power_to: linha amarela
sends_data_to: linha ciano tracejada
receives_command_from: linha azul tracejada
communicates_with: linha RF ciano com animação sutil
mechanically_attached_to: linha cinza sólida
thermally_coupled_to: linha laranja
controls: linha verde
measures: linha azul clara
actuates: linha verde tracejada
constrains: linha vermelha tracejada
mitigates: linha verde tracejada
validates: linha branca/ciano
```

## 15.6 Seleção

Ao selecionar uma entidade:

- destacar nó selecionado;
- destacar vizinhos diretos;
- destacar arestas relacionadas;
- destacar cadeia de rastreabilidade;
- reduzir opacidade de entidades não relacionadas;
- atualizar DetailsPanel;
- atualizar painéis inferiores.

## 15.7 MiniMap e Controls

Configurar:

- MiniMap escuro;
- nós coloridos por tipo;
- controles com tema escuro;
- Background com grid técnico;
- FitView inicial;
- zoom confortável.

---

# 15A. Visualização estruturada de relações e rastreabilidade total

Esta seção é obrigatória.

O sistema deve ser capaz de mostrar **todas as relações da arquitetura** de forma visual, filtrável e rastreável.

A pergunta central que a interface deve responder é:

```txt
Onde cada coisa se liga?
Por que essa ligação existe?
Qual requisito/função/interface/budget/verificação justifica essa ligação?
```

## 15A.1 Princípio central

Não basta desenhar nós bonitos.

Cada relação do JSON deve aparecer como uma entidade visual ou analisável:

```txt
ArchitectureRelation → edge 2D
ArchitectureRelation → linha/arco 3D, quando aplicável
ArchitectureRelation → item no RelationshipExplorerPanel
ArchitectureRelation → célula/linha na RelationMatrixPanel
ArchitectureRelation → trecho em uma cadeia de rastreabilidade
```

Se a relação não puder aparecer no 3D por clareza, ela ainda deve aparecer no 2D e no painel/matriz.

Nenhuma relação pode ficar sem representação.

## 15A.2 Modos de visualização de relações

Criar modos de visualização para reduzir poluição visual.

Modos obrigatórios:

```txt
ALL RELATIONS
TRACEABILITY CHAIN
INTERFACE NETWORK
POWER NETWORK
DATA NETWORK
COMMAND NETWORK
MECHANICAL NETWORK
THERMAL NETWORK
CONTROL NETWORK
VERIFICATION NETWORK
RISK NETWORK
```

Cada modo deve filtrar arestas sem destruir a posição dos nós.

Exemplo:

```txt
POWER NETWORK
mostra provides_power_to, depends_on relacionado a EPS, budgets de power e riscos de power
```

```txt
VERIFICATION NETWORK
mostra requirement → verification → test/evidence
```

```txt
TRACEABILITY CHAIN
mostra mission → objective → requirement → function → subsystem/component → verification/validation
```

## 15A.3 Filtros por tipo de relação

Criar controles para ligar/desligar tipos de relação.

Tipos mínimos no filtro:

```txt
contains
satisfies
allocated_to
verifies
depends_on
provides_power_to
sends_data_to
receives_command_from
communicates_with
mechanically_attached_to
thermally_coupled_to
controls
measures
actuates
constrains
mitigates
uses
validates
```

O usuário deve conseguir:

- mostrar todas as relações;
- esconder todas;
- mostrar só interfaces;
- mostrar só rastreabilidade;
- mostrar só power/data/command;
- mostrar só verificação;
- mostrar só riscos;
- combinar filtros.

## 15A.4 Seleção de relação

Arestas devem ser clicáveis no 2D.

Ao clicar numa relação:

```txt
1. selecionar a relação;
2. destacar source;
3. destacar target;
4. destacar a aresta;
5. abrir detalhes da relação;
6. mostrar tipo, label, descrição e metadados;
7. mostrar em qual cadeia de rastreabilidade ela participa;
8. mostrar relações vizinhas.
```

Se for difícil clicar em aresta fina, criar fallback no `RelationshipExplorerPanel`.

## 15A.5 Relation Details

O painel lateral deve mostrar detalhes tanto de entidade quanto de relação.

Para relação selecionada, mostrar:

```txt
RELATION ID
TYPE
SOURCE ENTITY
TARGET ENTITY
LABEL
DESCRIPTION
LAYER
TRACEABILITY CONTEXT
RELATED REQUIREMENTS
RELATED FUNCTIONS
RELATED INTERFACES
RELATED BUDGETS
RELATED RISKS
RELATED VERIFICATIONS
```

Exemplo:

```txt
REL-PWR-004
provides_power_to
PCDU → On-Board Computer
A PCDU fornece barramento regulado ao OBC.
Relacionada a: REQ-PWR-001, FUNC-DISTRIBUTE-POWER, BUD-PWR-001, VER-PWR-001
```

## 15A.6 RelationshipExplorerPanel

Criar `RelationshipExplorerPanel`.

Ele deve ser um painel navegável de relações.

Mostrar agrupamento por:

```txt
tipo de relação
source entity
target entity
camada
subsistema
cadeia de rastreabilidade
```

Cada item deve mostrar:

```txt
tipo
source → target
label
status/contexto
```

Ao clicar no item:

- selecionar relação;
- centralizar no grafo 2D, se possível;
- destacar source e target;
- atualizar painel lateral.

## 15A.7 RelationMatrixPanel / matriz N² simplificada

Criar `RelationMatrixPanel`.

Ela deve mostrar uma matriz simplificada estilo N²/DSM para deixar claro onde há conexões.

Não precisa ser uma matriz industrial completa. Deve ser simples e visual.

Formato mínimo aceitável:

```txt
linhas: source entities
colunas: target entities
células: tipo(s) de relação
```

Exemplo conceitual:

```txt
              OBC      TT&C     Payload   Battery   Ground Station
OBC           —        data     command   —         —
TT&C          command  —        —         —         RF
Payload       data     —        —         —         —
Battery       power    —        —         —         —
Ground        —        RF       —         —         —
```

A matriz deve permitir:

- filtrar por tipo de relação;
- destacar linha/coluna da entidade selecionada;
- clicar em uma célula para selecionar relação;
- mostrar contagem de relações visíveis.

Se a matriz completa ficar grande, mostrar apenas entidades visíveis na camada atual ou relacionadas à seleção.

## 15A.8 Caminhos de rastreabilidade

Criar funções utilitárias em `src/utils/traceability.ts` e/ou `src/utils/graphAnalysis.ts` para calcular caminhos.

Caminhos obrigatórios:

```txt
mission → objective → requirement
requirement → function
function → subsystem/component
component → interface
requirement → verification
risk → requirement/component/interface
budget → subsystem/component
operation → function/system
```

O sistema deve conseguir responder visualmente:

```txt
Qual componente implementa este requisito?
Qual requisito justifica este componente?
Qual verificação fecha este requisito?
Qual risco afeta esta interface?
Qual budget limita este subsistema?
Qual função depende deste componente?
Quais componentes recebem energia da EPS?
Quais componentes trocam dados com o OBC?
Como o segmento solo se liga ao segmento espacial?
```

## 15A.9 Destaque de vizinhança e caminho completo

Ao selecionar entidade ou relação:

```txt
selected entity/relation: 100% opacidade + brilho
vizinhos diretos: 85% opacidade
arestas do caminho rastreável: 100% opacidade + brilho
demais elementos: 15% a 30% opacidade
```

Deve haver botão:

```txt
SHOW TRACE PATH
```

Esse botão deve destacar a cadeia completa relacionada ao item selecionado.

## 15A.10 Métricas de conectividade

Mostrar em algum painel técnico:

```txt
Total entities
Total relations
Visible relations
Selected relation type count
Orphan entities
Requirements without verification
Requirements without allocated function
Functions without allocated component
Components without interface
Components without budget
Risks without mitigation
```

Essas métricas são importantes para dar cara de ferramenta de engenharia, não apenas visualizador.

## 15A.11 Regras de qualidade para relações

O app deve sinalizar visualmente:

```txt
requisito sem verificação
requisito sem função alocada
função sem componente
componente sem interface
componente crítico sem budget
risco sem mitigação
relação órfã
entidade isolada
```

Usar badges e alertas discretos, não popups invasivos.

## 15A.12 Integração com camadas

A construção progressiva deve mostrar relações junto com os nós.

Exemplo:

```txt
Camada 0: missão
Camada 1: missão → objetivos
Camada 2: objetivos → requisitos
Camada 3: requisitos → funções
Camada 4: funções → sistema/segmentos
Camada 5: segmentos → subsistemas
Camada 6: subsistemas → componentes
Camada 7: interfaces físicas/lógicas
Camada 8: budgets restringindo componentes/subsistemas
Camada 9: riscos afetando arquitetura
Camada 10: verificações fechando requisitos
```

Ao avançar camada, as novas relações devem aparecer animadas.

## 15A.13 Representação 3D das relações

No 3D, representar principalmente relações espaciais e interfaces:

```txt
provides_power_to: linhas amarelas
sends_data_to: linhas ciano
receives_command_from: linhas azuis
communicates_with: arco RF ciano
mechanically_attached_to: linhas/frames cinza
thermally_coupled_to: linhas laranja
controls: linhas verdes
measures: linhas azul claro
constrains: linhas vermelhas
verifies: linhas rosa ou painel overlay
```

O 3D pode mostrar menos relações simultâneas para evitar poluição, mas o usuário deve conseguir alternar modos:

```txt
3D POWER
3D DATA
3D COMMAND
3D RF
3D THERMAL
3D MECHANICAL
3D CONTROL
```

## 15A.14 Regra final

A banca deve conseguir apontar para qualquer nó e perguntar:

```txt
Isso vem de onde?
Isso se liga a quê?
Isso satisfaz qual requisito?
Isso implementa qual função?
Isso é verificado como?
Isso consome ou fornece qual recurso?
Isso tem qual risco?
```

A aplicação deve responder visualmente.


# 16. Visualização 3D com React Three Fiber

A visualização 3D deve ser conceitual, bonita e compreensível.

Não deve ser apenas um monte de cubos.

Ela deve mostrar uma maquete sistêmica de arquitetura espacial.

## 16.1 Cena base

Criar cena com:

```txt
fundo espacial
estrelas
Terra simplificada
órbita conceitual
satélite composto
estação solo
linhas RF
linhas internas de interface
labels
seleção visual
```

Usar:

```tsx
<Canvas>
  <ambientLight />
  <directionalLight />
  <OrbitControls />
  <Stars />
</Canvas>
```

## 16.2 Satélite procedural composto

Criar `SpacecraftAssembly`.

O satélite deve conter:

```txt
bus central
payload/câmera frontal
painéis solares laterais
antena TT&C
OBC
bateria
PCDU
mass memory
reaction wheels
magnetorquers
sun sensor
star tracker
IMU
radiador
heater
estrutura primária
módulo de software representado como bloco/holograma
```

Formas sugeridas:

```txt
bus: caixa central metálica
payload: cilindro + lente escura
solar arrays: planos retangulares azulados com linhas de células
antena: prato simples, cone ou paraboloide aproximado
OBC: caixa com brilho azul
bateria: bloco escuro com marcação de energia
PCDU: bloco ligado ao EPS
reaction wheel: cilindro/torus
magnetorquer: haste fina
sensor solar: pequeno cilindro externo
star tracker: pequeno tubo apontado para fora
radiador: placa clara externa
heater: elemento laranja pequeno
estrutura: frames/longarinas simples
software: cubo translúcido/holográfico
```

## 16.3 Terra e órbita

Criar `EarthBackdrop`.

A Terra deve ser:

- esfera grande ao fundo ou abaixo;
- azul/verde escura;
- atmosfera translúcida;
- anel orbital discreto;
- sem simulação física real.

## 16.4 Estação solo

Criar `GroundStation3D`.

Deve conter:

```txt
base
antena parabólica
label Ground Segment
cone ou linha de comunicação
ligação com TT&C
```

## 16.5 Linhas 3D

Criar `InterfaceLine3D`.

Cores:

```txt
power: amarelo
data: ciano
command: azul
RF: ciano com arco
mechanical: cinza
thermal: laranja
control: verde
risk: vermelho
verification: rosa/verde
```

As linhas devem ser discretas, mas visíveis.

## 16.6 Seleção 3D

Ao clicar em componente 3D:

- selecionar entidade no Zustand;
- atualizar DetailsPanel;
- aplicar halo/glow no componente;
- destacar linhas conectadas;
- mostrar label com nome, tipo e ID;
- reduzir opacidade de objetos não relacionados, se simples.

---

# 17. Painel de detalhes

Criar `DetailsPanel`.

Quando nada estiver selecionado, mostrar orientação:

```txt
Selecione uma entidade no grafo 2D ou na cena 3D para inspecionar sua rastreabilidade, interfaces, budgets, riscos e verificações.
```

Quando houver seleção, mostrar:

```txt
IDENTIFICAÇÃO
DESCRIÇÃO
TIPO
STATUS
PARENT
REQUISITOS
FUNÇÕES
INTERFACES
BUDGETS
RISCOS
VERIFICAÇÕES
METADATA
```

Usar:

- badges;
- chips clicáveis;
- fonte monoespaçada para IDs;
- agrupamento por cards;
- ícones;
- cores por status.

---

# 18. Painel de rastreabilidade e relações

Criar `TraceabilityPanel`, `RelationshipExplorerPanel` e `RelationMatrixPanel`.

Esses painéis são obrigatórios porque o TG precisa mostrar claramente **onde cada coisa se liga e como se rastreia**.

## 18.1 TraceabilityPanel

Mostrar cadeias como:

```txt
MISSION → OBJECTIVE → REQUIREMENT → FUNCTION → COMPONENT → VERIFICATION
```

Cada cadeia deve ser visualmente clara.

Exemplo:

```txt
MSN-001
→ OBJ-IMG-001
→ REQ-PAY-001
→ FUNC-CAPTURE-IMAGE
→ CMP-OPTICAL-PAYLOAD
→ VER-PAY-001
```

Também mostrar cadeias alternativas:

```txt
REQUIREMENT → FUNCTION → SUBSYSTEM → COMPONENT
REQUIREMENT → VERIFICATION → TEST/EVIDENCE
COMPONENT → INTERFACE → COMPONENT
RISK → AFFECTED ITEM → MITIGATION
BUDGET → CONSTRAINED ITEM
OPERATION → FUNCTION → SYSTEM/SEGMENT
```

Se uma entidade estiver selecionada, destacar as cadeias relacionadas.

Se uma relação estiver selecionada, mostrar em quais cadeias ela aparece.

## 18.2 RelationshipExplorerPanel

Este painel deve listar relações, não entidades.

O objetivo é permitir que o usuário veja todas as conexões da arquitetura mesmo quando o grafo estiver filtrado.

Mostrar agrupamentos:

```txt
by relation type
by subsystem
by selected entity
by traceability chain
by interface network
```

Cada linha deve ter formato:

```txt
[TYPE] SOURCE → TARGET | label | layer/status
```

Exemplo:

```txt
[provides_power_to] PCDU → OBC | regulated power bus | layer 7
[sends_data_to] Payload → Mass Memory | image data stream | layer 7
[verifies] VER-PWR-001 → REQ-PWR-001 | power budget analysis | layer 10
```

Ações:

- clicar em relação;
- destacar source/target;
- centralizar no grafo 2D, se possível;
- destacar no 3D, se aplicável;
- abrir detalhes no DetailsPanel.

## 18.3 RelationMatrixPanel

Criar matriz N²/DSM simplificada.

A matriz deve mostrar rapidamente:

```txt
quem se conecta com quem
qual é o tipo da conexão
quais conexões existem por subsistema
quais conexões faltam
```

Implementação mínima aceitável:

```txt
source entity | target entity | relation type | label | layer
```

Implementação ideal:

```txt
linhas = source
colunas = target
células = relation type badges
```

A matriz deve respeitar filtros de relação e camada.

## 18.4 Análise automática de rastreabilidade

Criar utilitários para detectar lacunas:

```txt
requirementsWithoutVerification
requirementsWithoutFunction
functionsWithoutComponent
componentsWithoutInterfaces
componentsWithoutBudgets
risksWithoutMitigation
orphanEntities
orphanRelations
```

Mostrar essas lacunas como alertas técnicos.

Isso é importante para reforçar que o software ajuda a compreender e auditar uma arquitetura espacial.

---

# 19. Painel de budgets

Criar `BudgetPanel`.

Mostrar budgets como cards e barras:

```txt
Mass Budget
Allocated: 12.0 kg
Estimated: 10.5 kg
Margin: 12.5%
```

Tipos:

- mass;
- power;
- data;
- thermal;
- cost;
- volume.

Margem:

```txt
> 20%: verde
10% a 20%: amarelo
0% a 10%: laranja
< 0%: vermelho
```

Deve ficar claro que budgets são restrições de arquitetura.

---

# 20. Painel de verificação

Criar `VerificationPanel`.

Mostrar matriz:

```txt
REQ | METHOD | ITEM | STATUS | EVIDENCE
```

Métodos como badges:

```txt
TEST
ANALYSIS
INSPECTION
REVIEW OF DESIGN
DEMONSTRATION
```

Status com cor:

```txt
passed: verde
verified: verde
planned: ciano
in_progress: amarelo
failed: vermelho
waived: cinza
```

Deve haver ligação visual entre requisitos e verificações.

---

# 21. Painel de riscos

Criar `RiskPanel`.

Mostrar:

```txt
ID
Título
Probabilidade
Impacto
Score
Mitigação
Status
Entidades relacionadas
```

Score:

```txt
score = probability * impact
```

Classificação:

```txt
1-4: LOW
5-9: MEDIUM
10-15: HIGH
16-25: CRITICAL
```

Criar matriz visual simples 5x5 se possível.

Não precisa ser perfeito, mas deve parecer ferramenta de engenharia.

---

# 22. Assets e uso de imagens

## 22.1 Regra principal

Prioridade:

```txt
1. visual procedural bonito com CSS + Three.js;
2. assets locais somente se não quebrarem build;
3. nunca depender de internet em runtime;
4. sempre manter fallback visual.
```

## 22.2 Fontes visuais permitidas

Pode usar como referência:

```txt
https://images.nasa.gov/
https://science.nasa.gov/3d-resources/
https://github.com/nasa/NASA-3D-Resources
https://www.nasa.gov/nasa-brand-center/images-and-media/
```

## 22.3 Cuidados

Não usar o logotipo oficial da NASA como marca do sistema.

Não sugerir que o projeto é oficial da NASA.

Usar estética NASA-like, não identidade oficial NASA.

Se usar asset, registrar em:

```txt
src/assets/README_ASSETS.md
```

Com:

```txt
nome do arquivo
fonte
URL
uso pretendido
observação de licença
```

---

# 23. CSS e acabamento visual

## 23.1 Requisitos de CSS

O CSS deve incluir:

- reset básico;
- tema escuro;
- responsividade;
- cards;
- painéis;
- header;
- telemetria;
- flow nodes;
- flow edges;
- animações;
- scrollbars customizadas;
- estados hover/selected;
- classes de status.

## 23.2 Microanimações

Usar animações leves:

```txt
fade-in
scale-in
pulse discreto para RF
glow discreto para seleção
slide-in para painéis
```

Não usar animações exageradas.

## 23.3 Responsividade

A aplicação deve funcionar em notebook.

Meta mínima:

```txt
1366x768
1440x900
1920x1080
```

Em telas menores, painéis podem reduzir altura/largura, mas não devem quebrar.

---

# 24. UX obrigatória

A experiência deve ser muito fácil de entender.

Ao abrir a aplicação, a banca deve entender em menos de 30 segundos:

1. qual é a missão;
2. quais são os objetivos;
3. quais requisitos derivam da missão;
4. quais funções implementam requisitos;
5. quais subsistemas e componentes executam funções;
6. quais interfaces conectam os componentes;
7. quais budgets restringem a arquitetura;
8. quais riscos existem;
9. como os requisitos são verificados;
10. como a arquitetura aparece em 2D e 3D;
11. onde cada item se liga;
12. qual caminho rastreia missão → requisito → função → componente → verificação;
13. quais relações são físicas, lógicas, funcionais, de recurso, de risco ou de verificação.

A interface deve evitar que a banca precise “adivinhar” as conexões. Relações, dependências e rastreabilidade devem estar sempre acessíveis visualmente.

## 24.1 Legenda sempre visível

Criar `Legend`.

Mostrar:

- cores de tipos de entidade;
- estilos de relação;
- significado dos status;
- camada atual.

## 24.2 Onboarding curto

Na tela inicial ou painel lateral, mostrar texto curto:

```txt
Este MVP visualiza uma arquitetura espacial a partir de JSON, conectando missão, requisitos, funções, componentes, interfaces, budgets, riscos e verificações em 2D e 3D.
```

---

# 25. Performance e robustez

## 25.1 Não travar

O app deve funcionar bem com o JSON demo.

Evitar:

- loops infinitos;
- renderizações pesadas;
- objetos 3D complexos demais;
- dependência de assets grandes;
- layout que explode com muitos nós.

## 25.2 Fallbacks

Se algo falhar:

- JSON inválido: mostrar erro;
- entity sem posição 2D: gerar layout;
- entity sem posição 3D: gerar posição;
- sem budgets: mostrar vazio elegante;
- sem riscos: mostrar vazio elegante;
- sem verificações: mostrar vazio elegante;
- asset ausente: usar geometria procedural.

---

# 26. Critérios de aceite obrigatórios

O projeto só estará pronto se:

1. `npm install` funcionar;
2. `npm run build` passar;
3. app abrir em `npm run dev`;
4. JSON demo for carregado;
5. JSON demo for validado com Zod;
6. header mostrar status do JSON;
7. houver modo 2D;
8. houver modo 3D;
9. usuário puder alternar 2D/3D;
10. usuário puder selecionar entidade no 2D;
11. usuário puder selecionar componente no 3D, se possível;
12. painel lateral atualizar com seleção;
13. painel inferior mostrar rastreabilidade;
14. houver explorador visual de relações;
15. houver matriz ou tabela estruturada de relações;
16. usuário puder filtrar relações por tipo;
17. usuário puder selecionar ou inspecionar uma relação;
18. toda relação do JSON aparecer no 2D, 3D, painel de relações ou matriz;
19. grafo 2D mostrar todas as relações relevantes por camada;
20. caminho missão → requisito → função → componente → verificação for destacável;
21. relações de power/data/command/RF/mecânica/térmica/risco/verificação tiverem estilos diferentes;
22. painel de budgets mostrar barras/margens;
23. painel de verificação mostrar matriz;
24. painel de riscos mostrar score/classificação;
25. construção progressiva por camadas funcionar;
26. entidades e relações aparecerem progressivamente;
27. grafo 2D tiver nós customizados;
28. grafo 2D tiver arestas por tipo;
29. MiniMap e controles estiverem estilizados;
30. cena 3D tiver satélite composto;
31. cena 3D tiver painéis solares;
32. cena 3D tiver antena;
33. cena 3D tiver payload/câmera;
34. cena 3D tiver bus central;
35. cena 3D tiver estação solo;
36. cena 3D tiver Terra ou referência orbital;
37. cena 3D tiver linhas de interface;
38. visual geral parecer aplicação aeroespacial profissional;
39. interface for legível;
40. aplicação não parecer template genérico;
41. não houver erros no console relevantes;
42. não houver textos ilegíveis;
43. não houver painéis desalinhados;
44. não houver dependência de internet em runtime;
45. não houver relações órfãs não sinalizadas;
46. não houver requisitos sem verificação não sinalizados;
47. não houver funções sem componente não sinalizadas.

---

# 27. Proibição de solução visual pobre

Não entregar:

- fundo branco padrão;
- layout sem identidade visual;
- grafo com nó padrão do React Flow;
- 3D com apenas cubos coloridos soltos;
- painéis sem hierarquia;
- cores aleatórias;
- tabelas sem estilo;
- botões HTML padrão;
- textos cortados;
- assets quebrados;
- build quebrado;
- aplicação parecendo tutorial genérico de React.

Se houver conflito:

```txt
robustez primeiro, mas com visual procedural bonito.
```

---

# 28. Ordem de implementação obrigatória

Implementar nesta ordem:

## Etapa 1 — Base

1. criar projeto Vite;
2. instalar dependências;
3. criar estrutura de pastas;
4. criar tipos;
5. criar schema Zod;
6. criar JSON demo;
7. carregar e validar JSON;
8. passar build.

## Etapa 2 — Layout

1. criar AppShell;
2. criar MissionHeader;
3. criar TelemetryBar;
4. criar ViewTabs;
5. criar LayerControls;
6. criar CSS base;
7. passar build.

## Etapa 3 — Motor de relações e rastreabilidade

1. criar `relationUtils.ts`;
2. criar `graphAnalysis.ts`;
3. mapear todas as relações do JSON;
4. validar IDs source/target;
5. detectar entidades órfãs;
6. detectar requisitos sem verificação;
7. detectar funções sem componente;
8. criar filtros por tipo de relação;
9. criar cálculo de vizinhança;
10. criar cálculo de caminhos de rastreabilidade;
11. passar build.

## Etapa 4 — 2D

1. criar ArchitectureFlow;
2. criar CustomNode;
3. criar CustomEdge;
4. mapear JSON para nodes/edges;
5. implementar seleção de entidades;
6. implementar seleção/inspeção de relações;
7. implementar camadas;
8. implementar filtros por tipo de relação;
9. implementar destaque de caminho rastreável;
10. estilizar MiniMap;
11. passar build.

## Etapa 5 — Painéis

1. DetailsPanel;
2. TraceabilityPanel;
3. RelationshipExplorerPanel;
4. RelationMatrixPanel;
5. BudgetPanel;
6. VerificationPanel;
7. RiskPanel;
8. JsonValidationPanel;
9. passar build.

## Etapa 6 — 3D

1. criar Canvas;
2. criar SpaceEnvironment;
3. criar EarthBackdrop;
4. criar OrbitGrid;
5. criar SpacecraftAssembly;
6. criar GroundStation3D;
7. criar linhas 3D;
8. criar seleção 3D, se possível;
9. passar build.

## Etapa 7 — Polimento

1. revisar espaçamentos;
2. revisar contraste;
3. revisar legibilidade;
4. revisar animações;
5. revisar responsividade;
6. revisar aparência dos nós;
7. revisar aparência da cena 3D;
8. revisar painéis;
9. rodar build final.

---

# 29. Resultado visual esperado

A primeira impressão deve ser:

```txt
"Isso parece uma ferramenta técnica de arquitetura espacial."
```

Não:

```txt
"Isso parece um grafo simples com tema escuro."
```

O 2D deve explicar a arquitetura.

O 3D deve impressionar e dar contexto espacial.

As relações devem ser o centro da experiência. Deve ficar óbvio:

```txt
o que está conectado;
por qual tipo de relação;
qual requisito/função/interface/budget/risco/verificação justifica a conexão;
qual caminho rastreia a arquitetura ponta a ponta.
```

Os painéis devem provar a parte acadêmica:

```txt
rastreabilidade
requisitos
interfaces
budgets
verificação
riscos
AIT/AIV conceitual
```

---

# 30. Trabalhos futuros

Adicionar uma seção visual ou textual de trabalhos futuros:

```txt
VR completo
simulação orbital real
dinâmica de atitude
simulação térmica
integração com modelos CAD
backend e banco de dados
edição colaborativa
importação/exportação SysML
integração com ferramentas MBSE
AIT digital
digital twin
```

Não implementar agora.

---

# 31. Finalização esperada

Antes de finalizar, o Claude Code deve:

1. listar arquivos criados;
2. explicar como rodar;
3. confirmar que `npm run build` passou;
4. explicar principais funcionalidades;
5. indicar próximos passos;
6. mencionar limitações.

Não finalizar se o build falhar.

---

# 32. Comando final obrigatório

No final da implementação, executar:

```bash
npm run build
```

Corrigir todos os erros.

Depois executar ou instruir:

```bash
npm run dev
```

---

# 33. Comece agora

Implemente o MVP completo, seguindo este Markdown.

Prioridade absoluta:

```txt
clareza visual
rastreabilidade
2D profissional
3D espacial convincente
painéis técnicos
build funcionando
```

Não simplifique o visual para algo genérico.

O objetivo é que o projeto fique muito fácil de visualizar, explicar e defender como Trabalho de Graduação em Engenharia Aeroespacial.
