import { useState } from 'react';
import { useArchitectureStore } from '../../state/architectureStore';

const MINIMAL_JSON = `{
  "metadata": {
    "projectName": "Minha Arquitetura",
    "version": "0.1.0",
    "description": "Descrição curta da arquitetura."
  },
  "mission": {
    "id": "mission_x",
    "name": "Minha missão",
    "objectives": ["Objetivo 1", "Objetivo 2"]
  },
  "categories": [
    { "id": "mission",      "label": "Missão",      "color": "#a855f7", "shape3D": "sphere"    },
    { "id": "requirement",  "label": "Requisito",   "color": "#2563eb", "shape3D": "flatPanel" },
    { "id": "subsystem",    "label": "Subsistema",  "color": "#22c55e", "shape3D": "box"       },
    { "id": "component",    "label": "Componente",  "color": "#eab308", "shape3D": "smallBox"  }
  ],
  "relationTypes": [
    { "id": "satisfies",          "index": 1, "label": "Satisfaz",          "color": "#2563eb", "lineStyle": "solid",  "directed": true,  "description": "Source satisfaz o requisito target." },
    { "id": "provides_power_to",  "index": 2, "label": "Fornece potência",  "color": "#f59e0b", "lineStyle": "solid",  "directed": true,  "description": "Source fornece energia para target." }
  ],
  "entities": [
    { "id": "mission_x", "name": "Minha Missão",      "category": "mission",     "step": 1, "description": "..." },
    { "id": "req_1",     "name": "REQ-001 · Fazer X", "category": "requirement", "step": 3, "description": "..." },
    { "id": "eps",       "name": "EPS · Potência",    "category": "subsystem",   "step": 6, "description": "..." },
    { "id": "obc",       "name": "OBC",               "category": "subsystem",   "step": 6, "description": "..." },
    { "id": "bat",       "name": "Bateria",           "category": "component",   "step": 7, "parentId": "eps", "description": "..." }
  ],
  "relations": [
    { "id": "rel_eps_obc", "type": "provides_power_to", "source": "eps", "target": "obc", "label": "28 V", "step": 8 },
    { "id": "rel_eps_req", "type": "satisfies",         "source": "eps", "target": "req_1", "step": 9 }
  ],
  "views": { "defaultStep": 9, "maxStep": 10 }
}`;

/**
 * Tutorial view — explains the JSON model that the platform expects, step
 * by step, with copy-pasteable examples and the validation rules the
 * platform applies (mirrors validateArchitecture.ts).
 */
