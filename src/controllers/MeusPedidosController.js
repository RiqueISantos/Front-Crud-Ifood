/**
 * MeusPedidosController
 *
 * Lista e detalha pedidos do usuário.
 * Polling de 30s para atualizar status quando tem pedido ativo.
 * Rota: #/meus-pedidos
 */

import { apiListarMeusPedidos, apiGetPedido, apiCancelarPedido } from '../services/api.js'

const STATUS_ATIVOS = [
  'AGUARDANDO_PAGAMENTO',
  'AGUARDANDO_CONFIRMACAO',
  'CONFIRMADO',
  'EM_PREPARACAO',
  'SAIU_PARA_ENTREGA',
]

export class MeusPedidosController {
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._pedidos   = []
    this._detalhe   = null
    this._pollTimer = null
  }

  async init() {
    // Verifica se deve abrir detalhe diretamente
    const hash = window.location.hash
    const match = hash.match(/\/meus-pedidos\/(\d+)/)
    if (match) {
      await this._carregarDetalhe(Number(match[1]))
      return
    }

    this._view.renderLoading()
    await this._carregarLista()
    this._iniciarPolling()
  }

  destroy() {
    this._pararPolling()
  }

  // ── Lista ──────────────────────────────────────────────────────────────────

  async _carregarLista() {
    try {
      this._pedidos = await apiListarMeusPedidos()
    } catch {
      this._pedidos = []
    }
    this._view.render(this._pedidos)
    this._bindEventosLista()
  }

  _bindEventosLista() {
    this._view.onVoltar(   () => this._router.navigate('/home'))
    this._view.onVerPedido(id => this._carregarDetalhe(id))
  }

  // ── Detalhe ────────────────────────────────────────────────────────────────

  async _carregarDetalhe(id) {
    try {
      this._detalhe = await apiGetPedido(id)
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao carregar pedido.', 'error')
      return
    }
    this._view.renderDetalhe(this._detalhe)
    this._bindEventosDetalhe()
  }

  _bindEventosDetalhe() {
    this._view.onVoltarDetalhe(() => {
      this._detalhe = null
      this._view.renderLoading()
      this._carregarLista()
    })
    this._view.onCancelar(id => this._handleCancelar(id))
  }

  async _handleCancelar(id) {
    this._view.setCancelLoading(true)
    try {
      await apiCancelarPedido(id)
      this._view.showToast('Pedido cancelado.', 'success')
      setTimeout(() => {
        this._view.renderLoading()
        this._carregarLista()
      }, 1000)
    } catch (err) {
      this._view.showToast(err.message || 'Não foi possível cancelar.', 'error')
    } finally {
      this._view.setCancelLoading(false)
    }
  }

  // ── Polling ────────────────────────────────────────────────────────────────

  _iniciarPolling() {
    this._pollTimer = setInterval(async () => {
      const temAtivo = this._pedidos.some(p => STATUS_ATIVOS.includes(p.status))
      if (!temAtivo) { this._pararPolling(); return }
      try {
        const atualizados = await apiListarMeusPedidos()
        const mudou = JSON.stringify(atualizados.map(p => p.status)) !==
                      JSON.stringify(this._pedidos.map(p => p.status))
        if (mudou) {
          this._pedidos = atualizados
          this._view.render(this._pedidos)
          this._bindEventosLista()
        }
      } catch {}
    }, 30_000)
  }

  _pararPolling() {
    if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null }
  }
}
