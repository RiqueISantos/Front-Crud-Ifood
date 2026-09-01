/**
 * AuthView
 *
 * Tela "Falta pouco para matar sua fome!" — igual ao iFood.
 * Exibida tanto para "Entrar" quanto "Criar conta".
 * Botões: Facebook (visual only), Google (visual only), Celular, E-mail.
 */

const icons = {
  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white"/>
  </svg>`,
  google: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>`,
}

export class AuthView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="auth-page">

        <!-- Logo topo esquerdo -->
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
          <div class="auth-illustration__figures">
            <!-- Figura 1: pessoa em cadeira de rodas -->
            <div class="auth-figure auth-figure--1">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__wheel"></div>
            </div>
            <!-- Figura 2: pessoa andando com sacola -->
            <div class="auth-figure auth-figure--2">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__bag">🛍️</div>
            </div>
            <!-- Figura 3: pessoa com sacola levantada -->
            <div class="auth-figure auth-figure--3">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__bag">🛍️</div>
            </div>
          </div>
        </div>

        <!-- Painel direito com opções -->
        <div class="auth-panel">
          <h1 class="auth-panel__title">Falta pouco para<br>matar sua fome!</h1>
          <p class="auth-panel__subtitle">Como deseja continuar?</p>

          <!-- Facebook -->
          <button type="button" class="auth-btn auth-btn--facebook" id="btn-auth-facebook" aria-label="Continuar com Facebook">
            <span class="auth-btn__icon">${icons.facebook}</span>
            <span class="auth-btn__label">Continuar com Facebook</span>
          </button>

          <!-- Google -->
          <button type="button" class="auth-btn auth-btn--google" id="btn-auth-google" aria-label="Fazer Login com o Google">
            <span class="auth-btn__icon">${icons.google}</span>
            <span class="auth-btn__label">Fazer Login com o Google</span>
          </button>

          <!-- Divisor -->
          <div class="auth-divider" aria-hidden="true">
            <span>ou</span>
          </div>

          <!-- Celular / E-mail -->
          <div class="auth-options">
            <button type="button" class="auth-btn auth-btn--outline" id="btn-auth-phone" aria-label="Continuar com Celular">
              Celular
            </button>
            <button type="button" class="auth-btn auth-btn--outline" id="btn-auth-email-only" aria-label="Continuar com E-mail">
              E-mail
            </button>
          </div>

          <!-- Termos -->
          <p class="auth-terms">
            Ao continuar, você concorda com os
            <a href="#" tabindex="0">Termos de uso</a> e
            <a href="#" tabindex="0">Política de privacidade</a> do iFood.
          </p>
        </div>

      </div>
    `
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onFacebook(handler) {
    this._el('btn-auth-facebook')?.addEventListener('click', handler)
  }

  onGoogle(handler) {
    this._el('btn-auth-google')?.addEventListener('click', handler)
  }

  /** Celular — inicia fluxo de validação de celular */
  onPhone(handler) {
    this._el('btn-auth-phone')?.addEventListener('click', handler)
  }

  /** E-mail — também inicia pelo celular primeiro (igual iFood) */
  onEmail(handler) {
    this._el('btn-auth-email-only')?.addEventListener('click', handler)
  }

  onLogoBack(handler) {
    document.querySelector('.auth-logo')?.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('auth-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'auth-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _el(id) { return document.getElementById(id) }
}