export function TutorialView() {
  const [activeSection, setActiveSection] = useState('intro');
  const setViewMode = useArchitectureStore((s) => s.setViewMode);
  const resetToDemo = useArchitectureStore((s) => s.resetToDemo);

  const sections: { key: string; label: string }[] = [
    { key: 'intro',         label: '1. O que é a plataforma' },
    { key: 'overview',      label: '2. Estrutura geral do JSON' },
    { key: 'metadata',      label: '3. metadata + mission' },
    { key: 'categories',    label: '4. categories' },
    { key: 'relationTypes', label: '5. relationTypes' },
    { key: 'entities',      label: '6. entities' },
    { key: 'relations',     label: '7. relations' },
    { key: 'extras',        label: '8. budgets · verifications · risks' },
    { key: 'breakdown',     label: '9. Códigos PBS (rastreabilidade)' },
    { key: 'validation',    label: '10. Regras de validação' },
    { key: 'example',       label: '11. Exemplo mínimo' },
    { key: 'tips',          label: '12. Dicas de modelagem' },
  ];

  return (
    <div className="tutorial-view">
      <aside className="tutorial-toc">
        <div className="tutorial-toc__head">Tutorial</div>
        <ul>
          {sections.map((s) => (
            <li key={s.key}>
              <button
                className={`tutorial-toc__btn${activeSection === s.key ? ' is-on' : ''}`}
                onClick={() => setActiveSection(s.key)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="tutorial-toc__actions">
          <button className="tutorial-toc__cta" onClick={() => { setViewMode('2d'); }}>
            Voltar à arquitetura
          </button>
          <button className="tutorial-toc__cta tutorial-toc__cta--ghost" onClick={() => resetToDemo()}>
            Resetar demo
          </button>
        </div>
      </aside>

      <article className="tutorial-content">
        {activeSection === 'intro'         && <SectionIntro setViewMode={setViewMode} />}
        {activeSection === 'overview'      && <SectionOverview />}
        {activeSection === 'metadata'      && <SectionMetadata />}
        {activeSection === 'categories'    && <SectionCategories />}
        {activeSection === 'relationTypes' && <SectionRelationTypes />}
        {activeSection === 'entities'      && <SectionEntities />}
        {activeSection === 'relations'     && <SectionRelations />}
        {activeSection === 'extras'        && <SectionExtras />}
        {activeSection === 'breakdown'     && <SectionBreakdown />}
        {activeSection === 'validation'    && <SectionValidation />}
        {activeSection === 'example'       && <SectionExample />}
        {activeSection === 'tips'          && <SectionTips />}
      </article>
    </div>
  );
}

/* ── Section components ─────────────────────────────────────── */

function SectionIntro({ setViewMode }: { setViewMode: (m: 'tutorial' | '2d' | '3d' | 'split') => void }) {
  return (
    <Section title="1. O que é a plataforma">
      <p>
        Este é um <strong>sistema imersivo de modelagem e simulação de sistemas espaciais em ambiente virtual</strong>.
        Você descreve a arquitetura da missão em <em>um único arquivo JSON</em> e a ferramenta gera quatro coisas
        de uma só vez:
      </p>
      <Cards>
        <Card title="Grafo 2D"     hint="Diagrama por camadas. Cada categoria vira uma faixa, cada relação numerada vira uma aresta colorida." />
        <Card title="Cena 3D"      hint="Layout radial-fan com missão no centro, requisitos / funções / subsistemas em anéis, tubos coloridos para relações." />
        <Card title="Painel"        hint="Detalhes da entidade ou relação selecionada — descrição, categoria, budgets, verificações, criticidade e cadeia de rastreabilidade." />
        <Card title="Timeline"     hint="Modo &quot;por etapas&quot; — a arquitetura é construída progressivamente, missão → requisitos → funções → subsistemas → componentes → interfaces → verificações." />
      </Cards>
      <p>
        O JSON é a <strong>fonte única da verdade</strong>: a mesma cor, o mesmo número de relação, o mesmo código
        de breakdown aparecem em todas as visualizações. Edite o JSON e tudo é regenerado.
      </p>
      <Callout>
        Você está numa página de tutorial. As outras abas ({' '}
        <a onClick={(e) => { e.preventDefault(); setViewMode('2d'); }} href="#" className="tutorial-link">Grafo 2D</a>,{' '}
        <a onClick={(e) => { e.preventDefault(); setViewMode('3d'); }} href="#" className="tutorial-link">Cena 3D</a>,{' '}
        <a onClick={(e) => { e.preventDefault(); setViewMode('split'); }} href="#" className="tutorial-link">Lado a lado</a>
        ) mostram a arquitetura carregada no momento.
      </Callout>
    </Section>
  );
}

function SectionOverview() {
  return (
    <Section title="2. Estrutura geral do JSON">
      <p>O arquivo tem 8 blocos principais. Apenas <code>metadata</code>, <code>categories</code>, <code>relationTypes</code>, <code>entities</code> e <code>relations</code> são obrigatórios.</p>
      <Code>{`{
  "metadata": { ... },          // nome, versão, descrição
  "mission": { ... },           // missão (opcional)
  "categories": [ ... ],        // tipos de entidade (Missão, Requisito, Subsistema, ...)
  "relationTypes": [ ... ],     // tipos de relação numerados (1, 2, 3, ...)
  "entities": [ ... ],          // os blocos da arquitetura
  "relations": [ ... ],         // arestas entre blocos
  "budgets": [ ... ],           // budgets agregados (opcional)
  "verifications": [ ... ],     // verificações que fecham requisitos (opcional)
  "risks": [ ... ],             // riscos (opcional)
  "views": { ... }              // configurações de visualização (opcional)
}`}</Code>
      <Callout>
        Os arrays de <code>categories</code>, <code>relationTypes</code>, <code>entities</code> e <code>relations</code> sempre precisam ter pelo menos 1 item — caso contrário não há o que desenhar.
      </Callout>
    </Section>
  );
}

function SectionMetadata() {
  return (
    <Section title="3. metadata + mission">
      <p><code>metadata</code> identifica o projeto. <code>mission</code> é opcional mas recomendado — ele aparece no topo do painel de detalhes quando nada está selecionado.</p>
      <Code>{`"metadata": {
  "projectName": "DemoSat-TG",
  "version": "1.0.0",
  "description": "Arquitetura conceitual de um satélite de observação da Terra."
},
"mission": {
  "id": "mission_demosat",
  "name": "Missão DemoSat-TG — Observação da Terra",
  "objectives": [
    "Coletar imagens multiespectrais de regiões de interesse.",
    "Transmitir dados de missão para a estação solo."
  ]
}`}</Code>
    </Section>
  );
}

function SectionCategories() {
  return (
    <Section title="4. categories — tipos de entidade">
      <p>Cada categoria define <strong>como aquele tipo de bloco aparece</strong> visualmente. As 6 categorias canônicas que a ferramenta entende automaticamente (com ringue 3D próprio) são: <code>mission</code>, <code>requirement</code>, <code>function</code>, <code>subsystem</code>, <code>component</code>, <code>verification</code>. Você pode adicionar outras — elas vão para o ringue padrão.</p>
      <Code>{`"categories": [
  { "id": "mission",      "label": "Missão",      "color": "#a855f7", "shape2D": "hexagon",  "shape3D": "sphere"    },
  { "id": "requirement",  "label": "Requisito",   "color": "#2563eb", "shape2D": "document", "shape3D": "flatPanel" },
  { "id": "function",     "label": "Função",      "color": "#14b8a6", "shape2D": "rounded",  "shape3D": "capsule"   },
  { "id": "subsystem",    "label": "Subsistema",  "color": "#22c55e", "shape2D": "group",    "shape3D": "box"       },
  { "id": "component",    "label": "Componente",  "color": "#eab308", "shape2D": "box",      "shape3D": "smallBox"  },
  { "id": "verification", "label": "Verificação", "color": "#ef4444", "shape2D": "check",    "shape3D": "diamond"   }
]`}</Code>
      <p><strong>shape2D</strong>: hexagon · document · rounded · group · box · check · diamond.</p>
      <p><strong>shape3D</strong>: sphere · flatPanel · capsule · box · smallBox · diamond · bar.</p>
      <p><strong>color</strong>: hex (#rgb ou #rrggbb). A mesma cor é usada nas duas visualizações e na legenda.</p>
    </Section>
  );
}

function SectionRelationTypes() {
  return (
    <Section title="5. relationTypes — tipos de relação numerados">
      <p>Aqui está o coração da rastreabilidade: cada <strong>tipo de relação recebe um número único</strong> (<code>index</code>) que aparece como badge sobre cada aresta no 2D e como esfera flutuante no 3D.</p>
      <Code>{`"relationTypes": [
  { "id": "satisfies",                "index": 1, "label": "Satisfaz requisito",   "color": "#2563eb", "lineStyle": "solid",  "directed": true,  "description": "Função/subsistema satisfaz um requisito." },
  { "id": "allocated_to",             "index": 2, "label": "Alocado para",         "color": "#14b8a6", "lineStyle": "dashed", "directed": true,  "description": "Alocação de requisito ou função." },
  { "id": "provides_power_to",        "index": 3, "label": "Fornece potência",     "color": "#f59e0b", "lineStyle": "solid",  "directed": true,  "description": "Fornecimento de energia elétrica." },
  { "id": "sends_data_to",            "index": 4, "label": "Envia dados",          "color": "#06b6d4", "lineStyle": "solid",  "directed": true,  "description": "Telemetria ou payload data." },
  { "id": "receives_command_from",    "index": 5, "label": "Recebe comando",       "color": "#8b5cf6", "lineStyle": "dotted", "directed": true,  "description": "Telecomando." },
  { "id": "mechanically_attached_to", "index": 6, "label": "Fixação mecânica",     "color": "#64748b", "lineStyle": "solid",  "directed": false, "description": "Acoplamento estrutural." },
  { "id": "thermally_coupled_to",     "index": 7, "label": "Acoplamento térmico",  "color": "#dc2626", "lineStyle": "dashed", "directed": false, "description": "Troca/acoplamento térmico." },
  { "id": "verifies",                 "index": 8, "label": "Verifica",             "color": "#16a34a", "lineStyle": "solid",  "directed": true,  "description": "Verificação confirma requisito." }
]`}</Code>
      <p><strong>Convenção MBSE/SysML</strong> usada acima:</p>
      <ul className="tutorial-list">
        <li><code>satisfies</code> — source (função/subsistema) <em>satisfaz</em> o requisito target. Direção fixa.</li>
        <li><code>allocated_to</code> — alocação de requisito → função, ou função → subsistema. Padrão MBSE de "allocation".</li>
        <li><code>verifies</code> — verificação que fecha o loop "V" do V&amp;V (Verification &amp; Validation, INCOSE).</li>
        <li>As demais (power, data, command, mechanical, thermal) são <em>interfaces físicas</em> entre subsistemas — convenção de espaço-naval.</li>
      </ul>
      <p><strong>lineStyle</strong>: solid · dashed · dotted. <strong>directed</strong>: true mostra seta no 2D e ponta de seta no 3D.</p>
    </Section>
  );
}

function SectionEntities() {
  return (
    <Section title="6. entities — os blocos">
      <p>Cada entidade precisa de <code>id</code>, <code>name</code>, <code>category</code>, <code>description</code> e <code>step</code>. Os outros campos são opcionais.</p>
      <Code>{`{
  "id": "eps",                       // único, [A-Za-z0-9_-]
  "name": "EPS · Subsistema de Potência",
  "category": "subsystem",           // deve existir em "categories"
  "description": "Painéis solares, bateria, PCDU regulando 28 V.",
  "parentId": "structure",           // opcional: hierarquia física
  "subsystem": "EPS",                // opcional: agrupamento 3D
  "step": 6,                         // etapa em que esta entidade aparece (1..maxStep)
  "status": "in_progress",           // opcional: planned|in_progress|passed|failed|verified|waived
  "budgets": [
    { "kind": "mass",  "allocated": 4.0, "estimated": 3.2, "unit": "kg" },
    { "kind": "power", "allocated": 60,  "estimated": 56,  "unit": "W"  }
  ],
  "position2D": { "x": 0, "y": 0 },  // opcional: força posição manual no 2D
  "position3D": { "x": 0, "y": 0, "z": 0 }  // opcional: força posição manual no 3D
}`}</Code>
      <p><strong>parentId</strong> é o que gera o código hierárquico — uma <code>component</code> com <code>parentId: "eps"</code> ganha o código <code>1.X.Y</code> onde X é o índice do EPS.</p>
    </Section>
  );
}

function SectionRelations() {
  return (
    <Section title="7. relations — as arestas">
      <p>Cada relação conecta duas entidades. O tipo determina cor, forma da linha, número do badge e direção.</p>
      <Code>{`{
  "id": "rel_eps_obc_power",
  "type": "provides_power_to",       // deve existir em "relationTypes"
  "source": "eps",                   // deve existir em "entities"
  "target": "obc",                   // deve existir em "entities"
  "label": "Barramento 28 V regulado",
  "description": "...",
  "step": 8,                         // etapa em que esta relação aparece
  "criticality": "high"              // opcional: low|medium|high|critical
}`}</Code>
      <p>Quando <code>source.category</code> ≠ <code>target.category</code>, a relação é <strong>cross-category</strong> e fica visualmente mais pesada (linha mais grossa, opacidade total). Relações <em>dentro da mesma categoria</em> ficam suaves.</p>
      <p>Relações com <code>criticality</code> alta ganham um pouco mais de espessura e sempre exibem badge no 3D.</p>
    </Section>
  );
}

function SectionExtras() {
  return (
    <Section title="8. budgets · verifications · risks">
      <p>Três blocos opcionais que alimentam o painel de detalhes.</p>
      <h4>budgets</h4>
      <Code>{`"budgets": [
  {
    "id": "mass_budget",
    "label": "Budget de massa",
    "unit": "kg",
    "items": [
      { "entityId": "payload", "value": 5.6 },
      { "entityId": "eps",     "value": 3.2 }
    ]
  }
]`}</Code>
      <h4>verifications</h4>
      <Code>{`"verifications": [
  { "id": "ver_image_test", "requirementId": "req_image", "method": "Test",     "level": "Subsystem", "status": "planned", "description": "..." },
  { "id": "ver_thermal",    "requirementId": "req_thermal","method": "Analysis", "level": "Subsystem", "status": "passed",  "description": "..." }
]`}</Code>
      <p><strong>method</strong>: Test · Analysis · Inspection · Review of Design · Demonstration (vocabulário INCOSE).</p>
      <h4>risks</h4>
      <Code>{`"risks": [
  { "id": "risk_thermal", "title": "...", "probability": 3, "impact": 4, "mitigation": "...", "status": "open" }
]`}</Code>
      <p><strong>probability</strong> e <strong>impact</strong> de 1 a 5 (matriz 5×5). <strong>status</strong>: open · mitigated · accepted · closed.</p>
    </Section>
  );
}

function SectionBreakdown() {
  return (
    <Section title="9. Códigos PBS — rastreabilidade hierárquica">
      <p>
        A plataforma <strong>computa automaticamente um código hierárquico</strong> para cada entidade, no padrão
        PBS / WBS (Product / Work Breakdown Structure) da engenharia de sistemas.
      </p>
      <Cards>
        <Card title="Missão"     hint="Recebe o código 1." />
        <Card title="Subsistemas"hint="Filhos da missão. Códigos 1.1, 1.2, 1.3, …" />
        <Card title="Componentes"hint="Filhos do parentId. Códigos 1.2.1, 1.2.2, … sob o subsistema 1.2." />
        <Card title="Requisitos" hint="Numeração flat: R-001, R-002, …" />
        <Card title="Funções"    hint="F-001, F-002, …" />
        <Card title="Verificações"hint="V-001, V-002, …" />
      </Cards>
      <p>
        O código aparece <strong>como chip no canto do nó 2D</strong>, <strong>como label flutuante no 3D</strong>,
        e como <strong>cadeia de rastreabilidade</strong> no painel lateral quando você seleciona um elemento — o painel
        mostra Missão → Requisito → Função → Subsistema → Componente, fechando com a Verificação correspondente.
      </p>
      <Callout>
        Você não escreve o código no JSON — a ferramenta calcula a partir de <code>category</code> + <code>parentId</code>.
        Se você quiser controlar a ordem, basta ordenar as entidades dentro de <code>entities</code> na sequência desejada.
      </Callout>
    </Section>
  );
}

function SectionValidation() {
  return (
    <Section title="10. Regras de validação">
      <p>Ao carregar um JSON, a plataforma valida com Zod e cross-references. Se algo der errado, uma sobreposição vermelha mostra cada problema com caminho e descrição em português.</p>
      <ul className="tutorial-list">
        <li><strong>Schema (Zod):</strong> tipos, campos obrigatórios, cores em hex, ids no padrão <code>[A-Za-z0-9_-]</code>.</li>
        <li><strong>Ids únicos</strong> em <code>entities</code>, <code>relations</code>, <code>relationTypes</code>, <code>categories</code>.</li>
        <li><strong>Index único</strong> dentro de <code>relationTypes</code> (cada tipo precisa do seu número próprio).</li>
        <li><strong>Cross-refs:</strong> <code>relation.source</code> / <code>relation.target</code> devem existir em <code>entities</code>; <code>relation.type</code> em <code>relationTypes</code>; <code>entity.category</code> em <code>categories</code>; <code>entity.parentId</code> em <code>entities</code>.</li>
        <li><strong>Verificações</strong> precisam apontar para um <code>requirementId</code> válido.</li>
        <li><strong>Budgets</strong> precisam apontar para <code>entityId</code>s válidos.</li>
      </ul>
    </Section>
  );
}

function SectionExample() {
  const onCopy = () => navigator.clipboard?.writeText(MINIMAL_JSON);
  return (
    <Section title="11. Exemplo mínimo (copie, salve como .json, carregue)">
      <p>O exemplo abaixo é o mínimo necessário para a plataforma desenhar 2D, 3D, breakdown codes e a timeline.</p>
      <div className="tutorial-code-wrap">
        <button className="tutorial-copy" onClick={onCopy}>Copiar</button>
        <Code>{MINIMAL_JSON}</Code>
      </div>
      <p>Cole isso em <code>minha-arquitetura.json</code> e use <strong>Carregar JSON</strong> no topo direito.</p>
    </Section>
  );
}

function SectionTips() {
  return (
    <Section title="12. Dicas de modelagem">
      <ul className="tutorial-list">
        <li><strong>Comece pela missão e pelos requisitos.</strong> Eles são o "porquê" — tudo se alinha a eles via <code>satisfies</code>.</li>
        <li><strong>Use poucas relações na mesma direção.</strong> Se você modelar power, data e command separadamente, a legenda fica clara. Se misturar tudo em "depends_on", todas as setas parecem iguais.</li>
        <li><strong>Atribua step crescente</strong> conforme a fidelidade aumenta. Missão step 1, requisitos step 3, subsistemas step 6, componentes step 7, interfaces step 8. Isso faz o modo "Por etapas" contar uma história.</li>
        <li><strong>Use <code>criticality: "high"</code></strong> nas relações que, se falharem, derrubam a missão. Elas ficam visualmente mais densas.</li>
        <li><strong>Use <code>parentId</code></strong> para indicar pertencimento físico — componente sob subsistema. É isso que gera os códigos 1.X.Y.</li>
        <li><strong>Cores curtas, descrições longas.</strong> O <code>label</code> do tipo de relação aparece em chips pequenos. A <code>description</code> aparece no tooltip e no painel.</li>
        <li><strong>Não duplique informação no nome do nó.</strong> O painel lateral já mostra a descrição completa.</li>
      </ul>
    </Section>
  );
}

/* ── Small helpers ─────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="tutorial-section">
      <h2 className="tutorial-h2">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return <pre className="tutorial-code"><code>{children}</code></pre>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className="tutorial-callout">{children}</div>;
}

function Cards({ children }: { children: React.ReactNode }) {
  return <div className="tutorial-cards">{children}</div>;
}

function Card({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="tutorial-card">
      <div className="tutorial-card__title">{title}</div>
      <div className="tutorial-card__hint">{hint}</div>
    </div>
  );
}
