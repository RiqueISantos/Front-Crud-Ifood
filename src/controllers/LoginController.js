/**
 * LoginController
 *
 * Responsável por:
 *  - Orquestrar LoginModel e LoginView
 *  - NÃO manipula o DOM diretamente
 *  - NÃO contém regras de negócio
 */

import {
  validateLoginForm,
  submitLogin,
  submitSocialLogin,
  loginValidators,
} from '../models/LoginModel.js'

export class LoginController {
  /**
   * @param {import('../views/LoginView.js').LoginView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  // ── Ciclo de vida ──────────────────────────────────────────────────────

  init() {
    this._view.render()
    this._bindEvents()
  }

  destroy() {
    // Nada a limpar por ora (sem timers globais ou listeners externos)
  }

  // ── Binding de eventos ─────────────────────────────────────────────────

  _bindEvents() {
    const v = this._view

    // Submit
    v.onSubmit(() => this._handleSubmit())

    // Toggle de senha
    v.onPasswordToggle(() => v.togglePasswordVisibility())

    // Social
    v.onSocialLogin('google',   (p) => this._handleSocialLogin(p))
    v.onSocialLogin('facebook', (p) => this._handleSocialLogin(p))

    // Ir para cadastro
    v.onRegisterLink(() => this._router.navigate('/register'))

    // Esqueci minha senha
    v.onForgotPassword(() => this._handleForgotPassword())

    // Validação inline no blur
    v.onFieldBlur('login-email', (val) => {
      const error = loginValidators.email(val)
      error ? v.showFieldError('login-email', error) : v.clearFieldError('login-email')
    })

    v.onFieldBlur('login-password', (val) => {
      const error = loginValidators.password(val)
      error ? v.showFieldError('login-password', error) : v.clearFieldError('login-password')
    })

    // Revalida enquanto digita se já tinha erro
    v.onFieldInput('login-email', (val) => {
      this._revalidateIfDirty('login-email', () => loginValidators.email(val))
    })

    v.onFieldInput('login-password', (val) => {
      this._revalidateIfDirty('login-password', () => loginValidators.password(val))
    })
  }

  // ── Submit ─────────────────────────────────────────────────────────────

  async _handleSubmit() {
    const data = this._view.getFormData()
    const { errors, isValid } = validateLoginForm(data)

    if (!isValid) {
      this._view.showErrors(errors)
      const firstKey = Object.keys(errors)[0]
      document.getElementById(`login-${firstKey}`)?.focus()
      return
    }

    this._view.setSubmitLoading(true)

    try {
      const result = await submitLogin(data)

      // Salva nome para exibir na home (se a API retornar o usuário)
      if (result.usuario) {
        localStorage.setItem('ifood_user', JSON.stringify(result.usuario))
      } else {
        // Fallback: salva o e-mail como nome até ter a rota de perfil
        localStorage.setItem('ifood_user', JSON.stringify({ nome: data.email.split('@')[0] }))
      }

      this._view.showToast('Login realizado com sucesso! 🎉', 'success')
      setTimeout(() => this._router.navigate('/home'), 800)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('inválido') || msg.toLowerCase().includes('senha') || msg.toLowerCase().includes('email')) {
        this._view.showFieldError('login-email', ' ')
        this._view.showFieldError('login-password', 'E-mail ou senha incorretos')
        document.getElementById('login-password')?.focus()
      } else {
        this._view.showToast(msg || 'Ocorreu um erro. Tente novamente.', 'error')
      }
    } finally {
      this._view.setSubmitLoading(false)
    }
  }

  // ── Social ─────────────────────────────────────────────────────────────

  async _handleSocialLogin(provider) {
    this._view.setSocialLoading(provider, true)
    try {
      const result = await submitSocialLogin(provider)
      this._view.showToast(result.message, 'success')
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao autenticar. Tente novamente.', 'error')
    } finally {
      this._view.setSocialLoading(provider, false)
    }
  }

  // ── Esqueci a senha ────────────────────────────────────────────────────

  _handleForgotPassword() {
    // TODO: navegar para tela de recuperação quando implementada
    this._view.showToast('Em breve: recuperação de senha por e-mail.', 'default')
  }

  // ── Helper ─────────────────────────────────────────────────────────────

  _revalidateIfDirty(fieldId, validate) {
    const el = document.getElementById(fieldId)
    if (el?.classList.contains('error')) {
      const error = validate()
      error
        ? this._view.showFieldError(fieldId, error)
        : this._view.clearFieldError(fieldId)
    }
  }
}
