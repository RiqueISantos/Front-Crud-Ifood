/**
 * PedidoController
 *
 * Tela de confirmação do pedido.
 * Busca sacola + endereços do usuário → usuário confirma → POST /pedidos/confirmar
 * Se for pagamento online, redireciona para url_pagamento do Asaas.
 * Rota: #/pedido
 */

import { apiListarEnderecos, apiConfirmarPedido } from '../services/api.js'

export class PedidoController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._sacola = null
    this._enderecos = []
  }

  async init() {
    this._view.renderLoading()

    // Pega sacola do singleton global
    const sacolaCtrl = window._sacola
    if (!sacolaCtrl || sacolaCtrl.totalItens() === 0) {
      this._router.navigate('/home')
      return
    }
    this._sacola = sacolaCtrl.getSacola()
    if (!this._sacola) {
      this._router.navigate('/home')
      return
    }

    // Busca endereços do usuário
    try {
      const user = JSON.parse(localStorage.getItem('ifood_user') || 'null')
      if (user?.id) {
        this._enderecos = await apiListarEnderecos(user.id)
      }
    } catch { this._enderecos = [] }

    this._view.render({ sacola: this._sacola, enderecos: this._enderecos })
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onVoltar(   () => this._router.navigate('/home'))
    this._view.onConfirmar(() => this._handleConfirmar())
  }

  async _handleConfirmar() {
    const enderecoId     = this._view.getEnderecoId()
    const formaPagamento = this._view.getFormaPagamento()
    const observacao     = this._view.getObservacao()

    if (!enderecoId) {
      this._view.showToast('Selecione um endereço de entrega.', 'error')
      return
    }

    this._view.setConfirmarLoading(true)
    try {
      const pedido = await apiConfirmarPedido({
        endereco_id:     enderecoId,
        forma_pagamento: formaPagamento,
        observacao:      observacao || undefined,
      })

      // Atualiza a sacola (foi limpa pelo backend)
      await window._sacola?.recarregar?.()

      // Salva pedido para a tela de sucesso
      sessionStorage.setItem('ultimo_pedido', JSON.stringify(pedido))

      this._view.renderSucesso(pedido)
      this._bindEventosSucesso(pedido.id)
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao realizar pedido. Tente novamente.', 'error')
    } finally {
      this._view.setConfirmarLoading(false)
    }
  }

  _bindEventosSucesso(pedidoId) {
    this._view.onAcompanhar(() => this._router.navigate(`/acompanhar/${pedidoId}`))
    this._view.onHome(      () => this._router.navigate('/home'))
  }
}
