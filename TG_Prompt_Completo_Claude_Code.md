# TG — Prompt Completo Consolidado para Claude Code

**Projeto:** Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual  
**Uso:** copie este arquivo inteiro, ou as seções necessárias, e cole no Claude Code dentro do VS Code.  
**Objetivo:** orientar o Claude Code a implementar um MVP completo, robusto, detalhado e executável para o TG.

---

# 0. Instruções de uso para Victor

1. Abra o VS Code na pasta do projeto:

   ```txt
   TG-Sistema-Imersivo
   ```

2. Abra o Claude Code no VS Code.

3. Cole o prompt inteiro deste Markdown no campo do Claude Code.

4. Quando o Claude pedir autorização para executar comandos, aprove somente comandos coerentes com o projeto, por exemplo:

   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   npm install @xyflow/react three @react-three/fiber @react-three/drei zod zustand lucide-react
   npm run build
   npm run dev
   ```

5. Exija que o Claude Code rode:

   ```bash
   npm run build
   ```

   e corrija todos os erros antes de finalizar.

6. Ao final, rode:

   ```bash
   npm install
   npm run dev
   ```

7. Abra o endereço mostrado no terminal, normalmente:

   ```txt
   http://localhost:5173
   ```

---

# 1. PROMPT PRINCIPAL PARA COLAR NO CLAUDE CODE

Você é o Claude Code atuando como:

- engenheiro de software sênior;
- desenvolvedor React + TypeScript;
- engenheiro de sistemas aeroespaciais;
- arquiteto de MVP para Trabalho de Graduação em Engenharia Aeroespacial.

Você está dentro da pasta:

```txt
TG-Sistema-Imersivo
```

Implemente um MVP completo, funcional, robusto e apresentável para o Trabalho de Graduação em Engenharia Aeroespacial no ITA.

---

# 2. Contexto acadêmico do TG

## 2.1 Título

**Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual**

## 2.2 Descrição do trabalho

O trabalho propõe investigar e desenvolver um ambiente interativo e imersivo para a visualização e exploração de sistemas espaciais complexos.

A proposta é permitir que usuários construam, compreendam e analisem arquiteturas sistêmicas por meio da manipulação direta de entidades, estruturas, relações, funções, interfaces, budgets, riscos e verificações em uma interface visual.

O sistema deve substituir a abstração excessiva de documentos tradicionais por uma representação visual, rastreável e interativa, na qual conceitos de Engenharia de Sistemas possam ser representados e organizados visualmente.

## 2.3 Ideia central

A aplicação deve demonstrar que uma arquitetura espacial não é somente uma lista de peças.

Ela deve ser apresentada como uma rede integrada e rastreável de:

- necessidades de missão;
- objetivos;
- requisitos técnicos;
- funções;
- sistemas;
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

Toda a aplicação deve deixar clara a cadeia:

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
- construção progressiva por camadas;
- painel de detalhes;
- painel de rastreabilidade;
- painel de verificação;
- painel de budgets;
- painel de riscos.

---

# 3. Fundamentação técnica obrigatória

## 3.1 Engenharia de Sistemas

Considere que Engenharia de Sistemas é o processo de transformar uma necessidade de missão em uma solução técnica verificável, integrando requisitos, funções, arquitetura, interfaces, restrições, orçamento de recursos, riscos e verificação.

Para este MVP, represente a Engenharia de Sistemas como:

1. entender a missão;
2. identificar objetivos;
3. derivar requisitos;
4. decompor funções;
5. definir arquitetura lógica e física;
6. alocar funções a subsistemas e componentes;
7. controlar interfaces;
8. acompanhar budgets;
9. mapear riscos;
10. verificar atendimento aos requisitos;
11. validar aderência à necessidade da missão.

O MVP não deve tentar substituir ferramentas industriais completas de MBSE. Ele deve demonstrar, em escala controlada, o princípio de que arquiteturas espaciais podem ser exploradas visualmente a partir de um modelo de dados estruturado.

## 3.2 Rastreabilidade

A rastreabilidade é central para o TG.

Cada requisito deve poder ser conectado a:

- objetivo de missão;
- função;
- subsistema;
- componente;
- interface;
- budget;
- risco;
- método de verificação;
- evidência esperada.

Exemplo de cadeia:

```txt
MIS-EARTH-OBS-001
→ OBJ-IMG-001
→ REQ-IMG-001
→ FUN-CAPTURE-IMAGE
→ CMP-CAMERA
→ VER-REQ-IMG-001
```

O painel de rastreabilidade deve mostrar cadeias desse tipo.

## 3.3 Arquitetura espacial de referência

O JSON demo deve representar uma missão simples de observação da Terra em órbita baixa.

A arquitetura deve conter:

- missão;
- objetivos;
- requisitos;
- funções;
- sistema missão;
- segmento espacial;
- segmento solo;
- satélite;
- estação solo;
- payload óptico;
- bus/service module;
- estrutura;
- EPS;
- OBC/OBDH;
- TT&C;
- ADCS;
- controle térmico;
- software embarcado;
- interfaces;
- budgets;
- riscos;
- verificações;
- operações.

## 3.4 Payload e bus

O satélite deve ser representado como uma composição de:

### Payload

O payload é a razão principal da missão. No demo, será uma câmera óptica para observação da Terra.

### Bus ou service module

O bus fornece suporte ao payload, incluindo:

- potência;
- comunicação;
- processamento;
- estrutura;
- controle térmico;
- controle de atitude;
- armazenamento de dados;
- software embarcado.

Funções típicas do bus no JSON demo:

- fornecer energia;
- armazenar energia;
- distribuir energia;
- controlar atitude;
- determinar atitude;
- comunicar dados;
- receber telecomandos;
- manter integridade estrutural;
- manter temperatura;
- executar software embarcado;
- armazenar e processar dados.

## 3.5 Verificação e validação

Use a distinção:

- **Verificação:** confirma se o produto atende aos requisitos especificados.
- **Validação:** confirma se o produto atende à necessidade real da missão e ao uso pretendido.

Métodos de verificação permitidos:

- `Test`
- `Analysis`
- `Inspection`
- `Review of Design`
- `Demonstration`

A matriz de verificação deve responder:

- qual requisito está sendo verificado;
- por qual método;
- qual item está sendo verificado;
- qual evidência é esperada;
- qual é o status.

## 3.6 AIT/AIV

O MVP deve representar AIT/AIV de forma conceitual:

- Assembly;
- Integration;
- Test;
- Verification;
- Validation.

Não é necessário modelar uma campanha de testes real.

Basta mostrar entidades de verificação/teste e sua relação com requisitos e itens físicos.

## 3.7 Product Assurance e riscos

Product Assurance deve aparecer no MVP em nível conceitual via:

- riscos técnicos;
- status de verificação;
- confiabilidade conceitual;
- controle de configuração como metadado;
- evidência de verificação;
- maturidade de modelo.

Riscos mínimos no demo:

- potência insuficiente;
- perda de comunicação;
- temperatura fora da faixa;
- falha de apontamento;
- perda de dados.

## 3.8 Filosofia de modelos

O modelo de dados deve prever tipos de modelo espacial:

- `Engineering Model`
- `Qualification Model`
- `Protoflight Model`
- `Flight Model`

Não implemente fluxo industrial completo de modelos, mas inclua o campo no tipo de entidade e em alguns metadados do JSON.

---

# 4. Escopo do MVP

## 4.1 O MVP deve implementar

1. Inicializar ou ajustar um projeto Vite + React + TypeScript.
2. Carregar automaticamente um JSON demo.
3. Validar o JSON com Zod.
4. Mostrar status de validação.
5. Mostrar número de entidades.
6. Mostrar número de relações.
7. Transformar o JSON em grafo 2D com React Flow.
8. Transformar o JSON em cena 3D com React Three Fiber.
9. Permitir alternância entre modo 2D e modo 3D.
10. Permitir seleção de entidades no 2D.
11. Permitir seleção de entidades no 3D.
12. Exibir painel de detalhes da entidade selecionada.
13. Exibir painel de rastreabilidade.
14. Exibir painel de budgets.
15. Exibir painel de verificação.
16. Exibir painel de riscos.
17. Exibir interfaces.
18. Permitir construção progressiva por camadas.
19. Ter tema visual escuro, técnico e apresentável.
20. Compilar sem erros com `npm run build`.

## 4.2 Fora do escopo

Não implemente:

- backend;
- banco de dados;
- login;
- autenticação;
- roteamento complexo;
- simulação orbital real;
- propagador orbital;
- dinâmica real de atitude;
- controle real de atitude;
- modelo térmico físico completo;
- FEA;
- CFD;
- VR completo;
- link budget físico real;
- power budget físico real;
- mass budget industrial real;
- integração com hardware;
- conexão com estação solo real.

Esses itens podem aparecer como trabalhos futuros, mas não devem ser implementados no MVP.

---

# 5. Stack obrigatória

Use obrigatoriamente:

- Vite;
- React;
- TypeScript;
- CSS puro;
- `@xyflow/react`;
- `three`;
- `@react-three/fiber`;
- `@react-three/drei`;
- `zod`;
- `zustand`;
- `lucide-react`.

Não use Tailwind, backend, banco de dados ou login.

Se o projeto ainda não estiver inicializado, rode:

```bash
npm create vite@latest . -- --template react-ts
```

Depois instale:

```bash
npm install @xyflow/react three @react-three/fiber @react-three/drei zod zustand lucide-react
```

Garanta que funcionem:

```bash
npm install
npm run dev
npm run build
```

Não finalize antes de `npm run build` passar sem erros.

---

# 6. Estrutura de arquivos obrigatória

Crie ou ajuste exatamente esta estrutura:

```txt
src/
  App.tsx
  main.tsx
  index.css

  data/
    demoArchitecture.json

  types/
    architecture.ts

  schemas/
    architectureSchema.ts

  store/
    useArchitectureStore.ts

  lib/
    validateArchitecture.ts
    progressiveBuild.ts
    architectureToFlow.ts
    architectureToScene.ts
    traceability.ts

  components/
    layout/
      AppShell.tsx
      Header.tsx
      Sidebar.tsx

    controls/
      ViewModeToggle.tsx
      BuildControls.tsx
      JsonValidationStatus.tsx

    flow/
      ArchitectureFlow.tsx
      CustomNode.tsx
      nodeStyles.ts

    scene3d/
      ArchitectureScene3D.tsx
      SpaceSystemObject.tsx
      InterfaceLine3D.tsx

    panels/
      DetailsPanel.tsx
      TraceabilityPanel.tsx
      BudgetPanel.tsx
      VerificationPanel.tsx
      RiskPanel.tsx
