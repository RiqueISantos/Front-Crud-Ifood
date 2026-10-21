/**
 * RestauranteDashboardController
 *
 * Carrega os dados do restaurante autenticado via GET /restaurantes/:id
 * e renderiza o dashboard do portal do parceiro.
 */

import { apiGetRestaurante, apiListarPedidosRestaurante, clearRestauranteToken } from '../services/api.js'

export class RestauranteDashboardController {
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  async init() {
    this._view.renderLoading()

    // Recupera dados do restaurante salvos no localStorage após login/cadastro
    let rest = null
    try {
      rest = JSON.parse(localStorage.getItem('ifood_restaurante') || 'null')
    } catch {}

    // Se tiver o id, busca dados frescos do backend
    if (rest?.id) {
      try {
        const dados = await apiGetRestaurante(rest.id)
        rest = dados
        // Atualiza o cache local com os dados mais recentes
        localStorage.setItem('ifood_restaurante', JSON.stringify(rest))
      } catch {
        // Se falhar (ex: rede), usa os dados em cache mesmo
      }
    }

    if (!rest) {
      // Sem dados nenhum — força novo login
      this._router.navigate('/restaurante/login')
      return
    }

    this._view.render(rest)
    this._bindEvents()
    this._carregarPedidos()
  }

  async _carregarPedidos() {
    try {
      const pedidos = await apiListarPedidosRestaurante()
      const hoje    = new Date().toDateString()
      const deHoje  = pedidos.filter(p => new Date(p.criado_em).toDateString() === hoje)
      const ativos  = deHoje.filter(p => !['ENTREGUE','CANCELADO'].includes(p.status))
      const fat     = deHoje.filter(p => p.status === 'ENTREGUE')
                             .reduce((s, p) => s + Number(p.total), 0)

      // Atualiza cards de métricas no DOM diretamente
      const cards = document.querySelectorAll('.rdash-metric-card__value')
      if (cards[0]) cards[0].textContent = deHoje.length
      if (cards[1]) cards[1].textContent = `R$ ${fat.toFixed(2).replace('.', ',')}`

      // Atualiza pedidos recentes
      const listaEl = document.querySelector('.rdash-card__body .rdash-empty-state')
      if (listaEl && ativos.length > 0) {
        listaEl.parentElement.innerHTML = ativos.slice(0, 5).map(p => /* html */`
          <div class="rdash-pedido-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5f5f5;">
            <div>
              <div style="font-weight:600;font-size:0.9rem">Pedido #${p.id}</div>
              <div style="font-size:0.8rem;color:#757575">${_labelStatus(p.status)}</div>
            </div>
            <div style="font-weight:700;color:#ea1d2c">R$ ${Number(p.total).toFixed(2).replace('.', ',')}</div>
          </div>
        `).join('')
      }
    } catch { /* silencioso — dados do dashboard não são críticos */ }
  }

  destroy() {}

  _bindEvents() {
    this._view.onLogout(              () => this._handleLogout())
    this._view.onMinhaLoja(           () => this._router.navigate('/restaurante/perfil'))
    this._view.onEditarPerfil(        () => this._router.navigate('/restaurante/perfil'))
    this._view.onGerenciarCardapio(   () => this._router.navigate('/restaurante/cardapio'))
    this._view.onNavCardapio(         () => this._router.navigate('/restaurante/cardapio'))

    // Botão pedidos na sidebar
    document.getElementById('nav-pedidos')?.addEventListener('click',
      () => this._router.navigate('/restaurante/pedidos'))
  }

  _handleLogout() {
    clearRestauranteToken()
    localStorage.removeItem('ifood_restaurante')
    this._router.navigate('/restaurante')
  }
}

function _labelStatus(s) {
  const map = {
    AGUARDANDO_PAGAMENTO:   '⏳ Aguardando pagamento',
    AGUARDANDO_CONFIRMACAO: '🕐 Aguardando confirmação',
    CONFIRMADO:             '✅ Confirmado',
    EM_PREPARACAO:          '👨‍🍳 Em preparo',
    SAIU_PARA_ENTREGA:      '🛵 A caminho',
    ENTREGUE:               '🎉 Entregue',
    CANCELADO:              '❌ Cancelado',
  }
  return map[s] ?? s
}
