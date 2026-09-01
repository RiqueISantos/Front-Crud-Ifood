/**
 * EmailInputController
 *
 * Controla a tela "Informe o seu e-mail para continuar".
 *
 * Fluxo:
 *  1. Usuário digita o e-mail e clica Continuar
 *  2. Backend verifica se o e-mail já tem conta:
 *     - Tem conta → salva email no sessionStorage → navega para /login
 *     - Não tem conta → salva email no sessionStorage → navega para /verify-phone
 *       (o verify-phone depois passa para /verify-email onde o email já vem preenchido)
 */

import { validateEmail } from '../models/AuthModel.js'
import { apiCheckEmail } from '../services/api.js'

export class EmailInputController {
  /**
   * @param {import('../views/EmailInputView.js').EmailInputView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  init() {
    this._view.render()
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(() => this._handleContinuar())
    this._view.onBack(()      => this._router.navigate('/auth'))
  }

  async _handleContinuar() {
    const email = this._view.getEmail()
    this._view.clearError()

    const err = validateEmail(email)
    if (err) {
      this._view.showError(err)
      return
    }

    this._view.setLoading(true)
    try {
      const { existe } = await apiCheckEmail(email)

      // Salva o e-mail para as próximas telas usarem
      sessionStorage.setItem('ifood_pending_email', email)

      if (existe) {
        // Já tem conta → vai direto para o login
        this._router.navigate('/login')
      } else {
        // Novo usuário → precisa verificar celular primeiro
        this._router.navigate('/verify-phone')
      }
    } catch {
      // Se der erro na verificação, trata como novo usuário
      sessionStorage.setItem('ifood_pending_email', email)
      this._router.navigate('/verify-phone')
    } finally {
      this._view.setLoading(false)
    }
  }
}