```

---

# 7. Tipos TypeScript

Crie `src/types/architecture.ts` com os tipos abaixo.

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
  | "verification"
  | "test"
  | "risk"
  | "budget"
  | "operation"
  | "model";

export type EntityStatus =
  | "draft"
  | "validated"
  | "verified"
  | "open"
  | "closed"
  | "planned"
  | "in_progress"
  | "passed"
  | "failed"
  | "waived";

export type VerificationMethod =
  | "Test"
  | "Analysis"
  | "Inspection"
  | "Review of Design"
  | "Demonstration";

export type RelationType =
  | "contains"
  | "satisfies"
  | "allocated_to"
  | "verifies"
  | "validates"
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
  | "mitigates"
  | "constrains";

export type ModelType =
  | "box"
  | "sphere"
  | "module"
  | "antenna"
  | "solarPanel"
  | "groundStation"
  | "camera"
  | "computer"
  | "battery"
  | "sensor"
  | "actuator";

export type SpaceModelPhilosophy =
  | "Engineering Model"
  | "Qualification Model"
  | "Protoflight Model"
  | "Flight Model";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ArchitectureEntity {
  id: string;
  name: string;
  type: EntityType;
  parentId?: string;
  description?: string;

  requirements?: string[];
  functions?: string[];
  interfaces?: string[];
  verificationMethods?: VerificationMethod[];
  budgets?: string[];
  risks?: string[];

  status?: EntityStatus;
  modelType?: ModelType;
  modelPhilosophy?: SpaceModelPhilosophy;

  position2D?: Vector2;
  position3D?: Vector3;

  metadata?: Record<string, unknown>;
}

export interface ArchitectureRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ArchitectureModel {
  id: string;
  name: string;
  description: string;
  version: string;
  domain: "space-systems-engineering";
  entities: ArchitectureEntity[];
  relations: ArchitectureRelation[];
}
```

