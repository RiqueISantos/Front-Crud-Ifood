/**
 * EmailInputView
 *
 * Tela "Informe o seu e-mail para continuar" — igual ao iFood.
 * Só pede o e-mail. O controller decide se vai para login ou cadastro.
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

        <!-- Painel -->
        <div class="email-input-panel">

          <!-- Voltar -->
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

      </div>
    `
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getEmail() {
    return (document.getElementById('email-input-field')?.value ?? '').trim()
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

  setLoading(loading) {
    const btn = document.getElementById('btn-email-continuar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Verificando...' : 'Continuar'
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
}
