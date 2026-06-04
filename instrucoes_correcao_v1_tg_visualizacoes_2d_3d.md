# Instruções de Correção e Implementação — V1 do TG

**Projeto:** Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual  
**Foco desta versão:** corrigir as relações 2D/3D, tornar o JSON intuitivo e entregar uma visualização simples, clara e visualmente impressionante.  
**Stack esperada:** Vite + React + TypeScript + @xyflow/react + Three.js/React Three Fiber + Drei + Zod + Zustand.

---

## 1. Objetivo da V1

A V1 deve provar que o usuário consegue:

1. Fornecer ou selecionar um arquivo JSON simples descrevendo uma arquitetura espacial.
2. Validar automaticamente se o JSON está correto.
3. Visualizar a arquitetura em 2D com relações claras, coloridas e numeradas.
4. Visualizar a mesma arquitetura em 3D com geometria intuitiva, sem textos sobrepostos.
5. Navegar por etapa, por categoria, por subsistema, por tipo de relação ou por elemento selecionado.
6. Entender rapidamente:
   - missão;
   - requisitos;
   - funções;
   - sistemas;
   - subsistemas;
   - componentes;
   - interfaces;
   - verificações;
   - budgets;
   - relações entre elementos.

O objetivo não é simular física real. O objetivo é **tornar compreensível a arquitetura sistêmica de uma missão espacial**.

---

## 2. Problemas que devem ser corrigidos

### 2.1 Relações 2D incorretas

Corrigir os seguintes pontos:

- Arestas aparecem sem significado claro.
- Relações diferentes parecem iguais.
- Relações entre subsistemas diferentes não ficam destacadas.
- Não existe numeração visual clara sobre cada tipo de relação.
- O usuário não entende rapidamente se a relação é de potência, dados, comando, mecânica, térmica, verificação ou rastreabilidade.
- Há risco de linhas cruzadas demais e visual poluído.
- Faltam filtros por tipo de relação.
- Faltam modo de etapa e modo de foco individual.

### 2.2 Relações 3D incorretas

Corrigir os seguintes pontos:

- A posição espacial dos subsistemas não deixa clara a arquitetura.
- Textos e labels podem ficar sobrepostos.
- Relações 3D podem atravessar objetos de forma confusa.
- Não existe correspondência visual forte entre 2D e 3D.
- Faltam agrupamento, legenda, minimapa e modo de exploração por etapas.
- Não está claro onde cada subsistema está localizado.
- O usuário não consegue navegar intuitivamente entre partes do sistema.

### 2.3 JSON pouco intuitivo

Corrigir os seguintes pontos:

- O JSON deve permitir ao usuário definir facilmente:
  - entidades;
  - categorias;
  - subsistemas;
  - componentes;
  - tipos de relação;
  - relações concretas;
  - cores;
  - labels;
  - etapas de aparição;
  - posições opcionais 2D/3D;
  - metadados técnicos.

O JSON deve ser a **fonte única da verdade** para 2D e 3D.

---

## 3. Princípios obrigatórios da V1

### 3.1 O mesmo JSON deve alimentar 2D e 3D

Não criar uma estrutura para 2D e outra para 3D.  
Criar um modelo único:

```txt
JSON de arquitetura
      ↓
validação com Zod
      ↓
normalização interna
      ↓
estado global com Zustand
      ↓
visualização 2D + visualização 3D + painel lateral + filtros + etapas
```

### 3.2 Toda relação deve ter tipo

Toda relação deve possuir:

- `id`;
- `type`;
- `source`;
- `target`;
- `label`;
- `description`;
- `step`;
- `criticality`, se aplicável;
- metadados opcionais.

Exemplo:

```json
{
  "id": "rel_power_eps_obc",
  "type": "provides_power_to",
  "source": "eps",
  "target": "obc",
  "label": "28 V regulated bus",
  "description": "EPS fornece potência regulada ao computador de bordo.",
  "step": 5,
  "criticality": "high"
}
```

### 3.3 Cada tipo de relação deve ter cor e número

A V1 deve ter uma legenda fixa.  
Cada tipo de relação recebe:

- número;
- nome técnico;
- cor;
- estilo de linha;
- descrição;
- direção;
- ícone opcional.

Exemplo:

```json
{
  "id": "provides_power_to",
  "index": 1,
  "label": "Fornece potência",
  "color": "#F59E0B",
  "lineStyle": "solid",
  "directed": true,
  "description": "Relação de fornecimento de energia elétrica entre subsistemas ou componentes."
}
```

Na visualização:

- a aresta deve usar essa cor;
- o número deve aparecer em destaque sobre a linha;
- o painel lateral deve explicar o que o número significa;
- a mesma cor e número devem aparecer no 2D e no 3D.

### 3.4 Relações entre categorias diferentes devem se destacar

Regra obrigatória:

```txt
Se source.category !== target.category:
    destacar a relação com cor cheia, espessura maior e badge numérico visível.
Se source.category === target.category:
    manter cor do tipo, mas com menor opacidade.
```

