import type { SafeParseReturnType } from 'zod';
import type { SystemModel } from '../../types';

interface JsonValidationStatusProps {
  validation: SafeParseReturnType<SystemModel, SystemModel>;
}

export function JsonValidationStatus({ validation }: JsonValidationStatusProps) {
  if (validation.success) {
    return (
      <div className="json-status">
        <span style={{ color: '#8be6ca' }}>JSON válido</span>
        <small className="summary-text">Modelo de dados consistente</small>
      </div>
    );
  }

  return (
    <div className="json-status" style={{ borderColor: '#ff6f6f' }}>
      <span style={{ color: '#ff8989' }}>JSON inválido</span>
      <small>{validation.error.issues.length} problema(s) encontrados</small>
    </div>
  );
}
