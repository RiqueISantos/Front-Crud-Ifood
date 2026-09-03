/**
 * OAuthPhoneView
 *
 * Tela exibida após login com Google para confirmar/cadastrar celular.
 * Igual ao iFood: mostra o número mascarado (se já existe) ou pede um novo.
 *
 * Passo 1 — confirmar/digitar celular
 * Passo 2 — digitar o código WhatsApp
 */

export class OAuthPhoneView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  /**
   * @param {{ nome: string, telefone: string }} usuario
   * @param {boolean} temTelefone - se já tem telefone cadastrado
   */
  render(usuario = {}, temTelefone = false) {
    this._temTelefone = temTelefone
    const telMascarado = temTelefone ? this._mascarar(usuario.telefone || '') : ''

    this._container.innerHTML = /* html */`
      <div class="verify-page">

        <a href="#/" class="auth-logo" aria-label="iFood – página inicial">
          <span class="auth-logo__text">iFood</span>
        </a>

        <button type="button" class="auth-help" aria-label="Ajuda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- ── PASSO 1: confirmar/digitar celular ── -->
        <div class="verify-panel" id="step-phone">
          <button type="button" class="verify-back" id="btn-back-phone" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Agora é só confirmar<br>o seu celular</h1>

          ${temTelefone ? `
            <!-- Número já cadastrado — exibe mascarado -->
            <div class="verify-phone-group" style="cursor:default">
              <div class="verify-phone-ddd-wrap">
                <span class="verify-phone-flag" aria-hidden="true">🇧🇷</span>
                <span class="verify-phone-code">+55</span>
              </div>
              <div class="verify-phone-input-wrap">
                <input type="tel" class="verify-input verify-input--number"
                  id="phone-display-masked" value="${telMascarado}"
                  readonly aria-label="Número cadastrado" style="color:var(--gray-600);letter-spacing:2px"/>
              </div>
            </div>
            <p class="verify-panel__subtitle" style="margin-top:12px">
              Para finalizar, confirme seu celular cadastrado.
              Por onde prefere receber o código de confirmação?
            </p>
            <button type="button" class="verify-btn-submit" id="btn-send-whatsapp">
              WhatsApp
            </button>
            <button type="button" class="verify-resend" id="btn-not-my-number">
              Este não é o seu número?
            </button>
          ` : `
            <!-- Sem número — pede para cadastrar -->
            <p class="verify-panel__subtitle">
              Vamos enviar um código pelo WhatsApp para confirmar seu número.
            </p>
            <div class="verify-phone-group">
              <div class="verify-phone-ddd-wrap">
                <span class="verify-phone-flag" aria-hidden="true">🇧🇷</span>
                <span class="verify-phone-code">+55</span>
              </div>
              <div class="verify-phone-input-wrap">
                <input type="tel" class="verify-input" id="phone-ddd"
                  placeholder="DDD" maxlength="2" inputmode="numeric"
                  autocomplete="tel-area-code" aria-label="DDD"/>
                <span class="verify-phone-sep" aria-hidden="true"></span>
                <input type="tel" class="verify-input verify-input--number" id="phone-number"
                  placeholder="Número" maxlength="10" inputmode="numeric"
                  autocomplete="tel-local" aria-label="Número de celular"/>
              </div>
            </div>
            <span class="verify-error" id="phone-error" role="alert" aria-live="polite"></span>
            <button type="button" class="verify-btn-submit" id="btn-send-whatsapp">
              Enviar código
            </button>
          `}
        </div>

        <!-- ── PASSO 2: digitar código ── -->
        <div class="verify-panel" id="step-code" hidden>
          <button type="button" class="verify-back" id="btn-back-code" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <h1 class="verify-panel__title">Digite o<br>código</h1>
          <p class="verify-panel__subtitle">
            Enviamos um código pelo WhatsApp para <strong id="phone-sent-display"></strong>.
          </p>

          <div class="verify-code-inputs" role="group" aria-label="Código de 6 dígitos">
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 1"/>
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 2"/>
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 3"/>
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 4"/>
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 5"/>
            <input type="tel" class="verify-code-digit" maxlength="1" inputmode="numeric" aria-label="Dígito 6"/>
          </div>
          <span class="verify-error" id="code-error" role="alert" aria-live="polite"></span>

          <button type="button" class="verify-btn-submit" id="btn-verify-code">
            Confirmar
          </button>

          <button type="button" class="verify-resend" id="btn-resend-code">
            Não recebi o código — reenviar
          </button>
        </div>

      </div>
    `

    this._bindCodeInputs()
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _mascarar(telefone) {
    const d = telefone.replace(/\D/g, '')
    if (d.length < 8) return telefone
    const visivel = d.slice(-4)
    const oculto  = '*'.repeat(d.length - 4)
    return `(${d.slice(0, 2)}) ${oculto.slice(0, oculto.length - 4)}-${visivel}`
  }

  // ── Passos ────────────────────────────────────────────────────────────────

  showStep(step) {
    const p1 = document.getElementById('step-phone')
    const p2 = document.getElementById('step-code')
    if (step === 1) {
      p1?.removeAttribute('hidden'); p1 && (p1.style.display = 'flex')
      p2?.setAttribute('hidden', ''); p2 && (p2.style.display = 'none')
    } else {
      p1?.setAttribute('hidden', ''); p1 && (p1.style.display = 'none')
      p2?.removeAttribute('hidden'); p2 && (p2.style.display = 'flex')
    }
  }

  setPhoneSentDisplay(phone) {
    const el = document.getElementById('phone-sent-display')
    if (el) el.textContent = phone
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  /** Retorna o telefone digitado (ddd+numero sem formatação) ou null se mascarado */
  getPhone() {
    if (this._temTelefone) return null   // controller usa o telefone já armazenado
    const ddd = (document.getElementById('phone-ddd')?.value    || '').replace(/\D/g, '')
    const num = (document.getElementById('phone-number')?.value || '').replace(/\D/g, '')
    return { ddd, number: num }
  }

  getCode() {
    return [...document.querySelectorAll('.verify-code-digit')].map(i => i.value).join('')
  }

  // ── Erros ─────────────────────────────────────────────────────────────────

  showPhoneError(msg) { const e = document.getElementById('phone-error'); if (e) e.textContent = msg }
  clearPhoneError()   { const e = document.getElementById('phone-error'); if (e) e.textContent = '' }
  showCodeError(msg)  {
    const e = document.getElementById('code-error'); if (e) e.textContent = msg
    document.querySelectorAll('.verify-code-digit').forEach(i => i.classList.add('error'))
  }
  clearCodeError() {
    const e = document.getElementById('code-error'); if (e) e.textContent = ''
    document.querySelectorAll('.verify-code-digit').forEach(i => i.classList.remove('error'))
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  setSendLoading(v) {
    const b = document.getElementById('btn-send-whatsapp')
    if (!b) return; b.disabled = v; b.textContent = v ? 'Enviando...' : (this._temTelefone ? 'WhatsApp' : 'Enviar código')
  }

  setVerifyLoading(v) {
    const b = document.getElementById('btn-verify-code')
    if (!b) return; b.disabled = v; b.textContent = v ? 'Verificando...' : 'Confirmar'
  }

  clearCodeInputs() { document.querySelectorAll('.verify-code-digit').forEach(i => { i.value = '' }) }
  focusFirstCode()  { document.querySelector('.verify-code-digit')?.focus() }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(message, type = 'default') {
    let t = document.getElementById('oauth-phone-toast')
    if (!t) {
      t = document.createElement('div'); t.id = 'oauth-phone-toast'
      t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = message; t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onSend(handler)         { document.getElementById('btn-send-whatsapp')?.addEventListener('click', handler) }
  onNotMyNumber(handler)  { document.getElementById('btn-not-my-number')?.addEventListener('click', handler) }
  onVerify(handler)       { document.getElementById('btn-verify-code')?.addEventListener('click', handler) }
  onResend(handler)       { document.getElementById('btn-resend-code')?.addEventListener('click', handler) }
  onBackPhone(handler)    { document.getElementById('btn-back-phone')?.addEventListener('click', handler) }
  onBackCode(handler)     { document.getElementById('btn-back-code')?.addEventListener('click', handler) }

  // ── Code inputs ───────────────────────────────────────────────────────────

  _bindCodeInputs() {
    const digits = [...document.querySelectorAll('.verify-code-digit')]
    digits.forEach((input, idx) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(-1)
        if (input.value && idx < digits.length - 1) digits[idx + 1].focus()
      })
      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !input.value && idx > 0) digits[idx - 1].focus()
      })
      input.addEventListener('paste', e => {
        e.preventDefault()
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6)
        pasted.split('').forEach((ch, i) => { if (digits[i]) digits[i].value = ch })
        ;(digits.find(d => !d.value) ?? digits[digits.length - 1]).focus()
      })
    })
  }
}