Isso deixa claro quando a relação cruza fronteiras de subsistemas ou categorias.

### 3.5 Visualização progressiva

O sistema deve ter dois modos:

1. **Modo geral:** mostra tudo.
2. **Modo por etapas:** mostra a arquitetura sendo construída progressivamente.

Sequência recomendada:

```txt
Etapa 1 — Missão
Etapa 2 — Objetivos
Etapa 3 — Requisitos
Etapa 4 — Funções
Etapa 5 — Segmentos
Etapa 6 — Subsistemas
Etapa 7 — Componentes
Etapa 8 — Interfaces
Etapa 9 — Budgets
Etapa 10 — Verificações
```

No modo por etapas:

- elementos futuros devem ficar ocultos ou com opacidade muito baixa;
- relações futuras devem sumir;
- ao avançar, novos blocos devem surgir com animação;
- no 3D, a arquitetura pode “abrir como um leque”.

---

## 4. Modelo de JSON recomendado

Criar um JSON com esta estrutura principal:

```json
{
  "metadata": {},
  "mission": {},
  "categories": [],
  "relationTypes": [],
  "entities": [],
  "relations": [],
  "budgets": [],
  "verifications": [],
  "views": {}
}
```

---

## 5. Exemplo de JSON intuitivo para a V1

Usar este exemplo como arquitetura base de demonstração.

