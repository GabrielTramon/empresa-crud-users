// utils/formatNational.ts

/**
 * Formata o valor do CPF, removendo tudo que não for número
 * e aplicando o formato 000.000.000-00 (se possível).
 * @param value - string digitada
 * @returns string formatada
 */
export function FormatNational(value: string): string {
    // Remove tudo que não for número
    const numeric = value.replace(/\D/g, '');
  
    // Aplica máscara de CPF: 000.000.000-00
    const formatted = numeric
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  
    return formatted;
  }
  