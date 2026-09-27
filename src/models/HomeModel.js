/**
 * HomeModel
 * Categorias e banners estáticos. Restaurantes carregados do backend.
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

// Emojis por categoria para os cards
const CATEGORIA_EMOJI = {
  'Lanches': '🍔', 'Pizza': '🍕', 'Japonesa': '🍣', 'Brasileira': '🇧🇷',
  'Italiana': '🍝', 'Árabe': '🥙', 'Mexicana': '🌮', 'Chinesa': '🍜',
  'Frutos do Mar': '🐟', 'Vegetariana': '🥗', 'Saudável': '🥗',
  'Açaí': '🫐', 'Sorvetes': '🍦', 'Doces & Bolos': '🎂', 'Padaria': '🥖',
  'Cafeteria': '☕', 'Carnes': '🥩', 'Frango': '🍗', 'Marmita': '🍱',
  'Bebidas': '🥤', 'Outro': '🍽️',
}

const BG_COLORS = [
  '#EA1D2C','#FF6B00','#1565C0','#2e7d32','#7B3F00',
  '#212121','#6a1b9a','#00838f','#c62828','#4e342e',
]

/**
 * Converte um restaurante do backend para o formato usado na HomeView.
 */
export function adaptarRestaurante(r, idx = 0) {
  const taxa = r.taxa_entrega != null
    ? `R$ ${Number(r.taxa_entrega).toFixed(2).replace('.', ',')}`
    : 'Grátis'
  return {
    id:       r.id,
    name:     r.nome,
    category: r.categoria_principal,
    rating:   '—',
    time:     r.tempo_estimado ?? '—',
    fee:      taxa,
    tag:      null,
    bg:       BG_COLORS[idx % BG_COLORS.length],
    emoji:    CATEGORIA_EMOJI[r.categoria_principal] ?? '🍽️',
  }
}

// Fallback estático caso o backend não responda
export const restaurantsFallback = [
  { id: 0, name: "Bob's", category: 'Lanches', rating: 4.7, time: '25–35 min', fee: 'Grátis', tag: 'Mais pedido', bg: '#EA1D2C', emoji: '🍔' },
  { id: 0, name: 'Pizza Hut', category: 'Pizza', rating: 4.5, time: '30–45 min', fee: 'R$ 3,99', tag: 'Promoção', bg: '#FF6B00', emoji: '🍕' },
]

/**
 * Lê o nome do usuário salvo pelo login.
 */
export function getUserName() {
  try {
    const raw = localStorage.getItem('ifood_user')
    if (raw) return JSON.parse(raw).nome?.split(' ')[0] ?? 'Visitante'
  } catch { /* ignore */ }
  return 'Visitante'
}
