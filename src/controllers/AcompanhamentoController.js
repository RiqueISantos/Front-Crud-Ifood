/**
 * AcompanhamentoController
 *
 * Tela de acompanhamento do pedido em tempo real via SSE.
 * O backend usa APScheduler para simular o avanço automático dos status.
 * Rota: #/acompanhar/:id
 */

import { apiGetPedido, getToken } from '../services/api.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export class AcompanhamentoController {
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._pedido    = null
    this._sse       = null   // EventSource
    this._pollTimer = null   // fallback polling se SSE falhar
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

    // Só conecta SSE se o pedido ainda está em andamento
    if (!['ENTREGUE', 'CANCELADO'].includes(this._pedido.status)) {
      this._conectarSSE(id)
    }
  }

  destroy() {
    this._desconectarSSE()
    this._pararPolling()
    this._view.destroy?.()
  }

  _bindEvents() {
    this._view.onVoltar(() => this._router.navigate('/meus-pedidos'))
  }

  // ── SSE ────────────────────────────────────────────────────────────────────

  _conectarSSE(pedidoId) {
    const token = getToken()
    if (!token) return

    const url = `${BASE_URL}/pedidos/${pedidoId}/acompanhar?token=${token}`

    try {
      this._sse = new EventSource(url)

      this._sse.onmessage = (event) => {
        try {
          const dados = JSON.parse(event.data)
          if (dados.status && dados.status !== this._pedido.status) {
            this._pedido.status = dados.status
            this._view.updateStatus(dados.status)

            // Fecha SSE quando terminar
            if (['ENTREGUE', 'CANCELADO'].includes(dados.status)) {
              this._desconectarSSE()
            }
          }
        } catch {}
      }

      this._sse.onerror = () => {
        // SSE falhou — cai para polling como fallback
        this._desconectarSSE()
        this._iniciarPolling(pedidoId)
      }
    } catch {
      // EventSource não disponível — usa polling
      this._iniciarPolling(pedidoId)
    }
  }

  _desconectarSSE() {
    if (this._sse) {
      this._sse.close()
      this._sse = null
    }
  }

  // ── Polling fallback ───────────────────────────────────────────────────────

  _iniciarPolling(pedidoId) {
    this._pollTimer = setInterval(async () => {
      try {
        const atualizado = await apiGetPedido(pedidoId)
        if (atualizado.status !== this._pedido.status) {
          this._pedido.status = atualizado.status
          this._view.updateStatus(atualizado.status)
          if (['ENTREGUE', 'CANCELADO'].includes(atualizado.status)) {
            this._pararPolling()
          }
        }
      } catch {}
    }, 10_000)
  }

  _pararPolling() {
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null }
  }

  // ── Helper ─────────────────────────────────────────────────────────────────

  _getIdFromHash() {
    const match = window.location.hash.match(/\/acompanhar\/(\d+)/)
    return match ? Number(match[1]) : null
  }
}