```json
{
  "metadata": {
    "projectName": "DemoSat-TG",
    "version": "1.0",
    "description": "Arquitetura conceitual de um satélite de observação da Terra para demonstrar relações sistêmicas em 2D e 3D."
  },
  "mission": {
    "id": "mission_earth_observation",
    "name": "Missão de Observação da Terra",
    "objectives": [
      "Coletar imagens multiespectrais de regiões de interesse.",
      "Transmitir dados para estação solo.",
      "Manter operação nominal em órbita baixa."
    ]
  },
  "categories": [
    {
      "id": "mission",
      "label": "Missão",
      "color": "#A855F7",
      "shape2D": "hexagon",
      "shape3D": "sphere"
    },
    {
      "id": "requirement",
      "label": "Requisito",
      "color": "#2563EB",
      "shape2D": "document",
      "shape3D": "flatPanel"
    },
    {
      "id": "function",
      "label": "Função",
      "color": "#14B8A6",
      "shape2D": "rounded",
      "shape3D": "capsule"
    },
    {
      "id": "subsystem",
      "label": "Subsistema",
      "color": "#22C55E",
      "shape2D": "group",
      "shape3D": "box"
    },
    {
      "id": "component",
      "label": "Componente",
      "color": "#EAB308",
      "shape2D": "box",
      "shape3D": "smallBox"
    },
    {
      "id": "verification",
      "label": "Verificação",
      "color": "#EF4444",
      "shape2D": "check",
      "shape3D": "diamond"
    }
  ],
  "relationTypes": [
    {
      "id": "satisfies",
      "index": 1,
      "label": "Satisfaz requisito",
      "color": "#2563EB",
      "lineStyle": "solid",
      "directed": true,
      "description": "Indica que uma função, subsistema ou componente satisfaz um requisito."
    },
    {
      "id": "allocated_to",
      "index": 2,
      "label": "Alocado para",
      "color": "#14B8A6",
      "lineStyle": "dashed",
      "directed": true,
      "description": "Indica alocação de requisito ou função para um elemento físico/lógico."
    },
    {
      "id": "provides_power_to",
      "index": 3,
      "label": "Fornece potência",
      "color": "#F59E0B",
      "lineStyle": "solid",
      "directed": true,
      "description": "Indica fornecimento de energia elétrica."
    },
    {
      "id": "sends_data_to",
      "index": 4,
      "label": "Envia dados",
      "color": "#06B6D4",
      "lineStyle": "solid",
      "directed": true,
      "description": "Indica fluxo de dados, telemetria ou payload data."
    },
    {
      "id": "receives_command_from",
      "index": 5,
      "label": "Recebe comando",
      "color": "#8B5CF6",
      "lineStyle": "dotted",
      "directed": true,
      "description": "Indica fluxo de telecomando."
    },
    {
      "id": "mechanically_attached_to",
      "index": 6,
      "label": "Fixação mecânica",
      "color": "#64748B",
      "lineStyle": "solid",
      "directed": false,
      "description": "Indica acoplamento ou fixação estrutural."
    },
    {
      "id": "thermally_coupled_to",
      "index": 7,
      "label": "Acoplamento térmico",
      "color": "#DC2626",
      "lineStyle": "dashed",
      "directed": false,
      "description": "Indica troca ou acoplamento térmico relevante."
    },
    {
      "id": "verifies",
      "index": 8,
      "label": "Verifica",
      "color": "#16A34A",
      "lineStyle": "solid",
      "directed": true,
      "description": "Indica que uma verificação confirma atendimento a um requisito."
    }
  ],
  "entities": [
    {
      "id": "mission",
      "name": "Missão DemoSat",
      "category": "mission",
      "description": "Missão conceitual de observação da Terra.",
      "step": 1
    },
    {
      "id": "req_image",
      "name": "REQ-001 Capturar imagem",
      "category": "requirement",
      "description": "O sistema deve capturar imagens da superfície terrestre.",
      "step": 3
    },
    {
      "id": "req_downlink",
      "name": "REQ-002 Transmitir dados",
      "category": "requirement",
      "description": "O sistema deve transmitir dados de missão para a estação solo.",
      "step": 3
    },
    {
      "id": "func_capture",
      "name": "Capturar imagem",
      "category": "function",
      "description": "Função de aquisição de imagem pelo payload.",
      "step": 4
    },
    {
      "id": "func_transmit",
      "name": "Transmitir dados",
      "category": "function",
      "description": "Função de transmissão de dados para o segmento solo.",
      "step": 4
    },
    {
      "id": "payload",
      "name": "Payload óptico",
      "category": "subsystem",
      "subsystem": "Payload",
      "description": "Carga útil responsável pela aquisição de imagens.",
      "step": 6
    },
    {
      "id": "eps",
      "name": "EPS",
      "category": "subsystem",
      "subsystem": "EPS",
      "description": "Subsistema de potência elétrica.",
      "step": 6
    },
    {
      "id": "obc",
      "name": "OBC / C&DH",
      "category": "subsystem",
      "subsystem": "OBC",
      "description": "Computador de bordo e manipulação de dados.",
      "step": 6
    },
    {
      "id": "ttc",
      "name": "TT&C",
      "category": "subsystem",
      "subsystem": "TT&C",
      "description": "Telemetria, telecomando e comunicações.",
      "step": 6
    },
    {
      "id": "adcs",
      "name": "ADCS",
      "category": "subsystem",
      "subsystem": "ADCS",
      "description": "Controle e determinação de atitude.",
      "step": 6
    },
    {
      "id": "structure",
      "name": "Estrutura",
      "category": "subsystem",
      "subsystem": "Estrutura",
      "description": "Estrutura mecânica primária do satélite.",
      "step": 6
    },
    {
      "id": "solar_array",
      "name": "Painéis solares",
      "category": "component",
      "parentId": "eps",
      "description": "Geração primária de energia.",
      "step": 7
    },
    {
      "id": "battery",
      "name": "Bateria",
      "category": "component",
      "parentId": "eps",
      "description": "Armazenamento de energia.",
      "step": 7
    },
    {
      "id": "camera",
      "name": "Câmera multiespectral",
      "category": "component",
      "parentId": "payload",
      "description": "Sensor principal da missão.",
      "step": 7
    },
    {
      "id": "verification_image_test",
      "name": "Teste funcional de imagem",
      "category": "verification",
      "description": "Teste para verificar aquisição de imagem.",
      "method": "Test",
      "step": 10
    }
  ],
  "relations": [
    {
      "id": "rel_req_image_func_capture",
      "type": "allocated_to",
      "source": "req_image",
      "target": "func_capture",
      "label": "REQ-001 → função",
      "step": 4
    },
    {
      "id": "rel_func_capture_payload",
      "type": "allocated_to",
      "source": "func_capture",
      "target": "payload",
      "label": "Função alocada ao payload",
      "step": 6
    },
    {
      "id": "rel_payload_satisfies_req",
      "type": "satisfies",
      "source": "payload",
      "target": "req_image",
      "label": "Payload satisfaz REQ-001",
      "step": 8
    },
    {
      "id": "rel_eps_obc_power",
      "type": "provides_power_to",
      "source": "eps",
      "target": "obc",
      "label": "Barramento 28 V",
      "step": 8,
      "criticality": "high"
    },
    {
      "id": "rel_eps_payload_power",
      "type": "provides_power_to",
      "source": "eps",
      "target": "payload",
      "label": "Alimentação payload",
      "step": 8,
      "criticality": "high"
    },
    {
      "id": "rel_payload_obc_data",
      "type": "sends_data_to",
      "source": "payload",
      "target": "obc",
      "label": "Imagem bruta",
      "step": 8
    },
    {
      "id": "rel_obc_ttc_data",
      "type": "sends_data_to",
      "source": "obc",
      "target": "ttc",
      "label": "Pacotes de telemetria",
      "step": 8
    },
    {
      "id": "rel_ttc_obc_cmd",
      "type": "receives_command_from",
      "source": "obc",
      "target": "ttc",
      "label": "Telecomando",
      "step": 8
    },
    {
      "id": "rel_payload_structure_mech",
      "type": "mechanically_attached_to",
      "source": "payload",
      "target": "structure",
      "label": "Fixação no deck",
      "step": 8
    },
    {
      "id": "rel_verification_req_image",
      "type": "verifies",
      "source": "verification_image_test",
      "target": "req_image",
      "label": "Verifica REQ-001",
      "step": 10
    }
  ],
  "budgets": [
    {
      "id": "mass_budget",
      "label": "Budget de massa",
      "unit": "kg",
      "items": [
        { "entityId": "payload", "value": 4.5 },
        { "entityId": "eps", "value": 3.2 },
        { "entityId": "obc", "value": 1.1 },
        { "entityId": "ttc", "value": 1.4 },
        { "entityId": "adcs", "value": 2.8 },
        { "entityId": "structure", "value": 5.0 }
      ]
    },
    {
      "id": "power_budget",
      "label": "Budget de potência",
      "unit": "W",
      "items": [
        { "entityId": "payload", "value": 18 },
        { "entityId": "obc", "value": 7 },
        { "entityId": "ttc", "value": 12 },
        { "entityId": "adcs", "value": 10 }
      ]
    }
  ],
  "verifications": [
    {
      "id": "ver_req_image",
      "requirementId": "req_image",
      "method": "Test",
      "level": "Subsystem",
      "status": "planned",
      "description": "Executar teste funcional do payload para demonstrar aquisição de imagem."
    }
  ],
  "views": {
    "defaultStep": 1,
    "maxStep": 10,
    "layout2D": "layered",
    "layout3D": "radial-fan"
  }
}
```

