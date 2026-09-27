/**
 * CadastroFinalController
 *
 * Tela final de cadastro — nome + CPF opcional + email readonly.
 * Pré-requisitos no sessionStorage:
 *   - ifood_verified_email  (email verificado)
 *   - ifood_verified_phone  (celular verificado)
 */

import { apiRegister, saveToken } from '../services/api.js'

export class CadastroFinalController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
    this._phone  = ''
  }

  init() {
    this._email = sessionStorage.getItem('ifood_verified_email') || ''
    this._phone = sessionStorage.getItem('ifood_verified_phone') || ''

    // Se não tem os dados necessários, volta para o início
    if (!this._email || !this._phone) {
      this._router.navigate('/auth')
      return
    }

    this._view.render(this._email)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onCadastrar(()  => this._handleCadastrar())
    this._view.onVoltar(()     => this._router.navigate('/verify-phone'))
    this._view.onJaTemConta(() => this._router.navigate('/auth'))
  }

  async _handleCadastrar() {
    const nome = this._view.getNome()
    const cpf  = this._view.getCpf()

    this._view.clearNomeError()

    if (!nome || nome.length < 2) {
      this._view.showNomeError('Informe seu nome completo')
      return
    }

    this._view.setLoading(true)
    try {
      const result = await apiRegister({
        nome,
        email:    this._email,
        telefone: this._phone,
        ...(cpf ? { documento: cpf } : {}),
      })

      // Limpa sessionStorage
      sessionStorage.removeItem('ifood_verified_email')
      sessionStorage.removeItem('ifood_verified_phone')

      // Salva token e vai direto para home
      if (result?.access_token) {
        saveToken(result.access_token)
        if (result.usuario) {
          try { localStorage.setItem('ifood_user', JSON.stringify(result.usuario)) } catch {}
        }
      }

      this._view.showToast('Conta criada com sucesso! Bem-vindo ao iFood 🎉', 'success')
      setTimeout(() => this._router.navigate('/home'), 800)
    } catch (err) {
      const msg = (err.message ?? '').toLowerCase()
      if (msg.includes('email') || msg.includes('e-mail') || msg.includes('cadastrado')) {
        this._view.showToast('Este e-mail já está cadastrado. Faça login.', 'error')
        setTimeout(() => this._router.navigate('/auth'), 2000)
      } else {
        this._view.showToast(err.message || 'Erro ao criar conta. Tente novamente.', 'error')
      }
    } finally {
      this._view.setLoading(false)
    }
  }
}