---

# 8. Schema Zod

Crie `src/schemas/architectureSchema.ts`.

O schema deve validar:

- `ArchitectureModel`;
- `ArchitectureEntity`;
- `ArchitectureRelation`;
- tipos permitidos;
- status permitidos;
- métodos de verificação permitidos;
- posições 2D;
- posições 3D;
- campos opcionais;
- `metadata`.

O schema deve exportar pelo menos:

```ts
export const architectureEntitySchema = ...
export const architectureRelationSchema = ...
export const architectureModelSchema = ...
```

Pode também exportar tipos derivados com `z.infer`.

---

# 9. Validação do JSON

Crie `src/lib/validateArchitecture.ts`.

A função deve retornar:

```ts
export interface ValidationResult {
  valid: boolean;
  entityCount: number;
  relationCount: number;
  errors: string[];
}
```

A função deve:

1. receber um objeto desconhecido;
2. validar com Zod;
3. retornar `valid: true` se estiver correto;
4. retornar lista de erros se estiver incorreto;
5. contar entidades;
6. contar relações.

---

# 10. JSON demo obrigatório

Crie `src/data/demoArchitecture.json`.

O JSON deve representar uma missão de observação da Terra por satélite pequeno em LEO.

## 10.1 Estrutura geral do JSON

O JSON deve seguir esta estrutura:

```json
{
  "id": "ARCH-EARTH-OBS-DEMO",
  "name": "Arquitetura Demo — Missão de Observação da Terra",
  "description": "Arquitetura conceitual para visualização de Engenharia de Sistemas Espaciais.",
  "version": "1.0.0",
  "domain": "space-systems-engineering",
  "entities": [],
  "relations": []
}
```

## 10.2 IDs obrigatórios de entidades

Inclua entidades com estes IDs:

```txt
MIS-EARTH-OBS-001

OBJ-IMG-001
OBJ-DOWNLINK-001
OBJ-SAFE-OPS-001

REQ-IMG-001
REQ-PWR-001
REQ-COMM-001
REQ-DATA-001
REQ-POINT-001
REQ-THERM-001
REQ-MASS-001
REQ-REL-001

FUN-CAPTURE-IMAGE
FUN-PROCESS-IMAGE
FUN-STORE-DATA
FUN-DOWNLINK-DATA
FUN-RECEIVE-COMMAND
FUN-GENERATE-POWER
FUN-STORE-POWER
FUN-DISTRIBUTE-POWER
FUN-DETERMINE-ATTITUDE
FUN-CONTROL-ATTITUDE
FUN-CONTROL-TEMPERATURE
FUN-EXECUTE-FSW

SYS-MISSION-001
SEG-SPACE-001
SEG-GROUND-001
SYS-SAT-001
SYS-GROUND-STATION-001

SUB-PAYLOAD
SUB-BUS
SUB-STRUCTURE
SUB-EPS
SUB-OBC-OBDH
SUB-TTC
SUB-ADCS
SUB-THERMAL
SUB-FSW

CMP-CAMERA
CMP-BATTERY
CMP-SOLAR-PANEL
CMP-PCDU
CMP-OBC
CMP-TRANSCEIVER
CMP-ANTENNA
CMP-SUN-SENSOR
CMP-MAGNETOMETER
CMP-REACTION-WHEEL
CMP-MAGNETORQUER
CMP-HEATER
CMP-RADIATOR
CMP-PRIMARY-STRUCTURE
CMP-FLIGHT-SOFTWARE

IF-POWER-001
IF-DATA-001
IF-CMD-001
IF-MECH-001
IF-THERM-001
IF-RF-001

BUD-MASS-001
BUD-POWER-001
BUD-DATA-001

RISK-POWER-001
RISK-COMM-001
RISK-THERM-001
RISK-POINTING-001
RISK-DATA-001

VER-REQ-IMG-001
VER-REQ-PWR-001
VER-REQ-COMM-001
VER-REQ-POINT-001
VER-REQ-THERM-001

OP-IMAGE-CAMPAIGN-001
OP-DOWNLINK-PASS-001
```

