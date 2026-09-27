/**
 * RestaurantePerfilController
 *
 * Edição e exclusão do perfil do restaurante.
 * Acessado pelo menu "Minha loja" no dashboard.
 */

import {
  apiAtualizarRestaurante,
  apiDeletarRestaurante,
  clearRestauranteToken,
} from '../services/api.js'

export class RestaurantePerfilController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._rest   = null
  }

  init() {
    try { this._rest = JSON.parse(localStorage.getItem('ifood_restaurante') || 'null') } catch {}
    if (!this._rest) { this._router.navigate('/restaurante/login'); return }

    this._view.render(this._rest)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onSalvar(           () => this._handleSalvar())
    this._view.onDeletar(          () => this._view.showModal(this._rest.nome))
    this._view.onModalCancelar(    () => this._view.hideModal())
    this._view.onModalConfirmar(   () => this._handleDeletar())
    this._view.onVoltar(           () => this._router.navigate('/restaurante/dashboard'))
  }

  async _handleSalvar() {
    const dados = this._view.getDados()
    this._view.clearFieldError('nome')
    this._view.clearFieldError('telefone')

    let valid = true
    if (!dados.nome || dados.nome.length < 2) {
      this._view.showFieldError('nome', 'Informe o nome do restaurante')
      valid = false
    }
    if (!dados.telefone || dados.telefone.length < 10) {
      this._view.showFieldError('telefone', 'Informe um telefone válido')
      valid = false
    }
    if (!valid) return

    this._view.setLoading(true)
    try {
      const result = await apiAtualizarRestaurante(this._rest.id, dados)
      // Atualiza cache local
      const atualizado = { ...this._rest, ...result }
      localStorage.setItem('ifood_restaurante', JSON.stringify(atualizado))
      this._rest = atualizado
      this._view.showToast('Dados atualizados com sucesso!', 'success')
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao salvar. Tente novamente.', 'error')
    } finally {
      this._view.setLoading(false)
    }
  }

  async _handleDeletar() {
    this._view.setDeleteLoading(true)
    try {
      await apiDeletarRestaurante(this._rest.id)
      clearRestauranteToken()
      localStorage.removeItem('ifood_restaurante')
      this._view.showToast('Restaurante excluído.', 'success')
      setTimeout(() => this._router.navigate('/restaurante'), 1000)
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao excluir. Tente novamente.', 'error')
      this._view.hideModal()
    } finally {
      this._view.setDeleteLoading(false)
    }
  }
}
