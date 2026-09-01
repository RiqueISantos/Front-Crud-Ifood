/**
 * PhoneVerifyController
 *
 * Gerencia o fluxo de verificação de celular em 2 passos:
 *  Passo 1 — Usuário digita DDD + número → backend envia código via WhatsApp/SMS
 *  Passo 2 — Usuário digita o código de 6 dígitos → backend valida
 *
 * Ao verificar com sucesso, navega para /verify-email
 * e salva o telefone no sessionStorage para o próximo passo usar.
 */

import {
  validatePhone,
  validateCode,
  buildPhoneString,
  formatPhoneDisplay,
  sendSmsCode,
  verifySmsCode,
  maskPhoneNumber,
} from '../models/AuthModel.js'

export class PhoneVerifyController {
  /**
   * @param {import('../views/PhoneVerifyView.js').PhoneVerifyView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._phone  = ''   // número completo (DDD + número, só dígitos)
  }

  init() {
    this._view.render()
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  // ── Binding ────────────────────────────────────────────────────────────

  _bindEvents() {
    const v = this._view

    // Passo 1
    v.onSendSms(()     => this._handleSendSms())
    v.onBackPhone(()   => this._router.navigate('/auth'))

    // Passo 2
    v.onVerifyCode(()  => this._handleVerifyCode())
    v.onResend(()      => this._handleResend())
    v.onBackCode(()    => { v.showStep(1); v.clearCodeError() })

    // Máscara no campo de número
    const numberInput = document.getElementById('phone-number')
    numberInput?.addEventListener('input', () => {
      const raw = numberInput.value.replace(/\D/g, '')
      numberInput.value = maskPhoneNumber(raw)
    })

    // Avança foco do DDD para o número quando preencher 2 dígitos
    const dddInput = document.getElementById('phone-ddd')
    dddInput?.addEventListener('input', () => {
      dddInput.value = dddInput.value.replace(/\D/g, '').slice(0, 2)
      if (dddInput.value.length === 2) {
        document.getElementById('phone-number')?.focus()
      }
    })

    // Enter no celular dispara envio
    document.getElementById('phone-number')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleSendSms()
    })
  }

  // ── Passo 1: Enviar SMS ───────────────────────────────────────────────

  async _handleSendSms() {
    const { ddd, number } = this._view.getPhone()
    this._view.clearPhoneError()

    const error = validatePhone(ddd, number)
    if (error) {
      this._view.showPhoneError(error)
      return
    }

    this._phone = buildPhoneString(ddd, number)
    const displayPhone = formatPhoneDisplay(ddd, number)

    this._view.setSendLoading(true)
    try {
      await sendSmsCode(this._phone)
      this._view.setPhoneDisplay(displayPhone)
      this._view.showStep(2)
      this._view.clearCodeInputs()
      this._view.focusFirstCodeInput()
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('número') || msg.toLowerCase().includes('twilio')) {
        this._view.showPhoneError('Número inválido ou não suportado. Verifique e tente novamente.')
      } else {
        this._view.showToast(msg || 'Erro ao enviar o código. Tente novamente.', 'error')
      }
    } finally {
      this._view.setSendLoading(false)
    }
  }

  // ── Passo 2: Verificar código ─────────────────────────────────────────

  async _handleVerifyCode() {
    const code = this._view.getCode()
    this._view.clearCodeError()

    const error = validateCode(code)
    if (error) {
      this._view.showCodeError(error)
      return
    }

    this._view.setVerifyLoading(true)
    try {
      await verifySmsCode(this._phone, code)

      // Salva o telefone verificado para a próxima tela usar
      sessionStorage.setItem('ifood_verified_phone', this._phone)

      this._view.showToast('Celular verificado com sucesso!', 'success')
      setTimeout(() => this._router.navigate('/verify-email'), 600)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('expirado')) {
        this._view.showCodeError('Código expirado. Solicite um novo.')
      } else if (msg.toLowerCase().includes('inválido') || msg.toLowerCase().includes('incorreto')) {
        this._view.showCodeError('Código incorreto. Verifique e tente novamente.')
      } else {
        this._view.showCodeError(msg || 'Código inválido. Tente novamente.')
      }
    } finally {
      this._view.setVerifyLoading(false)
    }
  }

  // ── Reenviar código ───────────────────────────────────────────────────

  async _handleResend() {
    if (!this._phone) return
    try {
      await sendSmsCode(this._phone)
      this._view.showToast('Novo código enviado pelo WhatsApp!', 'success')
      this._view.clearCodeInputs()
      this._view.clearCodeError()
      this._view.focusFirstCodeInput()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