## 10.3 Missão

Inclua a missão:

```txt
Realizar observação da Terra com satélite de pequeno porte em órbita baixa, capturando imagens, armazenando dados a bordo e transmitindo-os para uma estação solo.
```

Tipo:

```json
"type": "mission"
```

ID:

```txt
MIS-EARTH-OBS-001
```

## 10.4 Objetivos

Inclua pelo menos:

- imagear região de interesse;
- transmitir dados para solo;
- manter operação segura.

IDs:

```txt
OBJ-IMG-001
OBJ-DOWNLINK-001
OBJ-SAFE-OPS-001
```

Tipo:

```json
"type": "objective"
```

## 10.5 Requisitos

Inclua requisitos conceituais:

- resolução espacial mínima;
- capacidade de armazenamento;
- taxa mínima de downlink;
- geração de potência;
- margem de potência;
- controle de apontamento;
- faixa térmica operacional;
- massa máxima;
- confiabilidade mínima;
- verificação dos requisitos críticos.

IDs:

```txt
REQ-IMG-001
REQ-PWR-001
REQ-COMM-001
REQ-DATA-001
REQ-POINT-001
REQ-THERM-001
REQ-MASS-001
REQ-REL-001
```

Tipo:

```json
"type": "requirement"
```

## 10.6 Funções

Inclua funções:

- capturar imagem;
- processar imagem;
- armazenar dados;
- transmitir dados;
- receber comandos;
- gerar potência;
- armazenar energia;
- distribuir potência;
- determinar atitude;
- controlar atitude;
- controlar temperatura;
- executar software de voo.

Tipo:

```json
"type": "function"
```

## 10.7 Sistema, segmentos e subsistemas

Inclua:

- sistema missão;
- segmento espacial;
- segmento solo;
- satélite;
- estação solo.

Inclua subsistemas:

- payload óptico;
- bus;
- estrutura;
- EPS;
- OBC/OBDH;
- TT&C;
- ADCS;
- controle térmico;
- software embarcado.

Tipos:

```json
"type": "system"
"type": "segment"
"type": "subsystem"
```

## 10.8 Componentes

Inclua componentes:

- câmera óptica;
- bateria;
- painel solar;
- PCDU;
- OBC;
- transceptor;
- antena;
- sensor solar;
- magnetômetro;
- roda de reação;
- magnetorquer;
- heater;
- radiador;
- estrutura primária;
- software de voo.

Tipo:

```json
"type": "component"
```

## 10.9 Interfaces

Inclua interfaces:

- potência entre EPS e subsistemas;
- dados entre câmera e OBC;
- comando entre OBC e câmera;
- RF entre transceptor/antena e estação solo;
- mecânica entre componentes e estrutura;
- térmica entre componentes, heater e radiador.

Tipo:

```json
"type": "interface"
```

IDs:

```txt
IF-POWER-001
IF-DATA-001
IF-CMD-001
IF-MECH-001
IF-THERM-001
IF-RF-001
```

## 10.10 Budgets

Entidades do tipo `budget` devem ter `metadata` assim:

```json
{
  "budgetType": "mass",
  "allocated": 12,
  "estimated": 10.5,
  "margin": 12.5,
  "unit": "kg",
  "associatedEntity": "SYS-SAT-001"
}
```

Crie pelo menos:

- `BUD-MASS-001`
- `BUD-POWER-001`
- `BUD-DATA-001`

Use tipos:

- massa;
- potência;
- dados.

Unidades sugeridas:

- `kg`;
- `W`;
- `MB`;
- `Mbps`.

## 10.11 Verificações

Entidades do tipo `verification` devem ter `metadata` assim:

```json
{
  "requirementId": "REQ-IMG-001",
  "verifiedItemId": "CMP-CAMERA",
  "method": "Test",
  "status": "planned",
  "evidence": "Relatório de ensaio funcional do payload óptico."
}
```

Inclua verificações com estes métodos:

- `Test`
- `Analysis`
- `Inspection`
- `Review of Design`
- `Demonstration`

Crie pelo menos:

- `VER-REQ-IMG-001`
- `VER-REQ-PWR-001`
- `VER-REQ-COMM-001`
- `VER-REQ-POINT-001`
- `VER-REQ-THERM-001`

## 10.12 Riscos

Entidades do tipo `risk` devem ter `metadata` assim:

```json
{
  "probability": "medium",
  "impact": "high",
  "mitigation": "Aumentar margem de potência e revisar perfil operacional."
}
```

Inclua riscos:

- potência insuficiente;
- perda de comunicação;
- temperatura fora da faixa;
- falha de apontamento;
- perda de dados.

Crie pelo menos:

- `RISK-POWER-001`
- `RISK-COMM-001`
- `RISK-THERM-001`
- `RISK-POINTING-001`
- `RISK-DATA-001`

## 10.13 Operações

Inclua operações:

- campanha de imageamento;
- passe de downlink.

IDs:

```txt
OP-IMAGE-CAMPAIGN-001
OP-DOWNLINK-PASS-001
```

Tipo:

```json
"type": "operation"
```

## 10.14 Posições 2D e 3D

