/**
 * EmailVerifyController
 *
 * Fluxo:
 *  Passo 1 — Usuário informa nome, e-mail e senha
 *            → backend envia código de verificação para o e-mail
 *  Passo 2 — Usuário digita o código de 6 dígitos
 *            → backend verifica o código
 *            → frontend cria a conta com POST /usuarios/
 *            → navega para /login
 *
 * Pré-requisito: sessionStorage.ifood_verified_phone deve estar preenchido.
 */

import {
  validateName,
  validateEmail,
  validatePassword,
  validateCode,
  resendEmailCode,
  verifyEmailCode,
} from '../models/AuthModel.js'

import { apiSendEmailCode, apiRegister } from '../services/api.js'

export class EmailVerifyController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
    this._name   = ''
    this._phone  = ''
  }

  init() {
    const phone = sessionStorage.getItem('ifood_verified_phone')
    if (!phone) {
      this._router.navigate('/verify-phone')
      return
    }
    this._phone = phone

    // Se veio do fluxo de email, o email já foi verificado
    const emailJaVerificado = sessionStorage.getItem('ifood_verified_email')
    if (emailJaVerificado) {
      this._email = emailJaVerificado
    }

    this._view.render()
    this._bindEvents()

    // Se email já verificado, preenche o campo e vai direto para o passo 1 (só nome)
    if (emailJaVerificado) {
      const emailField = document.getElementById('email-address')
      if (emailField) {
        emailField.value = emailJaVerificado
        emailField.readOnly = true
        emailField.style.background = 'var(--gray-50)'
      }
    }

    this._view.showStep(1)
  }

  destroy() {}

  _bindEvents() {
    const v = this._view

    v.onSendEmailCode(()  => this._handleSendEmailCode())
    v.onBackToForm(()     => this._router.navigate('/verify-phone'))

    v.onVerifyEmailCode(() => this._handleVerifyEmailCode())
    v.onResendEmail(()    => this._handleResendEmail())
    v.onBackToEmailCode(() => { v.showStep(1); v.clearEmailCodeError() })

    document.getElementById('email-address')?.addEventListener('blur', () => {
      const val = document.getElementById('email-address')?.value ?? ''
      const err = validateEmail(val)
      err ? v.showFieldError('email-address', err) : v.clearFieldError('email-address')
    })

    document.getElementById('email-password')?.addEventListener('blur', () => {
      const val = document.getElementById('email-password')?.value ?? ''
      const err = validatePassword(val)
      err ? v.showFieldError('email-password', err) : v.clearFieldError('email-password')
    })
  }

  // ── Passo 1: validar campos e enviar código no e-mail ─────────────────

  async _handleSendEmailCode() {
    const { name, email, password } = this._view.getFormData()
    const v = this._view

    v.clearFieldError('email-name')
    v.clearFieldError('email-address')
    v.clearFieldError('email-password')

    const nameErr  = validateName(name)
    const emailErr = validateEmail(email)
    const passErr  = validatePassword(password)

    if (nameErr)  v.showFieldError('email-name',     nameErr)
    if (emailErr) v.showFieldError('email-address',  emailErr)
    if (passErr)  v.showFieldError('email-password', passErr)
    if (nameErr || emailErr || passErr) return

    this._email    = email
    this._name     = name
    this._password = password

    // Se email já foi verificado antes (veio do fluxo email → celular), cria conta direto
    const emailJaVerificado = sessionStorage.getItem('ifood_verified_email')
    if (emailJaVerificado && emailJaVerificado === email) {
      v.setSendLoading(true)
      try {
        await apiRegister({
          nome:     this._name,
          email:    this._email,
          telefone: this._phone,
        })
        sessionStorage.removeItem('ifood_verified_phone')
        sessionStorage.removeItem('ifood_verified_email')
        v.showToast('Conta criada com sucesso! Entre para continuar.', 'success')
        setTimeout(() => this._router.navigate('/auth'), 1200)
      } catch (err) {
        v.showToast(err.message || 'Erro ao criar conta.', 'error')
      } finally {
        v.setSendLoading(false)
      }
      return
    }

    v.setSendLoading(true)
    try {
      await apiSendEmailCode(email)
      v.setEmailDisplay(email)
      v.showStep(2)
      v.clearEmailCodeInputs()
      v.focusFirstEmailCodeInput()
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('cadastrado')) {
        v.showFieldError('email-address', 'Este e-mail já está cadastrado.')
      } else {
        v.showToast(msg || 'Erro ao enviar o código. Tente novamente.', 'error')
      }
    } finally {
      v.setSendLoading(false)
    }
  }

  // ── Passo 2: verificar código e criar a conta ─────────────────────────

  async _handleVerifyEmailCode() {
    const code = this._view.getEmailCode()
    this._view.clearEmailCodeError()

    const error = validateCode(code)
    if (error) {
      this._view.showEmailCodeError(error)
      return
    }

    this._view.setVerifyLoading(true)
    try {
      // 1. Verifica o código no backend
      await verifyEmailCode(this._email, code)

      // 2. Cria o usuário (celular e e-mail já verificados)
      await apiRegister({
        nome:     this._name,
        email:    this._email,
        telefone: this._phone,
      })

      sessionStorage.removeItem('ifood_verified_phone')

      this._view.showToast('Conta criada com sucesso! Entre com seu celular para continuar.', 'success')
      setTimeout(() => this._router.navigate('/auth'), 1200)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('expirado')) {
        this._view.showEmailCodeError('Código expirado. Solicite um novo.')
      } else if (msg.toLowerCase().includes('inválido') || msg.toLowerCase().includes('incorreto')) {
        this._view.showEmailCodeError('Código incorreto. Verifique e tente novamente.')
      } else {
        this._view.showEmailCodeError(msg || 'Código inválido. Tente novamente.')
      }
    } finally {
      this._view.setVerifyLoading(false)
    }
  }

  // ── Reenviar código ───────────────────────────────────────────────────

  async _handleResendEmail() {
    if (!this._email) return
    try {
      await resendEmailCode(this._email)
      this._view.showToast('Novo código enviado para ' + this._email, 'success')
      this._view.clearEmailCodeInputs()
      this._view.clearEmailCodeError()
      this._view.focusFirstEmailCodeInput()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