---

## 6. Validação com Zod

Criar `src/domain/schema/architectureSchema.ts`.

Regras mínimas:

1. `entities[].id` deve ser único.
2. `relationTypes[].id` deve ser único.
3. `relationTypes[].index` deve ser único.
4. Toda `relation.source` deve existir em `entities`.
5. Toda `relation.target` deve existir em `entities`.
6. Toda `relation.type` deve existir em `relationTypes`.
7. Toda entidade deve ter `category`.
8. Toda categoria usada por entidade deve existir em `categories`.
9. Toda relação deve ter `step`.
10. Toda entidade deve ter `step`.

Erros devem ser mostrados para o usuário de forma clara:

```txt
Erro no JSON:
Relação "rel_eps_obc_power" referencia source "eps2", mas não existe entidade com esse id.
```

---

## 7. Arquitetura interna esperada

### 7.1 Pastas

Criar ou reorganizar assim:

```txt
src/
  app/
    App.tsx
    AppShell.tsx

  domain/
    schema/
      architectureSchema.ts
    model/
      ArchitectureTypes.ts
      NormalizedArchitecture.ts
    parser/
      parseArchitecture.ts
      normalizeArchitecture.ts
      validateArchitecture.ts

  state/
    architectureStore.ts

  data/
    demoArchitecture.json

  components/
    layout/
      TopBar.tsx
      SidePanel.tsx
      BottomTimeline.tsx
      LegendPanel.tsx
      ViewModeTabs.tsx

    json/
      JsonUploadPanel.tsx
      JsonErrorPanel.tsx

    graph2d/
      ArchitectureFlow.tsx
      ArchitectureNode.tsx
      ArchitectureEdge.tsx
      RelationBadge.tsx
      GraphControls.tsx
      useFlowLayout.ts

    scene3d/
      ArchitectureScene.tsx
      EntityMesh.tsx
      RelationTube.tsx
      TextBillboard.tsx
      SceneMiniMap.tsx
      use3DLayout.ts

    shared/
      CategoryChip.tsx
      RelationTypeChip.tsx
      EmptyState.tsx
```

### 7.2 Estado global

Criar `architectureStore.ts` com:

```ts
type ViewMode = '2d' | '3d' | 'split';
type ExplorationMode = 'all' | 'step' | 'focus' | 'relationType' | 'category' | 'subsystem';

interface ArchitectureState {
  architecture: NormalizedArchitecture | null;
  selectedEntityId: string | null;
  selectedRelationId: string | null;
  currentStep: number;
  viewMode: ViewMode;
  explorationMode: ExplorationMode;
  visibleRelationTypes: string[];
  visibleCategories: string[];
  focusedSubsystemId: string | null;
}
```

Funções obrigatórias:

```ts
loadArchitectureFromJson(json)
selectEntity(id)
selectRelation(id)
setStep(step)
nextStep()
previousStep()
toggleRelationType(type)
toggleCategory(category)
setViewMode(mode)
setExplorationMode(mode)
focusSubsystem(id)
clearFocus()
```

---

## 8. Correções obrigatórias na visualização 2D

### 8.1 Layout por camadas

Usar uma organização visual fixa:

```txt
Camada 1: Missão
Camada 2: Objetivos / Requisitos
Camada 3: Funções
Camada 4: Segmentos / Sistemas
Camada 5: Subsistemas
Camada 6: Componentes
Camada 7: Interfaces / Verificações / Budgets
```

No React Flow:

- cada categoria deve ter posição-base;
- cada subsistema deve ficar em agrupamento visual;
- componentes filhos devem ficar próximos ao `parentId`;
- relações devem ser roteadas com curvatura;
- arestas paralelas devem ter deslocamento para não se sobrepor.