Cada entidade principal deve ter, quando possível:

```json
"position2D": { "x": 0, "y": 0 },
"position3D": { "x": 0, "y": 0, "z": 0 }
```

Organize o 2D por níveis:

- missão no topo;
- objetivos abaixo;
- requisitos abaixo;
- funções abaixo;
- sistemas e segmentos abaixo;
- subsistemas abaixo;
- componentes abaixo;
- interfaces/budgets/riscos/verificações abaixo.

Organize o 3D por agrupamento:

- payload em uma região;
- bus no centro;
- EPS em uma lateral;
- ADCS em outra lateral;
- TT&C próximo à antena;
- controle térmico próximo aos componentes térmicos;
- OBC/software no centro lógico;
- segmento solo afastado do satélite;
- estação solo ligada por interface RF.

---

# 11. Relações obrigatórias

Crie relações suficientes para demonstrar rastreabilidade e interfaces.

Use tipos:

```txt
contains
satisfies
allocated_to
verifies
validates
depends_on
provides_power_to
sends_data_to
receives_command_from
mechanically_attached_to
thermally_coupled_to
controls
measures
actuates
communicates_with
mitigates
constrains
```

Exemplos obrigatórios:

```txt
MIS-EARTH-OBS-001 contains OBJ-IMG-001
MIS-EARTH-OBS-001 contains OBJ-DOWNLINK-001
MIS-EARTH-OBS-001 contains OBJ-SAFE-OPS-001

OBJ-IMG-001 satisfies REQ-IMG-001
OBJ-DOWNLINK-001 satisfies REQ-COMM-001
OBJ-SAFE-OPS-001 satisfies REQ-PWR-001
OBJ-SAFE-OPS-001 satisfies REQ-THERM-001

REQ-IMG-001 allocated_to FUN-CAPTURE-IMAGE
REQ-COMM-001 allocated_to FUN-DOWNLINK-DATA
REQ-PWR-001 allocated_to FUN-GENERATE-POWER
REQ-POINT-001 allocated_to FUN-CONTROL-ATTITUDE
REQ-THERM-001 allocated_to FUN-CONTROL-TEMPERATURE

FUN-CAPTURE-IMAGE allocated_to CMP-CAMERA
FUN-DOWNLINK-DATA allocated_to CMP-TRANSCEIVER
FUN-GENERATE-POWER allocated_to CMP-SOLAR-PANEL
FUN-CONTROL-ATTITUDE allocated_to CMP-REACTION-WHEEL
FUN-CONTROL-TEMPERATURE allocated_to CMP-HEATER

VER-REQ-IMG-001 verifies REQ-IMG-001
VER-REQ-PWR-001 verifies REQ-PWR-001
VER-REQ-COMM-001 verifies REQ-COMM-001
VER-REQ-POINT-001 verifies REQ-POINT-001
VER-REQ-THERM-001 verifies REQ-THERM-001

SYS-MISSION-001 contains SEG-SPACE-001
SYS-MISSION-001 contains SEG-GROUND-001
SEG-SPACE-001 contains SYS-SAT-001
SEG-GROUND-001 contains SYS-GROUND-STATION-001

SYS-SAT-001 contains SUB-PAYLOAD
SYS-SAT-001 contains SUB-BUS
SYS-SAT-001 contains SUB-STRUCTURE
SYS-SAT-001 contains SUB-EPS
SYS-SAT-001 contains SUB-OBC-OBDH
SYS-SAT-001 contains SUB-TTC
SYS-SAT-001 contains SUB-ADCS
SYS-SAT-001 contains SUB-THERMAL
SYS-SAT-001 contains SUB-FSW

SUB-PAYLOAD contains CMP-CAMERA
SUB-EPS contains CMP-BATTERY
SUB-EPS contains CMP-SOLAR-PANEL
SUB-EPS contains CMP-PCDU
SUB-OBC-OBDH contains CMP-OBC
SUB-TTC contains CMP-TRANSCEIVER
SUB-TTC contains CMP-ANTENNA
SUB-ADCS contains CMP-SUN-SENSOR
SUB-ADCS contains CMP-MAGNETOMETER
SUB-ADCS contains CMP-REACTION-WHEEL
SUB-ADCS contains CMP-MAGNETORQUER
SUB-THERMAL contains CMP-HEATER
SUB-THERMAL contains CMP-RADIATOR
SUB-STRUCTURE contains CMP-PRIMARY-STRUCTURE
SUB-FSW contains CMP-FLIGHT-SOFTWARE

SUB-EPS provides_power_to CMP-CAMERA
SUB-EPS provides_power_to CMP-OBC
SUB-EPS provides_power_to CMP-TRANSCEIVER
CMP-CAMERA sends_data_to CMP-OBC
CMP-OBC sends_data_to CMP-TRANSCEIVER
CMP-OBC receives_command_from CMP-TRANSCEIVER
CMP-TRANSCEIVER communicates_with SYS-GROUND-STATION-001
CMP-CAMERA mechanically_attached_to CMP-PRIMARY-STRUCTURE
CMP-CAMERA thermally_coupled_to CMP-RADIATOR
CMP-HEATER thermally_coupled_to CMP-CAMERA
CMP-SUN-SENSOR measures SYS-SAT-001
CMP-REACTION-WHEEL controls SYS-SAT-001
CMP-MAGNETORQUER actuates SYS-SAT-001
RISK-POWER-001 constrains SUB-EPS
RISK-COMM-001 constrains SUB-TTC
RISK-THERM-001 constrains SUB-THERMAL
```

