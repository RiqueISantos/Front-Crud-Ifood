/**
 * RestauranteClienteController
 *
 * Tela do restaurante vista pelo cliente.
 * Carrega dados do restaurante e produtos via GET /restaurantes/:id e GET /produtos/restaurante/:id.
 * Usa o SacolaController global (window._sacola) para adicionar itens.
 *
 * Rota: #/loja/:id  (o id vem no hash ex: #/loja/3)
 */

import { apiGetRestaurante, apiListarProdutos } from '../services/api.js'

export class RestauranteClienteController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._rest   = null
    this._pendenteProduto   = null   // produto aguardando obs
    this._pendenteProdutoId = null   // produto aguardando confirmação de conflito
  }

  async init() {
    // Pega o id da rota: hash é "#/loja/3"
    const id = this._getIdFromHash()
    if (!id) { this._router.navigate('/home'); return }

    this._view.renderLoading()

    try {
      const [rest, produtos] = await Promise.all([
        apiGetRestaurante(id),
        apiListarProdutos(id),
      ])
      this._rest = rest
      this._view.render(rest, produtos)
      this._bindEventos()
      this._atualizarBadge()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao carregar restaurante.', 'error')
      setTimeout(() => this._router.navigate('/home'), 1500)
    }
  }

  destroy() {}

  // ── Eventos ───────────────────────────────────────────────────────────────

  _bindEventos() {
    this._view.onVoltar(() => this._router.navigate('/home'))

    this._view.onAbrirSacola(() => {
      const sacola = window._sacola
      if (sacola) sacola.abrir()
    })

    // Clique no + abre modal de observação
    this._view.onAdicionarProduto((produto) => {
      this._pendenteProduto = produto
      this._view.showObs(produto)
    })

    // Modal obs: cancelar
    this._view.onObsCancelar(() => {
      this._pendenteProduto = null
      this._view.hideObs()
    })

    // Modal obs: confirmar → adiciona com obs
    this._view.onObsConfirmar(async () => {
      const obs     = this._view.getObs()
      const produto = this._pendenteProduto
      this._view.hideObs()
      this._pendenteProduto = null
      if (produto) await this._handleAdicionar(produto.id, obs)
    })

    this._view.onConflitoCancelar(() => {
      this._pendenteProdutoId = null
      this._view.hideConflito()
    })

    this._view.onConflitoConfirmar(async () => {
      this._view.hideConflito()
      if (this._pendenteProdutoId) {
        const sacola = window._sacola
        if (sacola) await sacola.adicionarItem(this._pendenteProdutoId, true)
        this._pendenteProdutoId = null
        this._atualizarBadge()
      }
    })
  }

  async _handleAdicionar(produtoId, observacao = '') {
    const sacola = window._sacola
    if (!sacola) return

    // Verifica conflito de restaurante
    if (sacola.temConflito(this._rest.id)) {
      this._pendenteProdutoId = produtoId
      this._view.showConflito(
        `Sua sacola já tem itens de "${sacola.nomeRestauranteAtual()}". Deseja limpar e adicionar deste restaurante?`
      )
      return
    }

    const result = await sacola.adicionarItem(produtoId, false, observacao)

    // Backend retornou conflito 409
    if (result?.conflito) {
      this._pendenteProdutoId = produtoId
      this._view.showConflito(result.mensagem)
      return
    }

    this._atualizarBadge()
  }

  _atualizarBadge() {
    const sacola = window._sacola
    if (sacola) this._view.atualizarContSacola(sacola.totalItens())
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _getIdFromHash() {
    // "#/loja/3" → 3
    const match = window.location.hash.match(/\/loja\/(\d+)/)
    return match ? Number(match[1]) : null
  }
}
