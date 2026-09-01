/**
 * PhoneVerifyView
 *
 * Fluxo em 2 passos:
 *  Passo 1 — Digitar DDD + número de celular
 *  Passo 2 — Digitar o código SMS recebido
 *
 * O controller controla qual passo está visível via showStep().
 */

export class PhoneVerifyView {
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

        <!-- Ilustração esquerda (herdada do auth-page) -->
        <div class="auth-illustration" aria-hidden="true">
          <div class="auth-illustration__circle"></div>
        </div>

        <!-- ── PASSO 1: digitar celular ── -->
        <div class="verify-panel" id="step-phone">
          <button type="button" class="verify-back" id="btn-back-phone" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Qual é o seu<br>celular?</h1>
          <p class="verify-panel__subtitle">Vamos te mandar um código pelo WhatsApp para confirmar seu número.</p>

          <div class="verify-phone-group">
            <div class="verify-phone-ddd-wrap">
              <span class="verify-phone-flag" aria-hidden="true">🇧🇷</span>
              <span class="verify-phone-code">+55</span>
            </div>
            <div class="verify-phone-input-wrap">
              <input
                type="tel"
                class="verify-input"
                id="phone-ddd"
                placeholder="DDD"
                maxlength="2"
                inputmode="numeric"
                autocomplete="tel-area-code"
                aria-label="DDD"
              />
              <span class="verify-phone-sep" aria-hidden="true"></span>
              <input
                type="tel"
                class="verify-input verify-input--number"
                id="phone-number"
                placeholder="Número"
                maxlength="10"
                inputmode="numeric"
                autocomplete="tel-local"
                aria-label="Número de celular"
              />
            </div>
          </div>
          <span class="verify-error" id="phone-error" role="alert" aria-live="polite"></span>

          <button type="button" class="verify-btn-submit" id="btn-send-sms">
            Enviar código
          </button>
        </div>

        <!-- ── PASSO 2: digitar código SMS ── -->
        <div class="verify-panel" id="step-code" hidden>
          <button type="button" class="verify-back" id="btn-back-code" aria-label="Voltar para celular">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Digite o<br>código</h1>
          <p class="verify-panel__subtitle" id="code-subtitle">
            Enviamos um código pelo WhatsApp para <strong id="phone-display"></strong>.
          </p>

          <!-- Inputs do código (6 dígitos) -->
          <div class="verify-code-inputs" role="group" aria-label="Código de verificação de 6 dígitos">
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1" />
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2" />
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3" />
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4" />
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5" />
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6" />
          </div>
          <span class="verify-error" id="code-error" role="alert" aria-live="polite"></span>

          <button type="button" class="verify-btn-submit" id="btn-verify-code">
            Verificar
          </button>

          <button type="button" class="verify-resend" id="btn-resend-sms">
            Não recebi o código — reenviar
          </button>
        </div>

      </div>
    `

    this._bindCodeInputs()
  }

  // ── Controle de passos ────────────────────────────────────────────────────

  showStep(step) {
    const stepPhone = document.getElementById('step-phone')
    const stepCode  = document.getElementById('step-code')
    if (step === 1) {
      if (stepPhone) { stepPhone.style.display = 'flex'; stepPhone.removeAttribute('hidden') }
      if (stepCode)  { stepCode.style.display  = 'none';  stepCode.setAttribute('hidden', '') }
    } else {
      if (stepPhone) { stepPhone.style.display = 'none';  stepPhone.setAttribute('hidden', '') }
      if (stepCode)  { stepCode.style.display  = 'flex';  stepCode.removeAttribute('hidden') }
    }
  }

  setPhoneDisplay(phone) {
    const el = document.getElementById('phone-display')
    if (el) el.textContent = phone
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getPhone() {
    return {
      ddd:    (document.getElementById('phone-ddd')?.value    ?? '').trim(),
      number: (document.getElementById('phone-number')?.value ?? '').replace(/\D/g, ''),
    }
  }

  getCode() {
    return [...document.querySelectorAll('.verify-code-digit')]
      .map(i => i.value)
      .join('')
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showPhoneError(msg) {
    const el = document.getElementById('phone-error')
    if (el) el.textContent = msg
  }

  clearPhoneError() {
    const el = document.getElementById('phone-error')
    if (el) el.textContent = ''
  }

  showCodeError(msg) {
    const el = document.getElementById('code-error')
    if (el) el.textContent = msg
    document.querySelectorAll('.verify-code-digit').forEach(i => i.classList.add('error'))
  }

  clearCodeError() {
    const el = document.getElementById('code-error')
    if (el) el.textContent = ''
    document.querySelectorAll('.verify-code-digit').forEach(i => i.classList.remove('error'))
  }

  setSendLoading(loading) {
    const btn = document.getElementById('btn-send-sms')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Enviando...' : 'Enviar código'
  }

  setVerifyLoading(loading) {
    const btn = document.getElementById('btn-verify-code')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Verificar'
  }

  clearCodeInputs() {
    document.querySelectorAll('.verify-code-digit').forEach(i => { i.value = '' })
  }

  focusFirstCodeInput() {
    document.querySelector('.verify-code-digit')?.focus()
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('verify-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'verify-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onSendSms(handler) {
    document.getElementById('btn-send-sms')?.addEventListener('click', handler)
  }

  onVerifyCode(handler) {
    document.getElementById('btn-verify-code')?.addEventListener('click', handler)
  }

  onResend(handler) {
    document.getElementById('btn-resend-sms')?.addEventListener('click', handler)
  }

  onBackPhone(handler) {
    document.getElementById('btn-back-phone')?.addEventListener('click', handler)
  }

  onBackCode(handler) {
    document.getElementById('btn-back-code')?.addEventListener('click', handler)
  }

  // ── Comportamento dos inputs de código ───────────────────────────────────

  _bindCodeInputs() {
    const digits = [...document.querySelectorAll('.verify-code-digit')]

    digits.forEach((input, idx) => {
      input.addEventListener('input', () => {
        // Limita a um dígito numérico
        input.value = input.value.replace(/\D/g, '').slice(-1)
        if (input.value && idx < digits.length - 1) {
          digits[idx + 1].focus()
        }
      })

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          digits[idx - 1].focus()
        }
      })

      // Suporte a colar o código completo no primeiro campo
      input.addEventListener('paste', (e) => {
        e.preventDefault()
        const pasted = (e.clipboardData || window.clipboardData)
          .getData('text')
          .replace(/\D/g, '')
          .slice(0, 6)
        pasted.split('').forEach((ch, i) => {
          if (digits[i]) digits[i].value = ch
        })
        const nextEmpty = digits.find(d => !d.value)
        ;(nextEmpty ?? digits[digits.length - 1]).focus()
      })
    })
  }
}