---

# 12. Zustand Store

Crie `src/store/useArchitectureStore.ts`.

O estado deve conter:

```ts
architecture: ArchitectureModel;
selectedEntityId: string | null;
viewMode: "2d" | "3d";
currentLayer: number;
validationResult: ValidationResult;
```

Actions obrigatórias:

```ts
selectEntity(id: string | null): void;
setViewMode(mode: "2d" | "3d"): void;
toggleViewMode(): void;
nextLayer(): void;
previousLayer(): void;
showAllLayers(): void;
resetLayers(): void;
setArchitecture(model: ArchitectureModel): void;
```

Seletores úteis:

- entidade selecionada;
- entidades visíveis pela camada atual;
- relações visíveis pela camada atual;
- camada atual;
- nome da camada atual.

---

# 13. Construção progressiva

Crie `src/lib/progressiveBuild.ts`.

Use estas camadas:

```ts
export const buildLayers = [
  { id: 0, name: "Missão", types: ["mission"] },
  { id: 1, name: "Objetivos", types: ["mission", "objective"] },
  { id: 2, name: "Requisitos", types: ["mission", "objective", "requirement"] },
  { id: 3, name: "Funções", types: ["mission", "objective", "requirement", "function"] },
  { id: 4, name: "Sistema e Segmentos", types: ["mission", "objective", "requirement", "function", "system", "segment"] },
  { id: 5, name: "Subsistemas", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem"] },
  { id: 6, name: "Componentes", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem", "component"] },
  { id: 7, name: "Interfaces", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem", "component", "interface"] },
  { id: 8, name: "Budgets", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem", "component", "interface", "budget"] },
  { id: 9, name: "Riscos", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem", "component", "interface", "budget", "risk"] },
  { id: 10, name: "Verificação", types: ["mission", "objective", "requirement", "function", "system", "segment", "subsystem", "component", "interface", "budget", "risk", "verification", "test", "operation", "model"] }
] as const;
```

A visualização 2D e 3D deve respeitar a camada atual.

Botões:

- Camada anterior;
- Próxima camada;
- Mostrar tudo;
- Reiniciar.

---

# 14. Visualização 2D com React Flow

Crie:

```txt
src/components/flow/ArchitectureFlow.tsx
src/components/flow/CustomNode.tsx
src/components/flow/nodeStyles.ts
src/lib/architectureToFlow.ts
```

## 14.1 Requisitos técnicos

A visualização 2D deve:

- usar `@xyflow/react`;
- renderizar nós para entidades visíveis;
- renderizar arestas para relações visíveis;
- permitir clique em nó;
- atualizar a entidade selecionada no Zustand;
- mostrar labels nas arestas;
- usar `Background`;
- usar `Controls`;
- usar `MiniMap`;
- usar `fitView`;
- diferenciar tipos por cor;
- diferenciar relações por label;
- ser legível;
- ser a principal prova de conceito do TG.

## 14.2 Importante

Importe o CSS do React Flow em `main.tsx` ou no componente:

```ts
import "@xyflow/react/dist/style.css";
```

## 14.3 Layout do grafo

Organize nós por camada vertical:

1. missão;
2. objetivos;
3. requisitos;
4. funções;
5. sistemas e segmentos;
6. subsistemas;
7. componentes;
8. interfaces;
9. budgets;
10. riscos;
11. verificações.

Se a entidade tiver `position2D`, use essa posição.

Se não tiver, gere posição automaticamente baseada no tipo.

## 14.4 Cores sugeridas

Use cores por tipo:

```txt
mission: azul
objective: ciano
requirement: amarelo
function: roxo
system: verde
segment: verde claro
subsystem: azul claro
component: cinza claro
interface: laranja
budget: verde limão
verification: rosa
test: rosa claro
risk: vermelho
operation: branco
model: lilás
```

## 14.5 CustomNode

O nó customizado deve mostrar:

- ícone simples com `lucide-react`;
- nome;
- ID curto;
- tipo;
- status, se houver.

---

# 15. Visualização 3D

Crie:

```txt
src/components/scene3d/ArchitectureScene3D.tsx
src/components/scene3d/SpaceSystemObject.tsx
src/components/scene3d/InterfaceLine3D.tsx
src/lib/architectureToScene.ts
```

## 15.1 Requisitos técnicos

A visualização 3D deve:

- usar React Three Fiber;
- usar Drei `OrbitControls`;
- representar entidades como geometrias simples;
- usar posições 3D do JSON;
- gerar posições automaticamente se não existirem;
- permitir clique nos objetos 3D;
- atualizar entidade selecionada;
- destacar entidade selecionada;
- representar relações/interfaces como linhas;
- ter luz ambiente;
- ter luz direcional;
- ter câmera orbital;
- ter fundo escuro;
- ser conceitual, não fisicamente realista;
- funcionar no build.

## 15.2 Formas sugeridas

- `mission`: esfera grande;
- `objective`: esfera pequena;
- `requirement`: caixa fina;
- `function`: cilindro ou caixa;
- `system`: cubo grande;
- `segment`: cubo médio;
- `subsystem`: caixa;
- `component`: caixa pequena;
- `interface`: linha;
- `budget`: caixa verde;
- `verification`: esfera rosa;
- `risk`: esfera vermelha;
- `groundStation`: cone ou caixa separada.

## 15.3 Agrupamento espacial

