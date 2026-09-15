/**
 * RestauranteEmailView
 *
 * Tela de email do fluxo de cadastro de restaurante.
 * Passo 1 — Digitar e-mail do restaurante
 * Passo 2 — Digitar código OTP recebido no e-mail
 */

export class RestauranteEmailView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  /**
   * @param {'cadastro'|'login'} modo - define os textos exibidos
   */
  render(modo = 'cadastro') {
    const isCadastro = modo === 'cadastro'
    this._container.innerHTML = /* html */`
      <div class="rest-page">

        <!-- Logo -->
        <a href="#/restaurante" class="rest-logo" aria-label="iFood para restaurantes">
          <span class="rest-logo__text">iFood</span>
          <span class="rest-logo__for">para restaurantes</span>
        </a>

        <!-- Botão ajuda -->
        <button type="button" class="auth-help" aria-label="Ajuda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- Ilustração decorativa -->
        <div class="rest-illustration" aria-hidden="true">
          <div class="rest-illustration__circle"></div>
          <div class="rest-illustration__icon">🍽️</div>
        </div>

        <!-- ── PASSO 1: digitar e-mail ── -->
        <div class="rest-panel" id="step-rest-email">

          <button type="button" class="verify-back" id="btn-back-rest-email" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="rest-panel__title">
            ${isCadastro ? 'Informe o e-mail<br>do seu restaurante' : 'Acesse sua<br>conta parceira'}
          </h1>
          <p class="rest-panel__subtitle">
            ${isCadastro
              ? 'Vamos enviar um código de verificação para confirmar seu e-mail.'
              : 'Digite o e-mail cadastrado para receber seu código de acesso.'}
          </p>

          <div class="rest-field-wrap">
            <label class="rest-label" for="rest-email-input">E-mail do restaurante</label>
            <input
              type="email"
              class="rest-input"
              id="rest-email-input"
              placeholder="contato@seurestaurante.com.br"
              autocomplete="email"
              inputmode="email"
              aria-label="E-mail do restaurante"
              aria-required="true"
            />
            <span class="rest-error" id="rest-email-error" role="alert" aria-live="polite"></span>
          </div>

          <button type="button" class="rest-btn-primary" id="btn-rest-email-continuar">
            Enviar código
          </button>

        </div>

        <!-- ── PASSO 2: código OTP ── -->
        <div class="rest-panel" id="step-rest-otp" hidden>

          <button type="button" class="verify-back" id="btn-back-rest-otp" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="rest-panel__title">Digite o<br>código</h1>
          <p class="rest-panel__subtitle">
            Enviamos um código de 6 dígitos para<br><strong id="rest-otp-email-display"></strong>.<br>
            Verifique sua caixa de entrada.
          </p>

          <div class="verify-code-inputs" role="group" aria-label="Código de verificação de 6 dígitos">
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1" />
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2" />
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3" />
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4" />
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5" />
            <input type="tel" class="verify-code-digit rest-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6" />
          </div>
          <span class="rest-error" id="rest-otp-error" role="alert" aria-live="polite"></span>

          <button type="button" class="rest-btn-primary" id="btn-rest-otp-confirmar">
            Confirmar
          </button>

          <button type="button" class="verify-resend" id="btn-rest-otp-reenviar">
            Reenviar código
          </button>

        </div>

      </div>
    `

    this._bindOtpInputs()
  }

  // ── Passos ────────────────────────────────────────────────────────────────

  showStep(step) {
    const s1 = document.getElementById('step-rest-email')
    const s2 = document.getElementById('step-rest-otp')
    if (step === 1) {
      s1?.removeAttribute('hidden'); if (s1) s1.style.display = 'flex'
      s2?.setAttribute('hidden', ''); if (s2) s2.style.display = 'none'
    } else {
      s1?.setAttribute('hidden', ''); if (s1) s1.style.display = 'none'
      s2?.removeAttribute('hidden'); if (s2) s2.style.display = 'flex'
    }
  }

  setOtpEmailDisplay(email) {
    const el = document.getElementById('rest-otp-email-display')
    if (el) el.textContent = email
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getEmail() {
    return (document.getElementById('rest-email-input')?.value ?? '').trim().toLowerCase()
  }

  getOtpCode() {
    return [...document.querySelectorAll('.rest-otp-digit')].map(i => i.value).join('')
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showEmailError(msg) {
    const el = document.getElementById('rest-email-error')
    const input = document.getElementById('rest-email-input')
    if (el) el.textContent = msg
    if (input) input.classList.add('error')
  }

  clearEmailError() {
    const el = document.getElementById('rest-email-error')
    const input = document.getElementById('rest-email-input')
    if (el) el.textContent = ''
    if (input) input.classList.remove('error')
  }

  showOtpError(msg) {
    const el = document.getElementById('rest-otp-error')
    if (el) el.textContent = msg
    document.querySelectorAll('.rest-otp-digit').forEach(i => i.classList.add('error'))
  }

  clearOtpError() {
    const el = document.getElementById('rest-otp-error')
    if (el) el.textContent = ''
    document.querySelectorAll('.rest-otp-digit').forEach(i => i.classList.remove('error'))
  }

  clearOtpInputs() {
    document.querySelectorAll('.rest-otp-digit').forEach(i => { i.value = '' })
  }

  focusFirstOtp() {
    document.querySelector('.rest-otp-digit')?.focus()
  }

  setEmailLoading(loading) {
    const btn = document.getElementById('btn-rest-email-continuar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Enviando...' : 'Enviar código'
  }

  setOtpLoading(loading) {
    const btn = document.getElementById('btn-rest-otp-confirmar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Confirmar'
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('rest-email-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'rest-email-toast'
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
    document.getElementById('btn-rest-email-continuar')?.addEventListener('click', handler)
    document.getElementById('rest-email-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handler()
    })
  }

  onBack(handler) {
    document.getElementById('btn-back-rest-email')?.addEventListener('click', handler)
  }

  onBackOtp(handler) {
    document.getElementById('btn-back-rest-otp')?.addEventListener('click', handler)
  }

  onConfirmarOtp(handler) {
    document.getElementById('btn-rest-otp-confirmar')?.addEventListener('click', handler)
  }

  onReenviarOtp(handler) {
    document.getElementById('btn-rest-otp-reenviar')?.addEventListener('click', handler)
  }

  // ── OTP inputs ────────────────────────────────────────────────────────────

  _bindOtpInputs() {
    const digits = [...document.querySelectorAll('.rest-otp-digit')]
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
        ;(digits.find(d => !d.value) ?? digits[digits.length - 1]).focus()
      })
    })
  }
}
