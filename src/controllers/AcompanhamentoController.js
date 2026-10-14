/**
 * AcompanhamentoController
 *
 * Tela de acompanhamento do pedido em tempo real.
 * Polling de 15s para atualizar status.
 * Rota: #/acompanhar/:id
 */

import { apiGetPedido } from '../services/api.js'

export class AcompanhamentoController {
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._pedido    = null
    this._pollTimer = null
  }

  async init() {
    const id = this._getIdFromHash()
    if (!id) { this._router.navigate('/meus-pedidos'); return }

    try {
      this._pedido = await apiGetPedido(id)
    } catch {
      this._router.navigate('/meus-pedidos')
      return
    }

    this._view.render(this._pedido)
    this._bindEvents()
    this._iniciarPolling()
  }

  destroy() {
    this._pararPolling()
    this._view.destroy?.()
  }

  _bindEvents() {
    this._view.onVoltar(() => this._router.navigate('/meus-pedidos'))
  }

  async _poll() {
    try {
      const atualizado = await apiGetPedido(this._pedido.id)
      if (atualizado.status !== this._pedido.status) {
        this._pedido = atualizado
        this._view.updateStatus(atualizado.status)
      }
      // Para o polling se chegou no status final
      if (['ENTREGUE', 'CANCELADO'].includes(atualizado.status)) {
        this._pararPolling()
      }
    } catch {}
  }

  _iniciarPolling() {
    if (['ENTREGUE', 'CANCELADO'].includes(this._pedido.status)) return
    this._pollTimer = setInterval(() => this._poll(), 15_000)
  }

  _pararPolling() {
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null }
  }

  _getIdFromHash() {
    const match = window.location.hash.match(/\/acompanhar\/(\d+)/)
    return match ? Number(match[1]) : null
  }
}
