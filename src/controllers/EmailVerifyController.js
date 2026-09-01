/**
 * EmailVerifyController
 *
 * Gerencia o fluxo de verificação de e-mail em 2 passos:
 *  Passo 1 — Usuário informa nome, e-mail e senha
 *            → backend cria a conta E envia código de verificação para o e-mail
 *  Passo 2 — Usuário digita o código de 6 dígitos recebido no e-mail
 *            → backend ativa a conta
 *            → frontend navega para /login
 *
 * Pré-requisito: sessionStorage.ifood_verified_phone deve estar preenchido
 * (definido pelo PhoneVerifyController após validar o celular).
 */

import {
  validateName,
  validateEmail,
  validatePassword,
  validateCode,
  registerAndSendEmailCode,
  resendEmailCode,
  verifyEmailCode,
} from '../models/AuthModel.js'

export class EmailVerifyController {
  /**
   * @param {import('../views/EmailVerifyView.js').EmailVerifyView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view  = view
    this._router = router
    this._email  = ''
  }

  init() {
    // Garante que o celular foi verificado antes de entrar aqui
    const phone = sessionStorage.getItem('ifood_verified_phone')
    if (!phone) {
      this._router.navigate('/verify-phone')
      return
    }
    this._phone = phone

    this._view.render()
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  // ── Binding ────────────────────────────────────────────────────────────

  _bindEvents() {
    const v = this._view

    // Passo 1
    v.onSendEmailCode(()  => this._handleSendEmailCode())
    v.onBackToForm(()     => this._router.navigate('/verify-phone'))

    // Passo 2
    v.onVerifyEmailCode(() => this._handleVerifyEmailCode())
    v.onResendEmail(()    => this._handleResendEmail())
    v.onBackToEmailCode(() => { v.showStep(1); v.clearEmailCodeError() })

    // Validação inline nos campos do formulário
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

  // ── Passo 1: Cadastrar e enviar código no e-mail ──────────────────────

  async _handleSendEmailCode() {
    const { name, email, password } = this._view.getFormData()
    const v = this._view

    // Limpa erros anteriores
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

    this._email = email

    v.setSendLoading(true)
    try {
      await registerAndSendEmailCode({
        name,
        email,
        password,
        phone: this._phone,
      })

      v.setEmailDisplay(email)
      v.showStep(2)
      v.clearEmailCodeInputs()
      v.focusFirstEmailCodeInput()
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('e-mail') || msg.toLowerCase().includes('cadastrado')) {
        v.showFieldError('email-address', 'Este e-mail já está cadastrado.')
      } else {
        v.showToast(msg || 'Erro ao criar conta. Tente novamente.', 'error')
      }
    } finally {
      v.setSendLoading(false)
    }
  }

  // ── Passo 2: Verificar código do e-mail ───────────────────────────────

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
      await verifyEmailCode(this._email, code)

      // Limpa o telefone verificado do sessionStorage — fluxo concluído
      sessionStorage.removeItem('ifood_verified_phone')

      this._view.showToast('Conta criada com sucesso! Faça login para continuar.', 'success')
      setTimeout(() => this._router.navigate('/login'), 1200)
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

  // ── Reenviar código de e-mail ─────────────────────────────────────────

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
