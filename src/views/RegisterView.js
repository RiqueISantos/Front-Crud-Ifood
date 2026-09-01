/**
 * RegisterView
 *
 * Responsável por:
 *  - Renderizar o HTML da tela de cadastro
 *  - Expor métodos para atualizar o DOM (erros, estados, feedback)
 *  - Expor métodos para ler os valores dos campos
 *  - NÃO toma nenhuma decisão de negócio
 */

// ── Ícones SVG inline ──────────────────────────────────────────────────────

const icons = {
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>`,
  cpf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <line x1="7" y1="9" x2="17" y2="9"/>
    <line x1="7" y1="13" x2="12" y2="13"/>
  </svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
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

// ── Template HTML ──────────────────────────────────────────────────────────

function buildTemplate() {
  return /* html */`
    <div class="register-page">

      <header class="header">
        <a href="#" class="header__logo" aria-label="iFood – página inicial">
          <div class="header__logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#EA1D2C">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span class="header__logo-text">iFood</span>
        </a>
      </header>

      <main class="register-main">
        <div class="register-card">

          <!-- ── Painel esquerdo: social + acesso ── -->
          <div class="register-panel register-panel--side">
            <div class="side-brand">
              <svg class="side-brand__icon" viewBox="0 0 24 24" fill="#EA1D2C">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              <span class="side-brand__name">iFood</span>
            </div>

            <h2 class="side-title">Bem-vindo!</h2>
            <p class="side-subtitle">Cadastre-se com sua conta social ou preencha o formulário.</p>

            <div class="social-buttons">
              <button type="button" class="btn-social btn-social--google" id="btn-google" aria-label="Cadastrar com Google">
                <span class="btn-social__icon" aria-hidden="true">${icons.google}</span>
                <span class="btn-social__label">Continuar com Google</span>
              </button>
              <button type="button" class="btn-social btn-social--facebook" id="btn-facebook" aria-label="Cadastrar com Facebook">
                <span class="btn-social__icon" aria-hidden="true">${icons.facebook}</span>
                <span class="btn-social__label">Continuar com Facebook</span>
              </button>
            </div>

            <p class="side-login">
              Já tem uma conta?
              <a href="#" id="login-link">Entrar</a>
            </p>
          </div>

          <!-- ── Divisor vertical ── -->
          <div class="register-divider" aria-hidden="true">
            <span>ou</span>
          </div>

          <!-- ── Painel direito: formulário ── -->
          <div class="register-panel register-panel--form">
            <h1 class="register-card__title">Crie sua conta</h1>

            <form class="form" id="register-form" novalidate>

              <div class="form__row">
                <div class="form__group">
                  <label class="form__label" for="firstName">
                    Nome <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.user}</span>
                    <input class="form__input" type="text" id="firstName" name="firstName"
                      placeholder="Seu nome" autocomplete="given-name"
                      required aria-required="true" aria-describedby="firstName-error" />
                  </div>
                  <span class="form__error" id="firstName-error" role="alert" aria-live="polite"></span>
                </div>

                <div class="form__group">
                  <label class="form__label" for="lastName">
                    Sobrenome <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.user}</span>
                    <input class="form__input" type="text" id="lastName" name="lastName"
                      placeholder="Sobrenome" autocomplete="family-name"
                      required aria-required="true" aria-describedby="lastName-error" />
                  </div>
                  <span class="form__error" id="lastName-error" role="alert" aria-live="polite"></span>
                </div>
              </div>

              <div class="form__row">
                <div class="form__group">
                  <label class="form__label" for="email">
                    E-mail <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.email}</span>
                    <input class="form__input" type="email" id="email" name="email"
                      placeholder="seu@email.com" autocomplete="email"
                      required aria-required="true" aria-describedby="email-error" />
                  </div>
                  <span class="form__error" id="email-error" role="alert" aria-live="polite"></span>
                </div>

                <div class="form__group">
                  <label class="form__label" for="cpf">
                    CPF <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.cpf}</span>
                    <input class="form__input" type="text" id="cpf" name="cpf"
                      placeholder="000.000.000-00" inputmode="numeric" maxlength="14"
                      required aria-required="true" aria-describedby="cpf-error" />
                  </div>
                  <span class="form__error" id="cpf-error" role="alert" aria-live="polite"></span>
                </div>
              </div>

              <div class="form__row">
                <div class="form__group">
                  <label class="form__label" for="birthDate">
                    Nascimento <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.calendar}</span>
                    <input class="form__input" type="text" id="birthDate" name="birthDate"
                      placeholder="DD/MM/AAAA" inputmode="numeric" maxlength="10"
                      required aria-required="true" aria-describedby="birthDate-error" />
                  </div>
                  <span class="form__error" id="birthDate-error" role="alert" aria-live="polite"></span>
                </div>

                <div class="form__group">
                  <label class="form__label" for="phoneNumber">
                    Celular <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="phone-group">
                    <input class="phone-ddd" type="text" id="phoneDDD" name="phoneDDD"
                      placeholder="DDD" inputmode="numeric" maxlength="2"
                      aria-label="DDD" aria-describedby="phone-error" />
                    <input class="phone-number" type="text" id="phoneNumber" name="phoneNumber"
                      placeholder="9 0000-0000" inputmode="numeric" maxlength="10"
                      aria-label="Número" aria-describedby="phone-error" />
                  </div>
                  <span class="form__error" id="phone-error" role="alert" aria-live="polite"></span>
                </div>
              </div>

              <div class="form__row">
                <div class="form__group">
                  <label class="form__label" for="password">
                    Senha <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.lock}</span>
                    <input class="form__input" type="password" id="password" name="password"
                      placeholder="Mínimo 8 caracteres" autocomplete="new-password"
                      required aria-required="true" aria-describedby="password-error" />
                    <button type="button" class="btn-toggle-password" id="toggle-password"
                      aria-label="Mostrar senha">${icons.eyeOn}</button>
                  </div>
                  <span class="form__error" id="password-error" role="alert" aria-live="polite"></span>
                  <div class="password-strength" id="strength-indicator" aria-hidden="true" style="display:none">
                    <div class="strength-bar">
                      <div class="strength-bar__segment" id="seg1"></div>
                      <div class="strength-bar__segment" id="seg2"></div>
                      <div class="strength-bar__segment" id="seg3"></div>
                      <div class="strength-bar__segment" id="seg4"></div>
                    </div>
                    <span class="strength-label" id="strength-label-text"></span>
                  </div>
                </div>

                <div class="form__group">
                  <label class="form__label" for="confirmPassword">
                    Confirmar senha <span class="required" aria-hidden="true">*</span>
                  </label>
                  <div class="input-wrapper">
                    <span class="input-icon" aria-hidden="true">${icons.lock}</span>
                    <input class="form__input" type="password" id="confirmPassword" name="confirmPassword"
                      placeholder="Repita a senha" autocomplete="new-password"
                      required aria-required="true" aria-describedby="confirmPassword-error" />
                    <button type="button" class="btn-toggle-password" id="toggle-confirm-password"
                      aria-label="Mostrar confirmação de senha">${icons.eyeOn}</button>
                  </div>
                  <span class="form__error" id="confirmPassword-error" role="alert" aria-live="polite"></span>
                </div>
              </div>

              <div class="form__checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="termsAccepted" name="termsAccepted" aria-required="true" />
                  <span class="checkbox-custom" aria-hidden="true"></span>
                  <span>
                    Li e concordo com os
                    <a href="#">Termos de uso</a> e a
                    <a href="#">Política de privacidade</a>.
                  </span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="newsletter" name="newsletter" />
                  <span class="checkbox-custom" aria-hidden="true"></span>
                  <span>Quero receber promoções por e-mail.</span>
                </label>
              </div>

              <button type="submit" class="btn-submit" id="submit-btn">Criar conta</button>

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

