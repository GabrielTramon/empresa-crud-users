// utils/FormatName.ts

export function FormatName(value: string): string {
    // Mantém apenas letras com acento e espaços
    let clean = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    clean = clean.replace(/\s{2,}/g, ' '); // remove espaços duplicados
  
    // Capitaliza cada palavra
    return clean
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  