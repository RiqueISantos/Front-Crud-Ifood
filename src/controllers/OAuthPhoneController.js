/**
 * OAuthPhoneController
 *
 * Confirma o celular após login com Google.
 * - Se o usuário já tem telefone: exibe mascarado e envia código diretamente
 * - Se não tem: pede para digitar
 * Após confirmação do OTP → chama /auth/google/confirmar → salva JWT → /home
 */

import { validatePhone, buildPhoneString, formatPhoneDisplay, validateCode } from '../models/AuthModel.js'
import { saveToken } from '../services/api.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export class OAuthPhoneController {
  /**
   * @param {import('../views/OAuthPhoneView.js').OAuthPhoneView} view
   * @param {import('../router/Router.js').Router} router
   * @param {{ tempToken: string, temTelefone: boolean, usuario: object }} state
   */
  constructor(view, router, state) {
    this._view        = view
    this._router      = router
    this._tempToken   = state.tempToken
    this._temTelefone = state.temTelefone
    this._usuario     = state.usuario   // { id, nome, email, telefone }
    this._telefone    = state.usuario.telefone || ''  // preenchido após digitação
  }

  init() {
    this._view.render(this._usuario, this._temTelefone)
    this._bindEvents()
    this._view.showStep(1)
  }

  destroy() {}

  _bindEvents() {
    this._view.onSend(()        => this._handleSend())
    this._view.onNotMyNumber(() => this._handleNotMyNumber())
    this._view.onVerify(()      => this._handleVerify())
    this._view.onResend(()      => this._handleResend())
    this._view.onBackPhone(()   => this._router.navigate('/auth'))
    this._view.onBackCode(()    => { this._view.showStep(1); this._view.clearCodeError() })

    // Máscara no input de número (apenas quando não tem telefone)
    if (!this._temTelefone) {
      document.getElementById('phone-ddd')?.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2)
        if (e.target.value.length === 2) document.getElementById('phone-number')?.focus()
      })
    }
  }

  // ── Enviar OTP ────────────────────────────────────────────────────────────

  async _handleSend() {
    this._view.clearPhoneError?.()

    // Resolve qual telefone usar
    if (this._temTelefone) {
      // Usa o telefone já cadastrado
      this._telefone = this._usuario.telefone
    } else {
      const { ddd, number } = this._view.getPhone()
      const err = validatePhone(ddd, number)
      if (err) { this._view.showPhoneError(err); return }
      this._telefone = buildPhoneString(ddd, number)
    }

    this._view.setSendLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/google/enviar-sms`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ temp_token: this._tempToken, telefone: this._telefone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao enviar código')

      const display = this._temTelefone
        ? this._usuario.telefone
        : formatPhoneDisplay(this._view.getPhone().ddd, this._view.getPhone().number)

      this._view.setPhoneSentDisplay(display)
      this._view.showStep(2)
      this._view.clearCodeInputs()
      this._view.focusFirstCode()
    } catch (e) {
      this._view.showToast(e.message || 'Erro ao enviar código.', 'error')
    } finally {
      this._view.setSendLoading(false)
    }
  }

  // ── "Este não é seu número?" — permite digitar outro ─────────────────────

  _handleNotMyNumber() {
    // Re-renderiza sem o flag temTelefone para mostrar os inputs
    this._temTelefone = false
    this._view.render(this._usuario, false)
    this._bindEvents()
    this._view.showStep(1)
  }

  // ── Verificar código ──────────────────────────────────────────────────────

  async _handleVerify() {
    const codigo = this._view.getCode()
    this._view.clearCodeError()

    const err = validateCode(codigo)
    if (err) { this._view.showCodeError(err); return }

    this._view.setVerifyLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/auth/google/confirmar`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          temp_token: this._tempToken,
          telefone:   this._telefone,
          codigo,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Código inválido')

      // Salva token e usuário
      saveToken(data.access_token)
      if (data.usuario) {
        try { localStorage.setItem('ifood_user', JSON.stringify(data.usuario)) } catch {}
      }

      this._view.showToast('Celular confirmado! Bem-vindo ao iFood 🎉', 'success')
      setTimeout(() => this._router.navigate('/home'), 700)
    } catch (e) {
      const msg = e.message || ''
      if (msg.toLowerCase().includes('expirado')) {
        this._view.showCodeError('Código expirado. Solicite um novo.')
      } else if (msg.toLowerCase().includes('inválido') || msg.toLowerCase().includes('incorreto')) {
        this._view.showCodeError('Código incorreto. Verifique e tente novamente.')
      } else {
        this._view.showCodeError(msg || 'Erro ao confirmar. Tente novamente.')
      }
    } finally {
      this._view.setVerifyLoading(false)
    }
  }

  // ── Reenviar ──────────────────────────────────────────────────────────────

  async _handleResend() {
    if (!this._telefone) return
    try {
      const res = await fetch(`${BASE_URL}/auth/google/enviar-sms`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ temp_token: this._tempToken, telefone: this._telefone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao reenviar')
      this._view.showToast('Novo código enviado!', 'success')
      this._view.clearCodeInputs()
      this._view.clearCodeError()
      this._view.focusFirstCode()
    } catch (e) {
      this._view.showToast(e.message || 'Erro ao reenviar.', 'error')
    }
  }
}
