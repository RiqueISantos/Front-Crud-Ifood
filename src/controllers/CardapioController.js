/**
 * CardapioController
 *
 * Gerencia o CRUD de produtos do cardápio do parceiro.
 * Rota: #/restaurante/cardapio
 */

import {
  apiListarProdutos,
  apiCriarProduto,
  apiAtualizarProduto,
  apiDeletarProduto,
} from '../services/api.js'

export class CardapioController {
  constructor(view, router) {
    this._view     = view
    this._router   = router
    this._rest     = null
    this._produtos = []
  }

  async init() {
    try { this._rest = JSON.parse(localStorage.getItem('ifood_restaurante') || 'null') } catch {}
    if (!this._rest?.id) { this._router.navigate('/restaurante/login'); return }

    this._view.renderLoading()
    await this._carregar()
  }

  destroy() {}

  async _carregar() {
    try {
      this._produtos = await apiListarProdutos(this._rest.id)
    } catch {
      this._produtos = []
    }
    this._view.render(this._produtos)
    this._bindEventos()
  }

  _bindEventos() {
    this._view.onVoltar(        () => this._router.navigate('/restaurante/dashboard'))
    this._view.onNovo(          () => this._view.showModal())
    this._view.onModalCancelar( () => this._view.hideModal())
    this._view.onModalSalvar(   () => this._handleSalvar())
    this._view.onDelCancelar(   () => this._view.hideDelModal())
    this._view.onDelConfirmar(  () => this._handleDeletar())
    this._view.onEditar(        id  => this._handleEditar(id))
    this._view.onDeletar(       id  => this._view.showDelModal(id))
    this._view.onToggleDisponivel((id, disp) => this._handleToggle(id, disp))

    // Re-bind após busca re-renderizar os cards
    document.addEventListener('cdp:rebind', () => {
      this._view.onEditar(id => this._handleEditar(id))
      this._view.onDeletar(id => this._view.showDelModal(id))
      this._view.onToggleDisponivel((id, disp) => this._handleToggle(id, disp))
    })
  }

  // ── Salvar (criar ou editar) ──────────────────────────────────────────────

  async _handleSalvar() {
    const dados = this._view.getFormData()
    this._view.clearAllErrors()

    let valid = true
    if (!dados.nome || dados.nome.length < 2) {
      this._view.showFieldError('nome', 'Informe o nome do produto')
      valid = false
    }
    if (!dados.descricao || dados.descricao.length < 5) {
      this._view.showFieldError('desc', 'Informe uma descrição')
      valid = false
    }
    if (!dados.preco || isNaN(dados.preco) || dados.preco <= 0) {
      this._view.showFieldError('preco', 'Informe um preço válido')
      valid = false
    }
    if (!valid) return

    this._view.setSalvarLoading(true)
    try {
      const payload = {
        nome:      dados.nome,
        descricao: dados.descricao,
        preco:     dados.preco,
        disponivel: dados.disponivel,
      }

      if (dados.id) {
        await apiAtualizarProduto(dados.id, payload)
        this._view.showToast('Produto atualizado!', 'success')
      } else {
        await apiCriarProduto(payload)
        this._view.showToast('Produto criado!', 'success')
      }

      this._view.hideModal()
      await this._carregar()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao salvar produto.', 'error')
    } finally {
      this._view.setSalvarLoading(false)
    }
  }

  // ── Editar ────────────────────────────────────────────────────────────────

  _handleEditar(id) {
    const produto = this._produtos.find(p => p.id === id)
    if (produto) this._view.showModal(produto)
  }

  // ── Toggle disponível/indisponível ────────────────────────────────────────

  async _handleToggle(id, disponivel) {
    try {
      await apiAtualizarProduto(id, { disponivel })
      this._view.showToast(disponivel ? 'Produto ativado.' : 'Produto desativado.', 'default')
      await this._carregar()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao atualizar produto.', 'error')
      await this._carregar() // reverte visualmente
    }
  }

  // ── Deletar ───────────────────────────────────────────────────────────────

  async _handleDeletar() {
    const id = Number(this._view.getDelId())
    if (!id) return

    this._view.setDelLoading(true)
    try {
      await apiDeletarProduto(id)
      this._view.showToast('Produto excluído.', 'success')
      this._view.hideDelModal()
      await this._carregar()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao excluir produto.', 'error')
    } finally {
      this._view.setDelLoading(false)
    }
  }
}
