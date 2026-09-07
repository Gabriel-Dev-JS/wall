export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function formatMonthLabel(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
