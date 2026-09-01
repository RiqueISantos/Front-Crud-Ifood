/**
 * EmailInputView
 *
 * Fluxo em 2 passos:
 *  Passo 1 — Digitar e-mail
 *  Passo 2 — Digitar código OTP recebido no e-mail (login)
 *             OU seguir para /verify-phone (cadastro novo)
 */

export class EmailInputView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="email-input-page">

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

        <!-- Ilustração -->
        <div class="auth-illustration" aria-hidden="true">
          <div class="auth-illustration__circle"></div>
        </div>

        <!-- ── PASSO 1: digitar e-mail ── -->
        <div class="email-input-panel" id="step-email-input">

          <button type="button" class="verify-back" id="btn-back-email-input" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <h1 class="email-input-panel__title">Informe o seu e-mail<br>para continuar</h1>

          <div class="email-input-group">
            <input
              type="email"
              class="email-input-field"
              id="email-input-field"
              placeholder="Informe o seu e-mail"
              autocomplete="email"
              inputmode="email"
              aria-label="E-mail"
              aria-required="true"
            />
            <span class="email-input-error" id="email-input-error" role="alert" aria-live="polite"></span>
          </div>

          <p class="email-input-notice">
            O iFood poderá enviar comunicações neste e-mail. Caso não queira
            receber comunicações nesse canal, é só acessar a opção "Configurações"
            no aplicativo ou se desinscrever na sua caixa de e-mail.
          </p>

          <button type="button" class="email-input-btn" id="btn-email-continuar">
            Continuar
          </button>

        </div>

        <!-- ── PASSO 2: código OTP (só para login) ── -->
        <div class="email-input-panel" id="step-email-otp" hidden>

          <button type="button" class="verify-back" id="btn-back-otp" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="email-input-panel__title">Digite o<br>código</h1>
          <p class="verify-panel__subtitle">
            Enviamos um código para <strong id="otp-email-display"></strong>. Verifique sua caixa de entrada.
          </p>

          <div class="verify-code-inputs" role="group" aria-label="Código de 6 dígitos">
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1" />
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2" />
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3" />
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4" />
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5" />
            <input type="tel" class="verify-code-digit otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6" />
          </div>
          <span class="verify-error" id="otp-error" role="alert" aria-live="polite"></span>

          <button type="button" class="email-input-btn" id="btn-otp-confirmar">
            Confirmar
          </button>

          <button type="button" class="verify-resend" id="btn-otp-reenviar">
            Reenviar código
          </button>

        </div>

      </div>
    `
    this._bindOtpInputs()
  }

  // ── Passos ────────────────────────────────────────────────────────────────

  showStep(step) {
    const s1 = document.getElementById('step-email-input')
    const s2 = document.getElementById('step-email-otp')
    if (step === 1) {
      s1?.removeAttribute('hidden'); if (s1) s1.style.display = 'flex'
      s2?.setAttribute('hidden', ''); if (s2) s2.style.display = 'none'
    } else {
      s1?.setAttribute('hidden', ''); if (s1) s1.style.display = 'none'
      s2?.removeAttribute('hidden'); if (s2) s2.style.display = 'flex'
    }
  }

  setOtpEmailDisplay(email) {
    const el = document.getElementById('otp-email-display')
    if (el) el.textContent = email
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getEmail() {
    return (document.getElementById('email-input-field')?.value ?? '').trim()
  }

  getOtpCode() {
    return [...document.querySelectorAll('.otp-digit')].map(i => i.value).join('')
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showError(msg) {
    const el    = document.getElementById('email-input-error')
    const input = document.getElementById('email-input-field')
    if (el)    el.textContent = msg
    if (input) input.classList.add('error')
  }

  clearError() {
    const el    = document.getElementById('email-input-error')
    const input = document.getElementById('email-input-field')
    if (el)    el.textContent = ''
    if (input) input.classList.remove('error')
  }

  showOtpError(msg) {
    const el = document.getElementById('otp-error')
    if (el) el.textContent = msg
    document.querySelectorAll('.otp-digit').forEach(i => i.classList.add('error'))
  }

  clearOtpError() {
    const el = document.getElementById('otp-error')
    if (el) el.textContent = ''
    document.querySelectorAll('.otp-digit').forEach(i => i.classList.remove('error'))
  }

  clearOtpInputs() {
    document.querySelectorAll('.otp-digit').forEach(i => { i.value = '' })
  }

  focusFirstOtp() {
    document.querySelector('.otp-digit')?.focus()
  }

  setLoading(loading) {
    const btn = document.getElementById('btn-email-continuar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Continuar'
  }

  setOtpLoading(loading) {
    const btn = document.getElementById('btn-otp-confirmar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Confirmar'
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('email-input-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'email-input-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onContinuar(handler) {
    document.getElementById('btn-email-continuar')?.addEventListener('click', handler)
    document.getElementById('email-input-field')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handler()
    })
  }

  onBack(handler) {
    document.getElementById('btn-back-email-input')?.addEventListener('click', handler)
  }

  onBackOtp(handler) {
    document.getElementById('btn-back-otp')?.addEventListener('click', handler)
  }

  onConfirmarOtp(handler) {
    document.getElementById('btn-otp-confirmar')?.addEventListener('click', handler)
  }

  onReenviarOtp(handler) {
    document.getElementById('btn-otp-reenviar')?.addEventListener('click', handler)
  }

  // ── OTP inputs ────────────────────────────────────────────────────────────

  _bindOtpInputs() {
    const digits = [...document.querySelectorAll('.otp-digit')]
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
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6)
        pasted.split('').forEach((ch, i) => { if (digits[i]) digits[i].value = ch })
        ;(digits.find(d => !d.value) ?? digits[digits.length - 1]).focus()
      })
    })
  }
}
