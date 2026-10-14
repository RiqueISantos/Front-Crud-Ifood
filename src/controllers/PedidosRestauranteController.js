/**
 * PedidosRestauranteController
 *
 * Painel de pedidos do restaurante.
 * Kanban de status + botão de avançar + polling de 20s.
 * Rota: #/restaurante/pedidos
 */

import { apiListarPedidosRestaurante, apiAvancarStatusPedido } from '../services/api.js'

export class PedidosRestauranteController {
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._pedidos   = []
    this._pollTimer = null
  }

  async init() {
    this._view.renderLoading()
    await this._carregar()
    this._iniciarPolling()
  }

  destroy() {
    this._pararPolling()
  }

  async _carregar() {
    try {
      this._pedidos = await apiListarPedidosRestaurante()
    } catch {
      this._pedidos = []
    }
    this._view.render(this._pedidos)
    this._bindEvents()
  }

  _bindEvents() {
    this._view.onVoltar(  () => this._router.navigate('/restaurante/dashboard'))
    this._view.onAvancar( id  => this._handleAvancar(id))

    // Botão de refresh manual
    document.getElementById('btn-pr-refresh')?.addEventListener('click', () => {
      this._view.renderLoading()
      this._carregar()
    })
  }

  async _handleAvancar(pedidoId) {
    const pedido = this._pedidos.find(p => p.id === pedidoId)
    if (!pedido) return

    this._view.setAvancarLoading(pedidoId, true)
    try {
      await apiAvancarStatusPedido(pedidoId)
      await this._carregar()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao avançar status.', 'error')
      this._view.setAvancarLoading(pedidoId, false)
    }
  }

  _iniciarPolling() {
    this._pollTimer = setInterval(() => this._carregar(), 20_000)
  }

  _pararPolling() {
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null }
  }
}
