/**
 * PhoneVerifyController
 *
 * Fluxo unificado (igual iFood real):
 *  Passo 1 — Usuário digita celular
 *            → tenta login/solicitar
 *            → se número não existe, cai em sms/enviar (cadastro)
 *  Passo 2 — Usuário digita código
 *            → se veio de login: autentica e vai para /home
 *            → se veio de cadastro: salva telefone e vai para /verify-email
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

import { apiRequestLoginCode, apiLogin, saveToken } from '../services/api.js'

export class PhoneVerifyController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._phone  = ''
    this._mode   = 'login' // começa tentando login, muda para 'register' se não encontrar
  }

  init() {
    this._view.render()
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  _bindEvents() {
    const v = this._view

    v.onSendSms(()    => this._handleSendSms())
    v.onBackPhone(()  => this._router.navigate('/auth'))
    v.onVerifyCode(() => this._handleVerifyCode())
    v.onResend(()     => this._handleResend())
    v.onBackCode(()   => { v.showStep(1); v.clearCodeError() })

    const numberInput = document.getElementById('phone-number')
    numberInput?.addEventListener('input', () => {
      const raw = numberInput.value.replace(/\D/g, '')
      numberInput.value = maskPhoneNumber(raw)
    })

    const dddInput = document.getElementById('phone-ddd')
    dddInput?.addEventListener('input', () => {
      dddInput.value = dddInput.value.replace(/\D/g, '').slice(0, 2)
      if (dddInput.value.length === 2) {
        document.getElementById('phone-number')?.focus()
      }
    })

    document.getElementById('phone-number')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleSendSms()
    })
  }

  // ── Passo 1: tentar login; se não existir, cadastrar ─────────────────

  async _handleSendSms() {
    const { ddd, number } = this._view.getPhone()
    this._view.clearPhoneError()

    const error = validatePhone(ddd, number)
    if (error) { this._view.showPhoneError(error); return }

    this._phone = buildPhoneString(ddd, number)
    const displayPhone = formatPhoneDisplay(ddd, number)

    this._view.setSendLoading(true)
    try {
      // Tenta primeiro como login
      await apiRequestLoginCode({ identificador: this._phone, canal: 'sms' })
      this._mode = 'login'
    } catch (loginErr) {
      const msg = loginErr.message ?? ''
      if (msg.toLowerCase().includes('não encontrado') || msg.toLowerCase().includes('nao encontrado')) {
        // Número novo → fluxo de cadastro
        try {
          await sendSmsCode(this._phone)
          this._mode = 'register'
        } catch (registerErr) {
          const regMsg = registerErr.message ?? ''
          this._view.showToast(regMsg || 'Erro ao enviar o código.', 'error')
          this._view.setSendLoading(false)
          return
        }
      } else if (msg.toLowerCase().includes('twilio') || msg.toLowerCase().includes('número')) {
        this._view.showPhoneError('Número inválido ou não suportado.')
        this._view.setSendLoading(false)
        return
      } else {
        this._view.showToast(msg || 'Erro ao enviar o código. Tente novamente.', 'error')
        this._view.setSendLoading(false)
        return
      }
    }

    this._view.setPhoneDisplay(displayPhone)
    this._view.showStep(2)
    this._view.clearCodeInputs()
    this._view.focusFirstCodeInput()
    this._view.setSendLoading(false)
  }

  // ── Passo 2: verificar código ─────────────────────────────────────────

  async _handleVerifyCode() {
    const code = this._view.getCode()
    this._view.clearCodeError()

    const error = validateCode(code)
    if (error) { this._view.showCodeError(error); return }

    this._view.setVerifyLoading(true)
    try {
      if (this._mode === 'login') {
        const result = await apiLogin({ identificador: this._phone, codigo: code, canal: 'sms' })
        if (result.access_token) saveToken(result.access_token)
        if (result.usuario) localStorage.setItem('ifood_user', JSON.stringify(result.usuario))
        this._view.showToast('Login realizado com sucesso!', 'success')
        setTimeout(() => this._router.navigate('/home'), 600)
      } else {
        await verifySmsCode(this._phone, code)
        sessionStorage.setItem('ifood_verified_phone', this._phone)
        this._view.showToast('Celular verificado!', 'success')
        setTimeout(() => this._router.navigate('/verify-email'), 600)
      }
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
      if (this._mode === 'login') {
        await apiRequestLoginCode({ identificador: this._phone, canal: 'sms' })
      } else {
        await sendSmsCode(this._phone)
      }
      this._view.showToast('Novo código enviado pelo WhatsApp!', 'success')
      this._view.clearCodeInputs()
      this._view.clearCodeError()
      this._view.focusFirstCodeInput()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao reenviar. Tente novamente.', 'error')
    }
  }
}
