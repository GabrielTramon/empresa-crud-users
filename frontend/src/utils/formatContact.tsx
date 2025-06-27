// utils/formatPhone.ts

/**
 * Formata número de telefone brasileiro com DDD.
 * Suporta formatos de celular e fixo.
 * Exemplo: (48) 99999-9999 ou (48) 3244-1234
 * @param value - string digitada
 * @returns string formatada
 */
export function FormatContact(value: string): string {
  const numeric = value.replace(/\D/g, ''); // Remove tudo que não for número

  // Aplica máscara
  if (numeric.length <= 10) {
    // Fixo: (99) 9999-9999
    return numeric
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Celular: (99) 99999-9999
    return numeric
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}
