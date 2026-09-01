/**
 * HomeModel
 * Dados estáticos da home (categorias, banners, restaurantes).
 * Quando o back-end tiver endpoints de restaurantes, substitua aqui.
 */

export const categories = [
  { id: 1,  icon: '🍔', label: 'Lanches' },
  { id: 2,  icon: '🍕', label: 'Pizza' },
  { id: 3,  icon: '🌮', label: 'Mexicano' },
  { id: 4,  icon: '🍣', label: 'Japonês' },
  { id: 5,  icon: '🍗', label: 'Frango' },
  { id: 6,  icon: '🥗', label: 'Saudável' },
  { id: 7,  icon: '🍦', label: 'Sobremesas' },
  { id: 8,  icon: '🥤', label: 'Bebidas' },
  { id: 9,  icon: '🍝', label: 'Italiana' },
  { id: 10, icon: '🥪', label: 'Padaria' },
  { id: 11, icon: '🍜', label: 'Chinês' },
  { id: 12, icon: '🐟', label: 'Frutos do mar' },
]

export const banners = [
  { id: 1, bg: '#EA1D2C', title: 'Frete grátis', sub: 'nos primeiros 3 pedidos', emoji: '🛵', badge: 'Novo usuário' },
  { id: 2, bg: '#FF6B00', title: 'Combo família', sub: 'a partir de R$ 39,90', emoji: '🍔', badge: 'Oferta' },
  { id: 3, bg: '#1877F2', title: 'Pague menos', sub: 'com iFood Pay', emoji: '💳', badge: 'Exclusivo' },
  { id: 4, bg: '#2e7d32', title: 'Saudável hoje', sub: 'saladas e bowls frescos', emoji: '🥗', badge: 'Destaque' },
]

export const restaurants = [
  {
    id: 1, name: "Bob's", category: 'Lanches · Hambúrguer',
    rating: 4.7, time: '25–35 min', fee: 'Grátis',
    tag: 'Mais pedido', bg: '#EA1D2C', emoji: '🍔',
  },
  {
    id: 2, name: 'Pizza Hut', category: 'Pizza · Italiana',
    rating: 4.5, time: '30–45 min', fee: 'R$ 3,99',
    tag: 'Promoção', bg: '#FF6B00', emoji: '🍕',
  },
  {
    id: 3, name: 'KFC', category: 'Frango · Fast food',
    rating: 4.6, time: '20–30 min', fee: 'Grátis',
    tag: null, bg: '#c8111f', emoji: '🍗',
  },
  {
    id: 4, name: 'Outback', category: 'Americana · Grelhados',
    rating: 4.8, time: '40–55 min', fee: 'R$ 6,99',
    tag: 'Bem avaliado', bg: '#7B3F00', emoji: '🥩',
  },
  {
    id: 5, name: 'Madero', category: 'Hambúrguer · Premium',
    rating: 4.9, time: '35–50 min', fee: 'R$ 4,99',
    tag: 'Novo', bg: '#212121', emoji: '🍔',
  },
  {
    id: 6, name: 'Spoleto', category: 'Italiana · Massas',
    rating: 4.4, time: '25–40 min', fee: 'Grátis',
    tag: null, bg: '#1565C0', emoji: '🍝',
  },
  {
    id: 7, name: 'Subway', category: 'Sanduíches · Saudável',
    rating: 4.3, time: '15–25 min', fee: 'R$ 2,99',
    tag: null, bg: '#2e7d32', emoji: '🥪',
  },
  {
    id: 8, name: "McDonald's", category: 'Lanches · Fast food',
    rating: 4.5, time: '20–30 min', fee: 'Grátis',
    tag: 'Mais pedido', bg: '#F57F17', emoji: '🍟',
  },
]

/**
 * Lê o nome do usuário salvo pelo login (retornado pela API).
 * Fallback para 'Visitante' se não existir.
 */
export function getUserName() {
  try {
    const raw = localStorage.getItem('ifood_user')
    if (raw) return JSON.parse(raw).nome?.split(' ')[0] ?? 'Visitante'
  } catch { /* ignore */ }
  return 'Visitante'
}
