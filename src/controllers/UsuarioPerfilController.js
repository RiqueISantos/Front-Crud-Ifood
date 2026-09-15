/**
 * UsuarioPerfilController
 *
 * Edição e exclusão do perfil do usuário cliente.
 * Rota: #/perfil
 */

import {
  apiGetUser,
  apiUpdateUser,
  apiDeleteAccount,
  clearToken,
} from '../services/api.js'

export class UsuarioPerfilController {
  constructor(view, router) {
    this._view    = view
    this._router  = router
    this._usuario = null
  }

  async init() {
    try { this._usuario = JSON.parse(localStorage.getItem('ifood_user') || 'null') } catch {}
    if (!this._usuario?.id) { this._router.navigate('/auth'); return }

    // Busca dados frescos do backend
    try {
      const dados = await apiGetUser(this._usuario.id)
      this._usuario = { ...this._usuario, ...dados }
      localStorage.setItem('ifood_user', JSON.stringify(this._usuario))
    } catch { /* usa cache */ }

    this._view.render(this._usuario)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onSalvar(         () => this._handleSalvar())
    this._view.onDeletar(        () => this._view.showModal())
    this._view.onModalCancelar(  () => this._view.hideModal())
    this._view.onModalConfirmar( () => this._handleDeletar())
    this._view.onVoltar(         () => this._router.navigate('/home'))
  }

  async _handleSalvar() {
    const dados = this._view.getDados()
    this._view.clearFieldError('nome')
    this._view.clearFieldError('telefone')

    let valid = true
    if (!dados.nome || dados.nome.length < 2) {
      this._view.showFieldError('nome', 'Informe seu nome completo')
      valid = false
    }
    if (!valid) return

    // Monta payload só com campos preenchidos
    const payload = { nome: dados.nome }
    if (dados.telefone) payload.telefone = dados.telefone
    if (dados.documento) payload.documento = dados.documento

    this._view.setLoading(true)
    try {
      const result = await apiUpdateUser(this._usuario.id, payload)
      const atualizado = { ...this._usuario, ...result }
      localStorage.setItem('ifood_user', JSON.stringify(atualizado))
      this._usuario = atualizado
      this._view.showToast('Perfil atualizado com sucesso!', 'success')
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao salvar. Tente novamente.', 'error')
    } finally {
      this._view.setLoading(false)
    }
  }

  async _handleDeletar() {
    this._view.setDeleteLoading(true)
    try {
      await apiDeleteAccount(this._usuario.id)
      clearToken()
      localStorage.removeItem('ifood_user')
      this._view.showToast('Conta excluída.', 'success')
      setTimeout(() => this._router.navigate('/auth'), 1000)
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao excluir conta.', 'error')
      this._view.hideModal()
    } finally {
      this._view.setDeleteLoading(false)
    }
  }
}