// ── RegisterView ───────────────────────────────────────────────────────────

export class RegisterView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  // ── Render ───────────────────────────────────────────────────────────────

  render() {
    this._container.innerHTML = buildTemplate()
  }

  // ── Leitura de dados ─────────────────────────────────────────────────────

  getFormData() {
    return {
      firstName:       this._val('firstName'),
      lastName:        this._val('lastName'),
      email:           this._val('email'),
      cpf:             this._val('cpf'),
      birthDate:       this._val('birthDate'),
      phoneDDD:        this._val('phoneDDD'),
      phoneNumber:     this._val('phoneNumber'),
      password:        this._val('password'),
      confirmPassword: this._val('confirmPassword'),
      termsAccepted:   this._checked('termsAccepted'),
      newsletter:      this._checked('newsletter'),
    }
  }

  getFieldValue(id) { return this._val(id) }
  isChecked(id)     { return this._checked(id) }

  // ── Atualização de UI ────────────────────────────────────────────────────

  showFieldError(fieldId, message) {
    const input = this._el(fieldId)
    const errorEl = this._el(`${fieldId}-error`)
    if (input)   input.classList.add('error')
    if (errorEl) errorEl.textContent = message
  }

  clearFieldError(fieldId) {
    const input = this._el(fieldId)
    const errorEl = this._el(`${fieldId}-error`)
    if (input)   input.classList.remove('error')
    if (errorEl) errorEl.textContent = ''
  }

  showErrors(errors) {
    const allFields = ['firstName','lastName','email','cpf','birthDate','password','confirmPassword']
    allFields.forEach((f) => this.clearFieldError(f))
    this._clearPhoneError()

    Object.entries(errors).forEach(([key, message]) => {
      if (key === 'phone')  this._showPhoneError(message)
      else if (key === 'terms') this.showToast(message, 'error')
      else this.showFieldError(key, message)
    })
  }

  setFieldValue(id, value) {
    const el = this._el(id)
    if (el) el.value = value
  }

  updateStrengthBar(score, label) {
    const indicator = this._el('strength-indicator')
    const labelEl   = this._el('strength-label-text')
    const MAP = ['','filled-weak','filled-fair','filled-good','filled-strong']

    if (!score) { if (indicator) indicator.style.display = 'none'; return }
    if (indicator) indicator.style.display = 'block'

    for (let i = 1; i <= 4; i++) {
      const seg = this._el(`seg${i}`)
      if (seg) {
        seg.className = 'strength-bar__segment'
        if (i <= score) seg.classList.add(MAP[score])
      }
    }
    if (labelEl) labelEl.textContent = label ? `Força: ${label}` : ''
  }

  togglePasswordVisibility(inputId, buttonId) {
    const input = this._el(inputId)
    const btn   = this._el(buttonId)
    if (!input || !btn) return
    const isHidden = input.type === 'password'
    input.type = isHidden ? 'text' : 'password'
    btn.innerHTML = isHidden ? icons.eyeOff : icons.eyeOn
    btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha')
  }

  setSubmitLoading(loading) {
    const btn = this._el('submit-btn')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Criando conta...' : 'Criar conta'
  }

  setSocialLoading(provider, loading) {
    const btn = this._el(`btn-${provider}`)
    if (!btn) return
    btn.disabled = loading
    const label = btn.querySelector('.btn-social__label')
    if (label) {
      label.textContent = loading
        ? 'Aguarde...'
        : `Continuar com ${provider === 'google' ? 'Google' : 'Facebook'}`
    }
  }

  resetForm() {
    const form = this._el('register-form')
    if (form) form.reset()
    const indicator = this._el('strength-indicator')
    if (indicator) indicator.style.display = 'none'
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
    this._el('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault()
      handler()
    })
  }

  onSocialLogin(provider, handler) {
    this._el(`btn-${provider}`)?.addEventListener('click', () => handler(provider))
  }

  onFieldBlur(fieldId, handler) {
    this._el(fieldId)?.addEventListener('blur', () => handler(this._val(fieldId)))
  }

  onFieldInput(fieldId, handler) {
    this._el(fieldId)?.addEventListener('input', () => handler(this._val(fieldId)))
  }

  onPasswordToggle(buttonId, inputId) {
    this._el(buttonId)?.addEventListener('click', () =>
      this.togglePasswordVisibility(inputId, buttonId)
    )
  }

  onLoginLink(handler) {
    this._el('login-link')?.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  _el(id)      { return document.getElementById(id) }
  _val(id)     { return this._el(id)?.value   ?? '' }
  _checked(id) { return this._el(id)?.checked ?? false }

  _showPhoneError(message) {
    const errorEl = this._el('phone-error')
    if (errorEl) errorEl.textContent = message
    this._el('phoneDDD')?.classList.add('error')
    this._el('phoneNumber')?.classList.add('error')
  }

  _clearPhoneError() {
    const errorEl = this._el('phone-error')
    if (errorEl) errorEl.textContent = ''
    this._el('phoneDDD')?.classList.remove('error')
    this._el('phoneNumber')?.classList.remove('error')
  }
}