### 8.2 Nós

Cada nó deve mostrar:

- nome curto;
- tipo/categoria;
- ícone ou símbolo;
- cor de categoria;
- status, se existir;
- destaque quando selecionado.

Não colocar descrições longas dentro dos nós.  
Descrições longas ficam no painel lateral.

### 8.3 Arestas

Cada aresta deve:

- usar a cor do `relationType`;
- usar estilo do `relationType`;
- mostrar seta quando `directed = true`;
- ter badge numérico no meio ou levemente acima da linha;
- mostrar label curto ao passar o mouse;
- destacar source e target quando selecionada;
- aumentar espessura quando conectar categorias diferentes.

Exemplo visual esperado:

```txt
[EPS] ───── ③ ─────▶ [OBC]
         Fornece potência
```

O número `③` vem de `relationTypes[].index`.

### 8.4 Badge numérico

Criar componente `RelationBadge`.

Regras:

- formato circular ou pill;
- fundo com a cor da relação;
- texto branco;
- sombra;
- posição acima da aresta;
- tamanho suficiente para ser lido;
- tooltip com:
  - nome da relação;
  - source;
  - target;
  - descrição;
  - label.

### 8.5 Legenda obrigatória

Criar painel de legenda sempre visível ou recolhível:

```txt
① Satisfaz requisito        azul
② Alocado para             verde-água tracejado
③ Fornece potência         laranja
④ Envia dados              ciano
⑤ Recebe comando           roxo pontilhado
⑥ Fixação mecânica         cinza
⑦ Acoplamento térmico      vermelho tracejado
⑧ Verifica                 verde
```

Ao clicar em um item da legenda:

- filtrar/alternar visibilidade daquele tipo de relação;
- reduzir opacidade dos demais;
- atualizar 2D e 3D ao mesmo tempo.

### 8.6 Filtros obrigatórios

Implementar filtros:

- por etapa;
- por categoria;
- por subsistema;
- por tipo de relação;
- por elemento selecionado.

Quando selecionar um nó:

- mostrar o nó com destaque;
- mostrar relações de entrada e saída;
- reduzir opacidade dos elementos não conectados;
- painel lateral mostra detalhes técnicos.

### 8.7 Modo etapa no 2D

Criar barra inferior com etapas:

```txt
Missão → Requisitos → Funções → Subsistemas → Componentes → Interfaces → Budgets → Verificação
```

Botões:

- anterior;
- próximo;
- mostrar tudo;
- reiniciar.

Comportamento:

- até a etapa atual, elementos aparecem;
- elementos futuros ficam ocultos;
- novas entidades entram com animação suave;
- relações só aparecem quando source e target já existem na etapa atual.

---

## 9. Correções obrigatórias na visualização 3D

### 9.1 Ideia visual

O 3D não precisa ser fisicamente realista.  
Ele deve ser uma representação espacial intuitiva da arquitetura.

Usar geometria simples:

```txt
Missão: esfera central superior
Requisitos: placas/painéis ao redor da missão
Funções: cápsulas intermediárias
Subsistemas: blocos principais em anel
Componentes: blocos menores próximos ao subsistema pai
Verificações: diamantes/checkpoints em camada externa
Relações: tubos/linhas coloridas
```

### 9.2 Layout 3D recomendado

Usar layout `radial-fan`.

Organização:

```txt
Centro: missão
Anel 1: requisitos
Anel 2: funções
Anel 3: subsistemas
Anel 4: componentes
Anel 5: verificações
```

Exemplo espacial:

```txt
                 [Verificações]

      [Payload]     [ADCS]     [TT&C]

             [Funções / Requisitos]

                   [Missão]

      [EPS]         [OBC]      [Estrutura]
```

### 9.3 Posições 3D

Se o JSON trouxer `position3D`, usar a posição do usuário.  
Se não trouxer, calcular automaticamente.

Regra:

```ts
if (entity.position3D exists) {
  use entity.position3D
} else {
  use computedRadialFanLayout(entity.category, entity.parentId, index)
}
```

### 9.4 Geometrias por categoria

Usar:

```txt
mission       → esfera grande
requirement   → painel fino
function      → cápsula/cilindro arredondado
subsystem     → caixa grande
component     → caixa pequena
verification  → diamante ou octaedro
budget        → barra/medidor
```

### 9.5 Relações 3D

Cada relação deve virar um tubo/linha 3D:

- cor igual à relação 2D;
- número igual à relação 2D;
- espessura maior para relações entre categorias diferentes;
- pequena seta para relações direcionadas;
- curva suave em vez de linha reta quando houver risco de cruzamento visual;
- tooltip ao passar mouse;
- destaque ao clicar.

### 9.6 Labels sem sobreposição

Não renderizar todos os textos grandes o tempo todo.

Regra obrigatória:

