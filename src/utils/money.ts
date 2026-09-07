export function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function centsFromDigits(text: string): number {
  const digitsOnly = text.replace(/\D/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}
