/**
 * EmailInputController
 *
 * Fluxo unificado por e-mail (igual iFood real):
 *
 * Passo 1 — Digitar e-mail → envia código OTP no e-mail (login OU cadastro)
 * Passo 2 — Digitar código OTP
 *   - E-mail JÁ TEM conta → loga direto → /home
 *   - E-mail NOVO         → salva email verificado → /verify-phone (pede celular)
 */

import { validateEmail } from '../models/AuthModel.js'
import { apiRequestLoginCode, apiLogin, apiSendEmailCode, apiVerifyEmailCode, saveToken } from '../services/api.js'

export class EmailInputController {
  constructor(view, router) {
    this._view        = view
    this._router      = router
    this._email       = ''
    this._modo        = 'login'   // 'login' | 'register'
  }

  init() {
    this._view.render()
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(()   => this._handleContinuar())
    this._view.onBack(()        => this._router.navigate('/auth'))
    this._view.onBackOtp(()     => { this._view.showStep(1); this._view.clearOtpError() })
    this._view.onConfirmarOtp(() => this._handleConfirmarOtp())
    this._view.onReenviarOtp(() => this._handleReenviarOtp())
  }

  // ── Passo 1: sempre envia código no e-mail ────────────────────────────

  async _handleContinuar() {
    const email = this._view.getEmail()
    this._view.clearError()

    const err = validateEmail(email)
    if (err) { this._view.showError(err); return }

    this._email = email
    this._view.setLoading(true)

    try {
      // Tenta como login primeiro
      await apiRequestLoginCode({ identificador: email, canal: 'email' })
      this._modo = 'login'
    } catch (e) {
      const msg = (e.message ?? '').toLowerCase()
      if (msg.includes('não encontrado') || msg.includes('nao encontrado')) {
        // Email novo — envia código via SendGrid mesmo assim
        try {
          await apiSendEmailCode(email)
          this._modo = 'register'
        } catch (e2) {
          this._view.showToast(e2.message || 'Erro ao enviar o código.', 'error')
          this._view.setLoading(false)
          return
        }
      } else {
        this._view.showToast(e.message || 'Erro ao enviar o código.', 'error')
        this._view.setLoading(false)
        return
      }
    }

    // Avança para passo 2 independente do modo
    this._view.setOtpEmailDisplay(email)
    this._view.showStep(2)
    this._view.clearOtpInputs()
    this._view.focusFirstOtp()
    this._view.setLoading(false)
  }

  // ── Passo 2: verificar código ─────────────────────────────────────────

  async _handleConfirmarOtp() {
    const code = this._view.getOtpCode()
    this._view.clearOtpError()

    if (code.length < 6) {
      this._view.showOtpError('Digite os 6 dígitos do código')
      return
    }

    this._view.setOtpLoading(true)
    try {
      if (this._modo === 'login') {
        // Usuário existente → loga direto
        const result = await apiLogin({ identificador: this._email, codigo: code, canal: 'email' })
        if (result.access_token) saveToken(result.access_token)
        if (result.usuario) localStorage.setItem('ifood_user', JSON.stringify(result.usuario))
        this._view.showToast('Login realizado com sucesso!', 'success')
        setTimeout(() => this._router.navigate('/home'), 600)
      } else {
        // Email novo → verifica código e vai para celular
        await apiVerifyEmailCode(this._email, code)
        sessionStorage.setItem('ifood_verified_email', this._email)
        this._view.showToast('E-mail verificado!', 'success')
        setTimeout(() => this._router.navigate('/verify-phone'), 600)
      }
    } catch (err) {
      const msg = (err.message ?? '').toLowerCase()
      if (msg.includes('expirado')) {
        this._view.showOtpError('Código expirado. Solicite um novo.')
      } else if (msg.includes('inválido') || msg.includes('incorreto')) {
        this._view.showOtpError('Código incorreto. Verifique e tente novamente.')
      } else {
        this._view.showOtpError(err.message || 'Código inválido. Tente novamente.')
      }
    } finally {
      this._view.setOtpLoading(false)
    }
  }

  // ── Reenviar ──────────────────────────────────────────────────────────

  async _handleReenviarOtp() {
    if (!this._email) return
    try {
      if (this._modo === 'login') {
        await apiRequestLoginCode({ identificador: this._email, canal: 'email' })
      } else {
        await apiSendEmailCode(this._email)
      }
      this._view.showToast('Novo código enviado para ' + this._email, 'success')
      this._view.clearOtpInputs()
      this._view.clearOtpError()
      this._view.focusFirstOtp()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