```txt
Labels permanentes:
- apenas nós principais;
- apenas entidade selecionada;
- apenas relações selecionadas;
- labels sempre como billboard voltado para a câmera.

Labels secundários:
- aparecem no hover;
- aparecem no painel lateral;
- desaparecem quando a câmera afasta.
```

Implementar `TextBillboard.tsx` com Drei `<Text />`.

Regras de posicionamento:

- label acima do objeto;
- deslocamento vertical por categoria;
- evitar label no centro do tubo;
- se muitos elementos próximos, mostrar apenas ícone + tooltip.

### 9.7 Minimapa 3D

Criar `SceneMiniMap.tsx`.

O minimapa deve mostrar:

- visão superior simplificada;
- pontos coloridos por categoria;
- entidade selecionada com contorno;
- câmera atual como pequeno cone ou marcador;
- clique no minimapa move/foca a câmera, se viável.

Versão simples aceitável:

- painel 2D sobreposto no canto inferior direito;
- pontos por entidade;
- linhas principais;
- sem física complexa.

### 9.8 Navegação 3D

Adicionar:

- OrbitControls;
- botão “centralizar missão”;
- botão “focar selecionado”;
- botão “mostrar tudo”;
- botão “modo leque”;
- botão “modo compacto”.

Ao clicar em um subsistema:

- câmera aproxima;
- subsistema e componentes filhos ficam destacados;
- demais elementos ficam transparentes;
- relações conectadas ficam mais espessas.

### 9.9 Modo etapa no 3D

No modo por etapas:

- elementos futuros somem;
- anéis aparecem um por vez;
- subsistemas podem se abrir como leque;
- componentes surgem ao redor do subsistema pai;
- relações aparecem depois dos nós.

Animação desejada:

```txt
Missão aparece no centro.
Requisitos orbitam ao redor.
Funções surgem entre requisitos e subsistemas.
Subsistemas se abrem radialmente.
Componentes se expandem em volta dos subsistemas.
Interfaces coloridas conectam os blocos.
Verificações aparecem como checkpoints externos.
```

---

## 10. Painel lateral obrigatório

Quando nada estiver selecionado:

- mostrar resumo da missão;
- número de entidades;
- número de relações;
- categorias existentes;
- tipos de relação;
- budgets principais.

Quando uma entidade estiver selecionada:

- nome;
- categoria;
- descrição;
- parentId;
- requisitos associados;
- funções associadas;
- relações de entrada;
- relações de saída;
- budgets;
- verificações;
- riscos, se existirem.

Quando uma relação estiver selecionada:

- tipo;
- número;
- cor;
- source;
- target;
- label;
- descrição;
- criticality;
- step;
- interpretação técnica.

Exemplo de interpretação:

```txt
③ Fornece potência
EPS → OBC

Interpretação:
O subsistema de potência elétrica fornece energia regulada ao computador de bordo.
Esta é uma interface crítica porque falha de potência pode comprometer comando, telemetria e controle da missão.
```

---

## 11. UI visualmente incrível, mas simples

### 11.1 Estilo visual

Adotar visual de “mission control / digital engineering”.

Características:

- fundo escuro;
- cards translúcidos;
- bordas suaves;
- sombras leves;
- cores vivas para relações;
- tipografia limpa;
- animações suaves;
- painel lateral elegante;
- legenda clara;
- sem excesso de informação na tela.

### 11.2 Layout da tela

```txt
┌────────────────────────────────────────────────────┐
│ TopBar: nome do projeto | Upload JSON | 2D | 3D    │
├───────────────┬───────────────────────┬────────────┤
│ Legenda       │ Visualização 2D/3D     │ Painel     │
│ Filtros       │                       │ Detalhes   │
│ Categorias    │                       │            │
├───────────────┴───────────────────────┴────────────┤
│ Timeline de etapas                                  │
└────────────────────────────────────────────────────┘
```

### 11.3 Não poluir a tela

Regra:

```txt
Informação estrutural na cena.
Informação detalhada no painel lateral.
Informação de significado na legenda.
Informação temporal na timeline.
```

---

## 12. Controles necessários

### 12.1 Controles gerais

- Upload JSON.
- Carregar demo.
- Resetar visualização.
- Alternar 2D/3D/Split.
- Mostrar tudo.
- Modo etapa.
- Modo foco.
- Exportar estado atual, opcional.

### 12.2 Controles de relação

- Mostrar/ocultar cada tipo.
- Destacar uma relação.
- Filtrar relações entre categorias diferentes.
- Filtrar relações internas.
- Mostrar apenas interfaces críticas.

### 12.3 Controles de categoria

- Mostrar/ocultar missão.
- Mostrar/ocultar requisitos.
- Mostrar/ocultar funções.
- Mostrar/ocultar subsistemas.
- Mostrar/ocultar componentes.
- Mostrar/ocultar verificações.
- Mostrar/ocultar budgets.

---

## 13. Regras de consistência entre 2D e 3D

Obrigatório:

