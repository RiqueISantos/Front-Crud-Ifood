/**
 * EmailVerifyView
 *
 * Aparece depois que o celular foi verificado com sucesso.
 * Fluxo em 2 passos:
 *  Passo 1 — Digitar e-mail + senha (cadastro de conta)
 *  Passo 2 — Digitar o código enviado para o e-mail
 *
 * Após o passo 2 → redireciona para /login.
 */

const icons = {
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
}

export class EmailVerifyView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="verify-page">

        <!-- Logo -->
        <a href="#/" class="auth-logo" aria-label="iFood – página inicial">
          <span class="auth-logo__text">iFood</span>
        </a>

        <!-- Botão ajuda -->
        <button type="button" class="auth-help" aria-label="Ajuda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- Ilustração esquerda -->
        <div class="auth-illustration" aria-hidden="true">
          <div class="auth-illustration__circle"></div>
        </div>

        <!-- ── PASSO 1: e-mail + senha + nome ── -->
        <div class="verify-panel" id="step-email-form">
          <button type="button" class="verify-back" id="btn-back-email" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Quase lá!<br>Informe seu e-mail</h1>
          <p class="verify-panel__subtitle">Vamos enviar um código de verificação para o seu e-mail.</p>

          <div class="verify-form-group">
            <label class="verify-label" for="email-name">Nome completo</label>
            <input
              type="text"
              class="verify-input-full"
              id="email-name"
              placeholder="Seu nome"
              autocomplete="name"
              aria-required="true"
            />
            <span class="verify-error" id="email-name-error" role="alert" aria-live="polite"></span>
          </div>

          <div class="verify-form-group">
            <label class="verify-label" for="email-address">E-mail</label>
            <input
              type="email"
              class="verify-input-full"
              id="email-address"
              placeholder="seu@email.com"
              autocomplete="email"
              inputmode="email"
              aria-required="true"
            />
            <span class="verify-error" id="email-address-error" role="alert" aria-live="polite"></span>
          </div>

          <div class="verify-form-group">
            <label class="verify-label" for="email-password">Senha</label>
            <div class="verify-password-wrap">
              <input
                type="password"
                class="verify-input-full"
                id="email-password"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
                aria-required="true"
              />
              <button type="button" class="verify-eye-btn" id="toggle-email-password" aria-label="Mostrar senha">
                ${icons.eye}
              </button>
            </div>
            <span class="verify-error" id="email-password-error" role="alert" aria-live="polite"></span>
          </div>

          <button type="button" class="verify-btn-submit" id="btn-send-email-code">
            Enviar código no e-mail
          </button>
        </div>

        <!-- ── PASSO 2: código do e-mail ── -->
        <div class="verify-panel" id="step-email-code" hidden>
          <button type="button" class="verify-back" id="btn-back-email-code" aria-label="Voltar para e-mail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Confirme<br>seu e-mail</h1>
          <p class="verify-panel__subtitle">
            Enviamos um código para <strong id="email-display"></strong>. Verifique sua caixa de entrada.
          </p>

          <!-- Inputs do código (6 dígitos) -->
          <div class="verify-code-inputs" role="group" aria-label="Código de verificação de e-mail de 6 dígitos">
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1" />
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2" />
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3" />
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4" />
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5" />
            <input type="tel" class="verify-code-digit email-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6" />
          </div>
          <span class="verify-error" id="email-code-error" role="alert" aria-live="polite"></span>

          <button type="button" class="verify-btn-submit" id="btn-verify-email-code">
            Confirmar
          </button>

          <button type="button" class="verify-resend" id="btn-resend-email">
            Reenviar código
          </button>
        </div>

      </div>
    `

    this._bindCodeInputs()
    this._bindPasswordToggle()
  }

  // ── Controle de passos ────────────────────────────────────────────────────

  showStep(step) {
    const s1 = document.getElementById('step-email-form')
    const s2 = document.getElementById('step-email-code')
    if (step === 1) {
      if (s1) { s1.style.display = 'flex'; s1.removeAttribute('hidden') }
      if (s2) { s2.style.display = 'none';  s2.setAttribute('hidden', '') }
    } else {
      if (s1) { s1.style.display = 'none';  s1.setAttribute('hidden', '') }
      if (s2) { s2.style.display = 'flex';  s2.removeAttribute('hidden') }
    }
  }

  setEmailDisplay(email) {
    const el = document.getElementById('email-display')
    if (el) el.textContent = email
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getFormData() {
    return {
      name:     (document.getElementById('email-name')?.value     ?? '').trim(),
      email:    (document.getElementById('email-address')?.value  ?? '').trim(),
      password: (document.getElementById('email-password')?.value ?? ''),
    }
  }

  getEmailCode() {
    return [...document.querySelectorAll('.email-digit')]
      .map(i => i.value)
      .join('')
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showFieldError(id, msg) {
    const errEl = document.getElementById(`${id}-error`)
    const input = document.getElementById(id)
    if (errEl) errEl.textContent = msg
    if (input) input.classList.add('error')
  }

  clearFieldError(id) {
    const errEl = document.getElementById(`${id}-error`)
    const input = document.getElementById(id)
    if (errEl) errEl.textContent = ''
    if (input) input.classList.remove('error')
  }

  showEmailCodeError(msg) {
    const el = document.getElementById('email-code-error')
    if (el) el.textContent = msg
    document.querySelectorAll('.email-digit').forEach(i => i.classList.add('error'))
  }

  clearEmailCodeError() {
    const el = document.getElementById('email-code-error')
    if (el) el.textContent = ''
    document.querySelectorAll('.email-digit').forEach(i => i.classList.remove('error'))
  }

  setSendLoading(loading) {
    const btn = document.getElementById('btn-send-email-code')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Enviando...' : 'Enviar código no e-mail'
  }

  setVerifyLoading(loading) {
    const btn = document.getElementById('btn-verify-email-code')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Confirmar'
  }

  clearEmailCodeInputs() {
    document.querySelectorAll('.email-digit').forEach(i => { i.value = '' })
  }

  focusFirstEmailCodeInput() {
    document.querySelector('.email-digit')?.focus()
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('email-verify-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'email-verify-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onSendEmailCode(handler) {
    document.getElementById('btn-send-email-code')?.addEventListener('click', handler)
  }

  onVerifyEmailCode(handler) {
    document.getElementById('btn-verify-email-code')?.addEventListener('click', handler)
  }

  onResendEmail(handler) {
    document.getElementById('btn-resend-email')?.addEventListener('click', handler)
  }

  onBackToForm(handler) {
    document.getElementById('btn-back-email')?.addEventListener('click', handler)
  }

  onBackToEmailCode(handler) {
    document.getElementById('btn-back-email-code')?.addEventListener('click', handler)
  }

  // ── Código de e-mail: inputs ──────────────────────────────────────────────

  _bindCodeInputs() {
    const digits = [...document.querySelectorAll('.email-digit')]
    digits.forEach((input, idx) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(-1)
        if (input.value && idx < digits.length - 1) digits[idx + 1].focus()
      })
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) digits[idx - 1].focus()
      })
      input.addEventListener('paste', (e) => {
        e.preventDefault()
        const pasted = (e.clipboardData || window.clipboardData)
          .getData('text').replace(/\D/g, '').slice(0, 6)
        pasted.split('').forEach((ch, i) => { if (digits[i]) digits[i].value = ch })
        const nextEmpty = digits.find(d => !d.value)
        ;(nextEmpty ?? digits[digits.length - 1]).focus()
      })
    })
  }

  _bindPasswordToggle() {
    const btn = document.getElementById('toggle-email-password')
    const input = document.getElementById('email-password')
    if (!btn || !input) return
    btn.addEventListener('click', () => {
      const hidden = input.type === 'password'
      input.type = hidden ? 'text' : 'password'
      btn.innerHTML = hidden ? icons.eyeOff : icons.eye
      btn.setAttribute('aria-label', hidden ? 'Ocultar senha' : 'Mostrar senha')
    })
  }
}
