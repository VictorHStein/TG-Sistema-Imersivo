export function ExamplePanel() {
  return (
    <article className="panel-card panel-card--example">
      <h2>Como ficaria em uma versão de verdade</h2>
      <p>
        Esta interface é um MVP visual. A versão final ideal incluiria:
      </p>
      <ul>
        <li>Pesquisa e filtragem por missão, requisito, risco e item físico.</li>
        <li>Mapas de rastreabilidade interativos com seleção de cadeias completas.</li>
        <li>Indicadores de AIT/AIV, teste e estado de maturidade para cada subsistema.</li>
        <li>Dashboards de budget e risco com métricas por criticidade.</li>
        <li>Visão 3D imersiva do satélite com camadas de payload, bus e interfaces.</li>
      </ul>
      <p>
        Exemplo de cadeia de engenharia que a aplicação deve tornar óbvia:
      </p>
      <pre>{`MISSÃO → OBJETIVO → REQUISITO → FUNÇÃO → SISTEMA → COMPONENTE → INTERFACE → VERIFICAÇÃO`}</pre>
      <p>
        Um protótipo mais avançado incluiria também exportação de arquitetura, trilhas de auditoria e um tema mais corporativo para apresentações.
      </p>
    </article>
  );
}
