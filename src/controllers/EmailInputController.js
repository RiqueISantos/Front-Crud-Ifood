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

/**
 * EmailInputController
 *
 * Fluxo unificado por e-mail (igual iFood real):
 *  Passo 1 — Digitar e-mail
 *            → tenta login/solicitar (canal email)
 *            → se e-mail não existe → salva no sessionStorage → /verify-phone (cadastro)
 *            → se e-mail existe → mostra passo 2
 *  Passo 2 — Digitar código OTP
 *            → autentica → /home
 */

import { validateEmail } from '../models/AuthModel.js'
import { apiRequestLoginCode, apiLogin, saveToken } from '../services/api.js'

export class EmailInputController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
  }

  init() {
    this._view.render()
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(() => this._handleContinuar())
    this._view.onBack(()      => this._router.navigate('/auth'))
    this._view.onBackOtp(()   => { this._view.showStep(1); this._view.clearOtpError() })
    this._view.onConfirmarOtp(() => this._handleConfirmarOtp())
    this._view.onReenviarOtp(() => this._handleReenviarOtp())
  }

  // ── Passo 1: verificar e-mail e enviar código ─────────────────────────

  async _handleContinuar() {
    const email = this._view.getEmail()
    this._view.clearError()

    const err = validateEmail(email)
    if (err) { this._view.showError(err); return }

    this._email = email
    this._view.setLoading(true)

    try {
      // Tenta login — se o e-mail existe, envia código
      await apiRequestLoginCode({ identificador: email, canal: 'email' })
      // E-mail existe → mostra passo 2 (digitar código)
      this._view.setOtpEmailDisplay(email)
      this._view.showStep(2)
      this._view.clearOtpInputs()
      this._view.focusFirstOtp()
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('não encontrado') || msg.toLowerCase().includes('nao encontrado')) {
        // E-mail novo → cadastro, precisa verificar celular primeiro
        sessionStorage.setItem('ifood_pending_email', email)
        this._router.navigate('/verify-phone')
      } else {
        this._view.showToast(msg || 'Erro ao enviar o código. Tente novamente.', 'error')
      }
    } finally {
      this._view.setLoading(false)
    }
  }

  // ── Passo 2: verificar código OTP e logar ────────────────────────────

  async _handleConfirmarOtp() {
    const code = this._view.getOtpCode()
    this._view.clearOtpError()

    if (code.length < 6) {
      this._view.showOtpError('Digite os 6 dígitos do código')
      return
    }

    this._view.setOtpLoading(true)
    try {
      const result = await apiLogin({ identificador: this._email, codigo: code, canal: 'email' })
      if (result.access_token) saveToken(result.access_token)
      if (result.usuario) localStorage.setItem('ifood_user', JSON.stringify(result.usuario))
      this._view.showToast('Login realizado com sucesso!', 'success')
      setTimeout(() => this._router.navigate('/home'), 600)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('expirado')) {
        this._view.showOtpError('Código expirado. Solicite um novo.')
      } else {
        this._view.showOtpError(msg || 'Código incorreto. Tente novamente.')
      }
    } finally {
      this._view.setOtpLoading(false)
    }
  }

  // ── Reenviar ──────────────────────────────────────────────────────────

  async _handleReenviarOtp() {
    if (!this._email) return
    try {
      await apiRequestLoginCode({ identificador: this._email, canal: 'email' })
      this._view.showToast('Novo código enviado para ' + this._email, 'success')
      this._view.clearOtpInputs()
      this._view.clearOtpError()
      this._view.focusFirstOtp()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}

