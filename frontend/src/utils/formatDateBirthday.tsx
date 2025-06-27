export function FormatBirthdate(value: string): string {
  // Remove tudo que não for número
  const cleaned = value.replace(/\D/g, "");

  // Aplica a máscara dd/mm/aaaa
  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);

  let formatted = day;
  if (month) formatted += `/${month}`;
  if (year) formatted += `/${year}`;

  return formatted;
}
