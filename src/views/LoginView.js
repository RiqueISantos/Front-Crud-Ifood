/**
 * LoginView
 *
 * Responsável por:
 *  - Renderizar o HTML da tela de login
 *  - Expor métodos para atualizar o DOM
 *  - NÃO toma nenhuma decisão de negócio
 */

// ── Ícones ─────────────────────────────────────────────────────────────────

const icons = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>`,
  eyeOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`,
  google: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>`,
  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>`,
}

// ── Template ───────────────────────────────────────────────────────────────

function buildTemplate() {
  return /* html */`
    <div class="login-page">

      <header class="header">
        <a href="#" class="header__logo" aria-label="iFood – página inicial">
          <div class="header__logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#EA1D2C">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span class="header__logo-text">iFood</span>
        </a>
      </header>

      <main class="login-main">
        <div class="login-card">

          <!-- ── Painel esquerdo ── -->
          <div class="login-panel login-panel--side">
            <div class="side-brand">
              <svg class="side-brand__icon" viewBox="0 0 24 24" fill="#EA1D2C">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              <span class="side-brand__name">iFood</span>
            </div>

            <h2 class="side-title">Olá, bem-vindo de volta!</h2>
            <p class="side-subtitle">Acesse sua conta para pedir sua comida favorita.</p>

            <div class="social-buttons">
              <button type="button" class="btn-social btn-social--google" id="btn-google" aria-label="Entrar com Google">
                <span class="btn-social__icon" aria-hidden="true">${icons.google}</span>
                <span class="btn-social__label">Entrar com Google</span>
              </button>
              <button type="button" class="btn-social btn-social--facebook" id="btn-facebook" aria-label="Entrar com Facebook">
                <span class="btn-social__icon" aria-hidden="true">${icons.facebook}</span>
                <span class="btn-social__label">Entrar com Facebook</span>
              </button>
            </div>

            <p class="side-register">
              Não tem uma conta?
              <a href="#" id="register-link">Cadastre-se</a>
            </p>
          </div>

          <!-- ── Divisor ── -->
          <div class="login-divider" aria-hidden="true">
            <span>ou</span>
          </div>

          <!-- ── Painel direito: formulário ── -->
          <div class="login-panel login-panel--form">
            <h1 class="login-card__title">Entrar na sua conta</h1>

            <form class="form" id="login-form" novalidate>

              <div class="form__group">
                <label class="form__label" for="login-email">
                  E-mail <span class="required" aria-hidden="true">*</span>
                </label>
                <div class="input-wrapper">
                  <span class="input-icon" aria-hidden="true">${icons.email}</span>
                  <input
                    class="form__input" type="email" id="login-email" name="email"
                    placeholder="seu@email.com" autocomplete="email"
                    required aria-required="true" aria-describedby="login-email-error"
                  />
                </div>
                <span class="form__error" id="login-email-error" role="alert" aria-live="polite"></span>
              </div>

              <div class="form__group">
                <div class="password-label-row">
                  <label class="form__label" for="login-password">
                    Senha <span class="required" aria-hidden="true">*</span>
                  </label>
                  <a href="#" class="forgot-password" id="forgot-password-link" tabindex="0">
                    Esqueci minha senha
                  </a>
                </div>
                <div class="input-wrapper">
                  <span class="input-icon" aria-hidden="true">${icons.lock}</span>
                  <input
                    class="form__input" type="password" id="login-password" name="password"
                    placeholder="Sua senha" autocomplete="current-password"
                    required aria-required="true" aria-describedby="login-password-error"
                  />
                  <button type="button" class="btn-toggle-password" id="toggle-login-password"
                    aria-label="Mostrar senha">${icons.eyeOn}</button>
                </div>
                <span class="form__error" id="login-password-error" role="alert" aria-live="polite"></span>
              </div>

              <div class="form__checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="rememberMe" name="rememberMe" />
                  <span class="checkbox-custom" aria-hidden="true"></span>
                  <span>Manter-me conectado</span>
                </label>
              </div>

              <button type="submit" class="btn-submit" id="login-submit-btn">Entrar</button>

            </form>
          </div>

        </div>
      </main>

      <footer class="footer">
        © 2026 iFood – Cópia acadêmica para fins de estudo
      </footer>
    </div>

    <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
  `
}

// ── LoginView ──────────────────────────────────────────────────────────────

export class LoginView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  // ── Render ───────────────────────────────────────────────────────────────

  render() {
    this._container.innerHTML = buildTemplate()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getFormData() {
    return {
      email:      this._val('login-email'),
      password:   this._val('login-password'),
      rememberMe: this._checked('rememberMe'),
    }
  }

  getFieldValue(id) { return this._val(id) }

  // ── Atualização de UI ─────────────────────────────────────────────────────

  showFieldError(fieldId, message) {
    const input   = this._el(fieldId)
    const errorEl = this._el(`${fieldId}-error`)
    if (input)   input.classList.add('error')
    if (errorEl) errorEl.textContent = message
  }

  clearFieldError(fieldId) {
    const input   = this._el(fieldId)
    const errorEl = this._el(`${fieldId}-error`)
    if (input)   input.classList.remove('error')
    if (errorEl) errorEl.textContent = ''
  }

  showErrors(errors) {
    this.clearFieldError('login-email')
    this.clearFieldError('login-password')
    Object.entries(errors).forEach(([key, msg]) => {
      this.showFieldError(`login-${key}`, msg)
    })
  }

  togglePasswordVisibility() {
    const input = this._el('login-password')
    const btn   = this._el('toggle-login-password')
    if (!input || !btn) return
    const isHidden = input.type === 'password'
    input.type  = isHidden ? 'text' : 'password'
    btn.innerHTML = isHidden ? icons.eyeOff : icons.eyeOn
    btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha')
  }

  setSubmitLoading(loading) {
    const btn = this._el('login-submit-btn')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Entrando...' : 'Entrar'
  }

  setSocialLoading(provider, loading) {
    const btn = this._el(`btn-${provider}`)
    if (!btn) return
    btn.disabled = loading
    const label = btn.querySelector('.btn-social__label')
    if (label) {
      label.textContent = loading
        ? 'Aguarde...'
        : `Entrar com ${provider === 'google' ? 'Google' : 'Facebook'}`
    }
  }

  showToast(message, type = 'default') {
    const toast = this._el('toast')
    if (!toast) return
    toast.textContent = message
    toast.className   = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Registro de eventos ───────────────────────────────────────────────────

  onSubmit(handler) {
    this._el('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault()
      handler()
    })
  }

  onFieldBlur(fieldId, handler) {
    this._el(fieldId)?.addEventListener('blur', () => handler(this._val(fieldId)))
  }

  onFieldInput(fieldId, handler) {
    this._el(fieldId)?.addEventListener('input', () => handler(this._val(fieldId)))
  }

  onPasswordToggle(handler) {
    this._el('toggle-login-password')?.addEventListener('click', () => handler())
  }

  onSocialLogin(provider, handler) {
    this._el(`btn-${provider}`)?.addEventListener('click', () => handler(provider))
  }

  onRegisterLink(handler) {
    this._el('register-link')?.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  onForgotPassword(handler) {
    this._el('forgot-password-link')?.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  _el(id)      { return document.getElementById(id) }
  _val(id)     { return this._el(id)?.value   ?? '' }
  _checked(id) { return this._el(id)?.checked ?? false }
}
