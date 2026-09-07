export type CategoryId =
  | 'alimentacao'
  | 'transporte'
  | 'veiculo'
  | 'moradia'
  | 'saude'
  | 'lazer'
  | 'educacao'
  | 'compras'
  | 'salario'
  | 'outros';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'alimentacao', label: 'Alimentação', icon: '🍔', color: '#F59E0B' },
  { id: 'transporte', label: 'Transporte (Uber/ônibus)', icon: '🚌', color: '#3B82F6' },
  { id: 'veiculo', label: 'Veículo próprio', icon: '🚗', color: '#0EA5E9' },
  { id: 'moradia', label: 'Moradia', icon: '🏠', color: '#8B5CF6' },
  { id: 'saude', label: 'Saúde', icon: '💊', color: '#F43F5E' },
  { id: 'lazer', label: 'Lazer', icon: '🎮', color: '#EC4899' },
  { id: 'educacao', label: 'Educação', icon: '📚', color: '#14B8A6' },
  { id: 'compras', label: 'Compras', icon: '🛍️', color: '#F97316' },
  { id: 'salario', label: 'Salário', icon: '💰', color: '#22C55E' },
  { id: 'outros', label: 'Outros', icon: '📦', color: '#6B7280' },
];

const FALLBACK_CATEGORY = CATEGORIES[CATEGORIES.length - 1];

export function getCategoryById(id: string): Category {
  return CATEGORIES.find((category) => category.id === id) ?? FALLBACK_CATEGORY;
}
