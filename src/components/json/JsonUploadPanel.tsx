import { useRef, useState } from 'react';
import { useArchitectureStore } from '../../state/architectureStore';

/**
 * Compact "Upload JSON / Reset to demo" control. Sits in the top bar.
 * Validation errors are shown in JsonErrorPanel.
 */
export function JsonUploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const loadArchitectureFromJson = useArchitectureStore((s) => s.loadArchitectureFromJson);
  const resetToDemo = useArchitectureStore((s) => s.resetToDemo);
  const jsonSourceName = useArchitectureStore((s) => s.jsonSourceName);

  const onFile = async (file: File) => {
    setLoading(true);
    try {
      const text = await file.text();
      try {
        const raw = JSON.parse(text);
        loadArchitectureFromJson(raw, file.name);
      } catch (parseErr) {
        const msg = parseErr instanceof Error ? parseErr.message : 'JSON inválido';
        useArchitectureStore.setState({
          lastIssues: [{ path: '(raiz)', message: `Não foi possível ler o arquivo como JSON: ${msg}` }],
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao ler o arquivo';
      useArchitectureStore.setState({
        lastIssues: [{ path: '(arquivo)', message: msg }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="json-upload">
      <button
        className="upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Carregando…' : 'Carregar JSON'}
      </button>
      <button className="upload-btn upload-btn--ghost" onClick={() => resetToDemo()}>
        Resetar para demo
      </button>
      {jsonSourceName && (
        <span className="json-source" title={jsonSourceName}>
          ◇ {jsonSourceName}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