- payload em uma região;
- bus no centro;
- EPS em uma lateral;
- ADCS em outra lateral;
- TT&C próximo à antena;
- controle térmico próximo aos componentes térmicos;
- software/OBC no centro lógico;
- segmento solo separado do satélite;
- estação solo afastada e ligada por interface RF.

## 15.4 Cuidados com Three.js

Evite soluções frágeis.

Mantenha a cena simples.

O critério principal é:

```bash
npm run build
```

passar sem erros.

---

# 16. Painel de detalhes

Crie `src/components/panels/DetailsPanel.tsx`.

Quando nenhuma entidade estiver selecionada, mostrar:

```txt
Selecione uma entidade na visualização 2D ou 3D para inspecionar seus detalhes.
```

Também mostrar uma explicação curta:

```txt
A arquitetura segue a cadeia Missão → Objetivos → Requisitos → Funções → Componentes → Verificação.
```

Quando houver entidade selecionada, mostrar:

- ID;
- nome;
- tipo;
- descrição;
- status;
- parentId;
- modelType;
- modelPhilosophy;
- requisitos relacionados;
- funções relacionadas;
- interfaces relacionadas;
- budgets relacionados;
- riscos relacionados;
- métodos de verificação;
- metadata formatado;
- relações de entrada;
- relações de saída.

---

# 17. Painel de rastreabilidade

Crie:

```txt
src/lib/traceability.ts
src/components/panels/TraceabilityPanel.tsx
```

O painel deve mostrar cadeias:

```txt
Missão → Objetivo → Requisito → Função → Componente → Verificação
```

Exemplo:

```txt
MIS-EARTH-OBS-001 → OBJ-IMG-001 → REQ-IMG-001 → FUN-CAPTURE-IMAGE → CMP-CAMERA → VER-REQ-IMG-001
```

Gere pelo menos três cadeias usando:

- relações `contains`;
- relações `satisfies`;
- relações `allocated_to`;
- relações `verifies`;
- metadados de verificação.

Se a inferência automática ficar complexa, implemente uma versão simples e robusta baseada em:

- `metadata.requirementId`;
- `metadata.verifiedItemId`;
- relações diretas;
- busca por funções ligadas ao requisito;
- busca por componentes ligados à função.

---

# 18. Painel de budgets

Crie `src/components/panels/BudgetPanel.tsx`.

Mostrar tabela:

```txt
ID | Nome | Tipo | Alocado | Estimado | Margem | Unidade | Entidade associada
```

Os budgets devem ser extraídos das entidades do tipo `budget`.

Budgets mínimos:

- massa;
- potência;
- dados.

Use `metadata`:

```json
{
  "budgetType": "mass",
  "allocated": 12,
  "estimated": 10.5,
  "margin": 12.5,
  "unit": "kg",
  "associatedEntity": "SYS-SAT-001"
}
```

---

# 19. Painel de verificação

Crie `src/components/panels/VerificationPanel.tsx`.

Mostrar matriz:

```txt
Requisito | Método | Item verificado | Status | Evidência
```

Dados devem vir de entidades `verification` e `metadata`.

Métodos permitidos:

- Test;
- Analysis;
- Inspection;
- Review of Design;
- Demonstration.

Status permitidos:

- planned;
- in_progress;
- passed;
- failed;
- waived.

---

# 20. Painel de riscos

Crie `src/components/panels/RiskPanel.tsx`.

Mostrar tabela:

```txt
ID | Risco | Probabilidade | Impacto | Mitigação | Status
```

Os riscos devem vir das entidades do tipo `risk`.

Use `metadata`:

```json
{
  "probability": "medium",
  "impact": "high",
  "mitigation": "Aumentar margem de potência e revisar perfil operacional."
}
```

---

# 21. Layout geral

Crie:

```txt
src/components/layout/AppShell.tsx
src/components/layout/Header.tsx
src/components/layout/Sidebar.tsx
src/components/controls/ViewModeToggle.tsx
src/components/controls/BuildControls.tsx
src/components/controls/JsonValidationStatus.tsx
```

## 21.1 Header

O header deve conter:

- título do TG;
- subtítulo: `Visualizador de arquiteturas espaciais baseado em JSON`;
- botão de alternância 2D/3D;
- indicador de validação do JSON.

## 21.2 Área central

A área central deve mostrar:

- visualização 2D, se `viewMode === "2d"`;
- visualização 3D, se `viewMode === "3d"`.

## 21.3 Painel lateral direito

Mostrar `DetailsPanel`.

## 21.4 Painel inferior

Mostrar seções ou abas para:

- rastreabilidade;
- budgets;
- verificação;
- riscos.

Não precisa implementar sistema complexo de tabs; pode ser uma grade de painéis.

## 21.5 Controles

A barra de controles deve conter:

- camada atual;
- botão `Camada anterior`;
- botão `Próxima camada`;
- botão `Mostrar tudo`;
- botão `Reiniciar`.

---

# 22. CSS

Use CSS puro em `src/index.css`.

A aparência deve ser:

- tema escuro técnico;
- fundo principal escuro;
- painéis em cinza escuro;
- bordas discretas;
- texto claro;
- destaque ciano/azul;
- botões limpos;
- tabelas legíveis;
- responsivo para tela de notebook;
- apresentável para banca.

Sugestão de cores:

```css
:root {
  --bg: #07111f;
  --panel: #0d1b2a;
  --panel-2: #132238;
  --border: #26384f;
  --text: #e5edf7;
  --muted: #9fb0c3;
  --accent: #38bdf8;
  --accent-2: #22d3ee;
  --danger: #f87171;
  --warning: #facc15;
  --success: #4ade80;
}
```