| Elemento | 2D | 3D |
|---|---|---|
| Categoria | cor/ícone/forma | geometria/cor |
| Relação | cor/linha/badge | tubo/cor/badge |
| Número da relação | badge na aresta | badge no tubo ou próximo dele |
| Seleção | nó e arestas destacadas | objeto e tubos destacados |
| Filtro | oculta ou reduz opacidade | oculta ou reduz opacidade |
| Etapa | mostra progressivamente | abre progressivamente |
| Legenda | controla grafo | controla cena |

---

## 14. Regras de renderização das relações

Criar função única:

```ts
getRelationVisualStyle(relation, relationType, sourceEntity, targetEntity)
```

Ela deve retornar:

```ts
{
  color: string;
  strokeWidth: number;
  opacity: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  badgeLabel: string;
  badgeColor: string;
  isCrossCategory: boolean;
  isDirected: boolean;
}
```

Lógica:

```ts
const isCrossCategory = source.category !== target.category;

strokeWidth = isCrossCategory ? 3.5 : 2;
opacity = isCrossCategory ? 1 : 0.55;
badgeLabel = String(relationType.index);
badgeColor = relationType.color;
```

Essa mesma função deve ser usada por:

- `ArchitectureEdge.tsx`;
- `RelationTube.tsx`;
- `LegendPanel.tsx`;
- `SidePanel.tsx`.

---

## 15. O que não fazer na V1

Não implementar agora:

- simulação orbital real;
- atitude real;
- dinâmica de controle;
- modelo térmico físico;
- FEA;
- CFD;
- banco de dados;
- backend;
- login;
- VR completo;
- multiplayer;
- autenticação;
- importação SysML;
- integração com hardware real.

Esses itens ficam como trabalhos futuros.

---

## 16. Critérios de aceite da V1

A versão só deve ser considerada correta se cumprir:

### JSON

- [ ] Usuário consegue carregar JSON.
- [ ] JSON inválido gera erro claro.
- [ ] JSON de demonstração carrega automaticamente.
- [ ] Tipos de relação são definidos pelo JSON.
- [ ] Cores e números vêm do JSON.

### 2D

- [ ] Nós aparecem agrupados por categoria.
- [ ] Relações aparecem com cores distintas.
- [ ] Cada relação mostra número destacado sobre a aresta.
- [ ] Relações entre categorias diferentes ficam mais destacadas.
- [ ] Legenda permite filtrar tipos de relação.
- [ ] Painel lateral mostra detalhes.
- [ ] Modo etapa funciona.
- [ ] Modo foco individual funciona.
- [ ] Linhas paralelas não ficam totalmente sobrepostas.
- [ ] Labels não poluem a visualização.

### 3D

- [ ] Subsistemas aparecem como blocos claros.
- [ ] Componentes aparecem próximos ao subsistema pai.
- [ ] Relações aparecem como tubos/linhas coloridas.
- [ ] Cores e números são consistentes com o 2D.
- [ ] Textos não ficam todos sobrepostos.
- [ ] Hover/seleção mostra informação.
- [ ] Minimapa aparece no canto.
- [ ] Câmera consegue focar elemento selecionado.
- [ ] Modo etapa abre a arquitetura progressivamente.
- [ ] Modo leque ou radial torna a estrutura compreensível.

### UX

- [ ] O usuário entende o significado das cores em menos de 10 segundos.
- [ ] O usuário entende o significado dos números em menos de 10 segundos.
- [ ] O usuário consegue selecionar um subsistema e ver suas relações.
- [ ] O usuário consegue esconder tipos de relação.
- [ ] O usuário consegue navegar da missão até verificações.
- [ ] A tela parece uma ferramenta de engenharia, não apenas um grafo genérico.

---

## 17. Implementação incremental recomendada

### Fase 1 — Corrigir modelo de dados

1. Criar `demoArchitecture.json`.
2. Criar schemas Zod.
3. Criar normalizador.
4. Criar store global.
5. Garantir que 2D e 3D usam a mesma arquitetura normalizada.

Entrega esperada:

```txt
JSON carregado, validado e disponível no estado global.
```

### Fase 2 — Corrigir 2D

1. Criar layout por camadas.
2. Criar nós por categoria.
3. Criar arestas por tipo de relação.
4. Criar badges numéricos.
5. Criar legenda filtrável.
6. Criar painel lateral.
7. Criar timeline de etapas.

Entrega esperada:

```txt
Grafo 2D claro, colorido, numerado e navegável.
```

### Fase 3 — Corrigir 3D

1. Criar layout radial/fan.
2. Criar geometrias por categoria.
3. Criar tubos coloridos para relações.
4. Criar labels com billboard.
5. Criar seleção e hover.
6. Criar minimapa.
7. Criar modo etapa/leque.

Entrega esperada:

```txt
Cena 3D intuitiva, limpa e consistente com o 2D.
```

### Fase 4 — Refinamento visual

