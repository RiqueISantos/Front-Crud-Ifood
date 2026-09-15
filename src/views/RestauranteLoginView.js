/**
 * RestauranteLoginView
 *
 * Tela de login para parceiros já cadastrados.
 * Reutiliza a mesma estrutura da RestauranteEmailView, mas com textos de login.
 * Passo 1 — Digitar e-mail
 * Passo 2 — Digitar código OTP
 * Após login bem-sucedido → redireciona para /restaurante/dashboard
 */

export class RestauranteLoginView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="rest-page">

        <!-- Logo -->
        <a href="#/restaurante" class="rest-logo" aria-label="iFood para restaurantes">
          <span class="rest-logo__text">iFood</span>
          <span class="rest-logo__for">para restaurantes</span>
        </a>

        <!-- Botão ajuda -->
        <button type="button" class="auth-help" aria-label="Ajuda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
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

        <!-- ── PASSO 1: e-mail ── -->
        <div class="rest-panel" id="step-login-email">

          <button type="button" class="verify-back" id="btn-back-login-email" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="rest-panel__title">Acesse sua<br>conta parceira</h1>
          <p class="rest-panel__subtitle">
            Informe o e-mail cadastrado para receber seu código de acesso.
          </p>

          <div class="rest-field-wrap">
            <label class="rest-label" for="rest-login-email-input">E-mail do restaurante</label>
            <input
              type="email"
              class="rest-input"
              id="rest-login-email-input"
              placeholder="contato@seurestaurante.com.br"
              autocomplete="email"
              inputmode="email"
              aria-label="E-mail do restaurante"
              aria-required="true"
            />
            <span class="rest-error" id="rest-login-email-error" role="alert" aria-live="polite"></span>
          </div>

          <button type="button" class="rest-btn-primary" id="btn-login-email-continuar">
            Enviar código
          </button>

          <div class="rest-login-divider">
            <span>Não tem conta?</span>
            <button type="button" class="rest-login-cadastrar-link" id="btn-login-ir-cadastro">
              Cadastre seu restaurante
            </button>
          </div>

        </div>

        <!-- ── PASSO 2: código OTP ── -->
        <div class="rest-panel" id="step-login-otp" hidden>

          <button type="button" class="verify-back" id="btn-back-login-otp" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="rest-panel__title">Digite o<br>código</h1>
          <p class="rest-panel__subtitle">
            Enviamos um código para<br><strong id="rest-login-otp-email-display"></strong>.
          </p>

          <div class="verify-code-inputs" role="group" aria-label="Código de verificação de 6 dígitos">
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1" />
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2" />
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3" />
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4" />
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5" />
            <input type="tel" class="verify-code-digit rest-login-otp-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6" />
          </div>
          <span class="rest-error" id="rest-login-otp-error" role="alert" aria-live="polite"></span>

          <button type="button" class="rest-btn-primary" id="btn-login-otp-confirmar">
            Entrar
          </button>

          <button type="button" class="verify-resend" id="btn-login-otp-reenviar">
            Reenviar código
          </button>

        </div>

      </div>
    `

    this._bindOtpInputs()
  }

  // ── Passos ────────────────────────────────────────────────────────────────

  showStep(step) {
    const s1 = document.getElementById('step-login-email')
    const s2 = document.getElementById('step-login-otp')
    if (step === 1) {
      s1?.removeAttribute('hidden'); if (s1) s1.style.display = 'flex'
      s2?.setAttribute('hidden', ''); if (s2) s2.style.display = 'none'
    } else {
      s1?.setAttribute('hidden', ''); if (s1) s1.style.display = 'none'
      s2?.removeAttribute('hidden'); if (s2) s2.style.display = 'flex'
    }
  }

  setOtpEmailDisplay(email) {
    const el = document.getElementById('rest-login-otp-email-display')
    if (el) el.textContent = email
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getEmail() {
    return (document.getElementById('rest-login-email-input')?.value ?? '').trim().toLowerCase()
  }

  getOtpCode() {
    return [...document.querySelectorAll('.rest-login-otp-digit')].map(i => i.value).join('')
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showEmailError(msg) {
    const el    = document.getElementById('rest-login-email-error')
    const input = document.getElementById('rest-login-email-input')
    if (el)    el.textContent = msg
    if (input) input.classList.add('error')
  }

  clearEmailError() {
    const el    = document.getElementById('rest-login-email-error')
    const input = document.getElementById('rest-login-email-input')
    if (el)    el.textContent = ''
    if (input) input.classList.remove('error')
  }

  showOtpError(msg) {
    const el = document.getElementById('rest-login-otp-error')
    if (el) el.textContent = msg
    document.querySelectorAll('.rest-login-otp-digit').forEach(i => i.classList.add('error'))
  }

  clearOtpError() {
    const el = document.getElementById('rest-login-otp-error')
    if (el) el.textContent = ''
    document.querySelectorAll('.rest-login-otp-digit').forEach(i => i.classList.remove('error'))
  }

  clearOtpInputs() {
    document.querySelectorAll('.rest-login-otp-digit').forEach(i => { i.value = '' })
  }

  focusFirstOtp() {
    document.querySelector('.rest-login-otp-digit')?.focus()
  }

  setEmailLoading(loading) {
    const btn = document.getElementById('btn-login-email-continuar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Enviando...' : 'Enviar código'
  }

  setOtpLoading(loading) {
    const btn = document.getElementById('btn-login-otp-confirmar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Entrando...' : 'Entrar'
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('rest-login-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'rest-login-toast'
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
    document.getElementById('btn-login-email-continuar')?.addEventListener('click', handler)
    document.getElementById('rest-login-email-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handler()
    })
  }

  onBack(handler) {
    document.getElementById('btn-back-login-email')?.addEventListener('click', handler)
  }

  onBackOtp(handler) {
    document.getElementById('btn-back-login-otp')?.addEventListener('click', handler)
  }

  onConfirmarOtp(handler) {
    document.getElementById('btn-login-otp-confirmar')?.addEventListener('click', handler)
  }

  onReenviarOtp(handler) {
    document.getElementById('btn-login-otp-reenviar')?.addEventListener('click', handler)
  }

  onIrCadastro(handler) {
    document.getElementById('btn-login-ir-cadastro')?.addEventListener('click', handler)
  }

  // ── OTP inputs ────────────────────────────────────────────────────────────

  _bindOtpInputs() {
    const digits = [...document.querySelectorAll('.rest-login-otp-digit')]
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