---

# 23. App.tsx e main.tsx

## 23.1 main.tsx

Garanta que importe:

```ts
import React from "react";
import ReactDOM from "react-dom/client";
import "@xyflow/react/dist/style.css";
import "./index.css";
import App from "./App";
```

## 23.2 App.tsx

`App.tsx` deve renderizar:

```tsx
<AppShell />
```

---

# 24. Cuidados técnicos

Não adicione:

- Redux;
- Next.js;
- backend;
- banco de dados;
- Tailwind;
- autenticação;
- libs de UI pesadas;
- roteamento desnecessário.

O Claude Code deve:

1. criar arquivos;
2. implementar lógica;
3. rodar `npm run build`;
4. corrigir erros de TypeScript;
5. corrigir imports quebrados;
6. corrigir erros do Three.js;
7. corrigir problemas de React Flow;
8. não finalizar antes do build passar.

Evite:

- `any`;
- componentes gigantes;
- arquivos vazios;
- código morto;
- imports não usados;
- dependências desnecessárias;
- `console.log` excessivo.

Permite-se usar `unknown` em validação, desde que tratado corretamente.

---

# 25. Critérios de aceite

O projeto será aceito quando:

1. `npm install` funcionar;
2. `npm run dev` abrir a aplicação;
3. `npm run build` passar sem erro;
4. a aplicação carregar o JSON demo;
5. o status de validação aparecer;
6. o número de entidades aparecer;
7. o número de relações aparecer;
8. o modo 2D mostrar grafo;
9. o modo 3D mostrar cena;
10. clique em entidade no 2D selecionar;
11. clique em entidade no 3D selecionar;
12. painel de detalhes atualizar;
13. construção por camadas funcionar;
14. rastreabilidade aparecer;
15. budgets aparecerem;
16. matriz de verificação aparecer;
17. riscos aparecerem;
18. interfaces aparecerem;
19. o visual parecer apresentável para banca;
20. não houver tela branca;
21. o código estiver organizado.

---

# 26. Ordem de execução obrigatória

Siga esta ordem:

1. Verifique a estrutura atual do projeto.
2. Se necessário, inicialize Vite + React + TypeScript.
3. Instale dependências.
4. Crie os tipos TypeScript.
5. Crie o schema Zod.
6. Crie o JSON demo.
7. Crie a função de validação.
8. Crie o store Zustand.
9. Crie a lógica de construção progressiva.
10. Crie a conversão para React Flow.
11. Crie os componentes de visualização 2D.
12. Crie a conversão para cena 3D.
13. Crie os componentes 3D.
14. Crie os painéis.
15. Crie os controles.
16. Crie o layout.
17. Ajuste CSS.
18. Integre tudo em `App.tsx`.
19. Rode `npm run build`.
20. Corrija todos os erros.
21. Rode novamente `npm run build`.
22. Finalize somente quando o build passar.
23. Liste arquivos criados/alterados.
24. Explique como rodar.

---

# 27. Resultado esperado para demonstração

Ao abrir a aplicação, o usuário deve ver:

1. uma interface escura e técnica;
2. o título do TG;
3. o status de validação do JSON;
4. a camada atual da construção progressiva;
5. botões de navegação por camada;
6. botão para alternar 2D/3D;
7. grafo 2D da arquitetura;
8. visualização 3D conceitual;
9. painel de detalhes;
10. painel de rastreabilidade;
11. painel de budgets;
12. painel de verificação;
13. painel de riscos.

A banca deve conseguir entender visualmente que o sistema modela:

```txt
Missão → Objetivos → Requisitos → Funções → Sistema → Segmentos → Subsistemas → Componentes → Interfaces → Budgets → Riscos → Verificação → Validação
```

---

# 28. Requisitos mínimos de robustez

Antes de finalizar, confirme:

```bash
npm run build
```

Se houver erro:

- leia o erro;
- corrija;
- rode novamente;
- repita até passar.

Não entregue projeto quebrado.

Se houver problema de tipagem complexo no Three.js, simplifique a cena 3D, mas mantenha:

- Canvas;
- OrbitControls;
- objetos;
- linhas;
- seleção;
- destaque.

Se houver problema de layout do React Flow, simplifique, mas mantenha:

- nós;
- arestas;
- labels;
- clique;
- fitView;
- Background;
- Controls;
- MiniMap.

---

# 29. Melhorias desejáveis se houver tempo

Após o MVP funcionar, adicione se simples:

- busca por ID;
- destaque de cadeia de rastreabilidade ao selecionar requisito;
- legenda de cores;
- contador por tipo de entidade;
- botão para centralizar grafo;
- export visual futuro como comentário;
- campo de maturidade técnica em metadata;
- indicação de entidades sem verificação;
- indicação de requisitos sem alocação.

Essas melhorias são desejáveis, mas não devem quebrar o build.

---

# 30. Finalização esperada do Claude Code

Ao terminar, responda com:

1. lista de arquivos criados;
2. lista de arquivos alterados;
3. comandos executados;
4. confirmação de que `npm run build` passou;
5. instruções para rodar:

```bash
npm install
npm run dev
```

6. resumo do que o MVP demonstra no contexto do TG.

---

# 31. Comece agora

Implemente tudo agora.

Não finalize antes de:

```bash
npm run build
```

passar sem erros.