1. Melhorar cores.
2. Melhorar espaçamentos.
3. Adicionar animações suaves.
4. Ajustar responsividade.
5. Melhorar mensagens de erro.
6. Melhorar demo para apresentação do TG.

Entrega esperada:

```txt
MVP apresentável para banca, com aparência profissional.
```

---

## 18. Prompt recomendado para Claude Code

Use o prompt abaixo para implementação:

```txt
Você está trabalhando em um MVP de TG de Engenharia Aeroespacial chamado:
"Sistema Imersivo de Modelagem e Simulação de Sistemas Espaciais em Ambiente Virtual".

Stack:
- Vite
- React
- TypeScript
- @xyflow/react
- Three.js
- @react-three/fiber
- @react-three/drei
- Zod
- Zustand

Objetivo:
Corrigir e implementar a V1 das visualizações 2D e 3D para uma arquitetura espacial descrita por JSON.

Requisitos principais:
1. Criar um JSON de arquitetura intuitivo como fonte única da verdade.
2. Validar o JSON com Zod.
3. Normalizar entidades, categorias, tipos de relação e relações.
4. Renderizar o grafo 2D com React Flow.
5. Renderizar a cena 3D com React Three Fiber.
6. Usar as mesmas cores, números e tipos de relação no 2D e no 3D.
7. Cada tipo de relação deve ter número visível em badge:
   - no 2D, em cima da aresta;
   - no 3D, próximo ao tubo/linha da relação.
8. Relações entre categorias diferentes devem ser visualmente mais destacadas.
9. Criar legenda filtrável por tipo de relação.
10. Criar filtros por categoria, subsistema e etapa.
11. Criar painel lateral para detalhes de entidade/relação.
12. Criar modo etapa para mostrar a arquitetura progressivamente.
13. Criar minimapa na cena 3D.
14. Evitar sobreposição de textos no 3D usando labels apenas para foco/hover/elementos principais.

Arquivos esperados:
- src/data/demoArchitecture.json
- src/domain/schema/architectureSchema.ts
- src/domain/model/ArchitectureTypes.ts
- src/domain/parser/validateArchitecture.ts
- src/domain/parser/normalizeArchitecture.ts
- src/state/architectureStore.ts
- src/components/graph2d/ArchitectureFlow.tsx
- src/components/graph2d/ArchitectureNode.tsx
- src/components/graph2d/ArchitectureEdge.tsx
- src/components/graph2d/RelationBadge.tsx
- src/components/graph2d/useFlowLayout.ts
- src/components/scene3d/ArchitectureScene.tsx
- src/components/scene3d/EntityMesh.tsx
- src/components/scene3d/RelationTube.tsx
- src/components/scene3d/TextBillboard.tsx
- src/components/scene3d/SceneMiniMap.tsx
- src/components/scene3d/use3DLayout.ts
- src/components/layout/LegendPanel.tsx
- src/components/layout/SidePanel.tsx
- src/components/layout/BottomTimeline.tsx
- src/components/layout/ViewModeTabs.tsx
- src/components/json/JsonUploadPanel.tsx
- src/components/json/JsonErrorPanel.tsx

Critérios de aceite:
- O demo JSON carrega sem erro.
- JSON inválido exibe erro claro.
- 2D mostra nós agrupados e relações coloridas.
- Toda relação 2D mostra badge numérico.
- 3D mostra blocos, tubos coloridos e labels sem sobreposição excessiva.
- Legenda filtra relações no 2D e no 3D.
- Timeline permite navegação por etapas.
- Selecionar nó/relação atualiza painel lateral.
- A interface final deve ser visualmente limpa, moderna e adequada a uma apresentação acadêmica.
```

---

## 19. Resultado esperado para apresentação do TG

A demonstração final da V1 deve permitir narrar:

```txt
O usuário fornece uma arquitetura espacial em JSON.
O sistema valida essa arquitetura.
Em seguida, a arquitetura é transformada em uma rede de entidades e relações.
No 2D, a rede mostra requisitos, funções, subsistemas, componentes, interfaces e verificações.
Cada tipo de relação possui cor e número próprio.
No 3D, a mesma arquitetura é representada espacialmente por geometrias simples.
O usuário pode navegar por etapas, focar em subsistemas, filtrar relações e entender a rastreabilidade.
```

Essa narrativa é o centro do TG:  
**um sistema espacial é uma rede rastreável de missão, requisitos, funções, componentes, interfaces, budgets e verificações.**

---

## 20. Definição de pronto

A V1 está pronta quando:

1. A demo abre sem configuração manual.
2. O usuário entende visualmente o sistema sem ler documentação extensa.
3. O JSON é simples o bastante para ser editado manualmente.
4. 2D e 3D contam a mesma história.
5. Relações são o elemento principal da experiência.
6. A visualização por etapas funciona.
7. O resultado parece bom em tela cheia para apresentação.
8. O software demonstra claramente valor acadêmico para engenharia de sistemas espaciais.
