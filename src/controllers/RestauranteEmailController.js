/**
 * RestauranteEmailController
 *
 * Fluxo:
 *  Passo 1 — Digitar e-mail → chama POST /restaurante/cadastro/solicitar
 *  Passo 2 — Digitar código OTP → salva email verificado no sessionStorage
 *             e redireciona para /restaurante/dados
 *
 * O código OTP não é validado aqui; a validação definitiva ocorre no
 * /restaurante/cadastro/confirmar (junto com todos os dados do restaurante).
 * Para dar feedback ao usuário, guardamos o código temporariamente no
 * sessionStorage até a etapa final.
 */

import { apiRestauranteSolicitarCadastro } from '../services/api.js'

function validateEmail(email) {
  if (!email) return 'O e-mail é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Informe um e-mail válido'
  return null
}

export class RestauranteEmailController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
  }

  init() {
    this._view.render('cadastro')
    this._view.showStep(1)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(()   => this._handleContinuar())
    this._view.onBack(()        => this._router.navigate('/restaurante'))
    this._view.onBackOtp(()     => { this._view.showStep(1); this._view.clearOtpError() })
    this._view.onConfirmarOtp(() => this._handleConfirmarOtp())
    this._view.onReenviarOtp(() => this._handleReenviarOtp())
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
      await apiRestauranteSolicitarCadastro(email)
      this._view.setOtpEmailDisplay(email)
      this._view.showStep(2)
      this._view.clearOtpInputs()
      this._view.focusFirstOtp()
    } catch (e) {
      const msg = (e.message ?? '').toLowerCase()
      if (msg.includes('já cadastrado') || msg.includes('ja cadastrado')) {
        this._view.showEmailError('Este e-mail já está cadastrado. Faça login.')
        this._view.showToast('E-mail já cadastrado. Redirecionando para login...', 'error')
        setTimeout(() => this._router.navigate('/restaurante/login'), 2000)
      } else {
        this._view.showToast(e.message || 'Erro ao enviar o código. Tente novamente.', 'error')
      }
    } finally {
      this._view.setEmailLoading(false)
    }
  }

  // ── Passo 2 ───────────────────────────────────────────────────────────────

  _handleConfirmarOtp() {
    const code = this._view.getOtpCode()
    this._view.clearOtpError()

    if (code.length < 6) {
      this._view.showOtpError('Digite os 6 dígitos do código')
      return
    }

    // Salva email e código no sessionStorage para a etapa final usar
    sessionStorage.setItem('rest_email_verificado', this._email)
    sessionStorage.setItem('rest_codigo_verificacao', code)

    this._view.showToast('E-mail verificado! Preencha os dados do restaurante.', 'success')
    setTimeout(() => this._router.navigate('/restaurante/dados'), 600)
  }

  // ── Reenviar ──────────────────────────────────────────────────────────────

  async _handleReenviarOtp() {
    if (!this._email) return
    try {
      await apiRestauranteSolicitarCadastro(this._email)
      this._view.showToast('Novo código enviado para ' + this._email, 'success')
      this._view.clearOtpInputs()
      this._view.clearOtpError()
      this._view.focusFirstOtp()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
