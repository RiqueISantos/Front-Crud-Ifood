/**
 * RestauranteLoginController
 *
 * Fluxo de login para restaurantes já cadastrados:
 *  Passo 1 — Digitar e-mail → POST /restaurante/login/solicitar
 *  Passo 2 — Digitar código → POST /restaurante/login → recebe JWT
 *             Redireciona para /restaurante/dashboard
 */

import {
  apiRestauranteSolicitarLogin,
  apiRestauranteLogin,
  saveRestauranteToken,
} from '../services/api.js'

function validateEmail(email) {
  if (!email) return 'O e-mail é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Informe um e-mail válido'
  return null
}

export class RestauranteLoginController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
  }

  init() {
    this._view.render()
    this._view.showStep(1)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(   () => this._handleContinuar())
    this._view.onBack(        () => this._router.navigate('/restaurante'))
    this._view.onBackOtp(     () => { this._view.showStep(1); this._view.clearOtpError() })
    this._view.onConfirmarOtp(() => this._handleConfirmarOtp())
    this._view.onReenviarOtp( () => this._handleReenviarOtp())
    this._view.onIrCadastro(  () => this._router.navigate('/restaurante/email'))
  }

  // ── Passo 1 ───────────────────────────────────────────────────────────────

  async _handleContinuar() {
    const email = this._view.getEmail()
    this._view.clearEmailError()

    const err = validateEmail(email)
    if (err) { this._view.showEmailError(err); return }

    this._email = email
    this._view.setEmailLoading(true)

    try {
      await apiRestauranteSolicitarLogin(email)
      this._view.setOtpEmailDisplay(email)
      this._view.showStep(2)
      this._view.clearOtpInputs()
      this._view.focusFirstOtp()
    } catch (e) {
      const msg = (e.message ?? '').toLowerCase()
      if (msg.includes('não encontrado') || msg.includes('nao encontrado')) {
        this._view.showEmailError('Restaurante não encontrado. Cadastre-se primeiro.')
      } else {
        this._view.showToast(e.message || 'Erro ao enviar o código. Tente novamente.', 'error')
      }
    } finally {
      this._view.setEmailLoading(false)
    }
  }

  // ── Passo 2 ───────────────────────────────────────────────────────────────

  async _handleConfirmarOtp() {
    const code = this._view.getOtpCode()
    this._view.clearOtpError()

    if (code.length < 6) {
      this._view.showOtpError('Digite os 6 dígitos do código')
      return
    }

    this._view.setOtpLoading(true)

    try {
      const result = await apiRestauranteLogin(this._email, code)

      if (result.access_token) {
        saveRestauranteToken(result.access_token)
      }
      if (result.restaurante) {
        localStorage.setItem('ifood_restaurante', JSON.stringify(result.restaurante))
      }

      this._view.showToast('Login realizado com sucesso!', 'success')
      setTimeout(() => this._router.navigate('/restaurante/dashboard'), 700)
    } catch (err) {
      const msg = (err.message ?? '').toLowerCase()
      if (msg.includes('expirado')) {
        this._view.showOtpError('Código expirado. Solicite um novo.')
      } else if (msg.includes('inválido') || msg.includes('incorreto') || msg.includes('invalido')) {
        this._view.showOtpError('Código incorreto. Verifique e tente novamente.')
      } else {
        this._view.showOtpError(err.message || 'Código inválido. Tente novamente.')
      }
    } finally {
      this._view.setOtpLoading(false)
    }
  }

  // ── Reenviar ──────────────────────────────────────────────────────────────

  async _handleReenviarOtp() {
    if (!this._email) return
    try {
      await apiRestauranteSolicitarLogin(this._email)
      this._view.showToast('Novo código enviado para ' + this._email, 'success')
      this._view.clearOtpInputs()
      this._view.clearOtpError()
      this._view.focusFirstOtp()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
