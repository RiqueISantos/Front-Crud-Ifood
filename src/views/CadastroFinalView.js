/**
 * CadastroFinalView
 *
 * Tela final de cadastro — igual ao print do iFood.
 * Layout: logo topo esquerdo, ilustração esquerda, painel direito.
 */

export class CadastroFinalView {
  constructor(container) {
    this._container = container
  }

  render(email = '') {
    this._container.innerHTML = /* html */`
      <div class="auth-page">

        <!-- Logo -->
        <a href="#/" class="auth-logo" aria-label="iFood – página inicial">
          <span class="auth-logo__text">iFood</span>
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

        <!-- Ilustração esquerda -->
        <div class="auth-illustration" aria-hidden="true">
          <div class="auth-illustration__circle"></div>
          <div class="auth-illustration__figures">
            <div class="auth-figure auth-figure--1">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__wheel"></div>
            </div>
            <div class="auth-figure auth-figure--2">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__bag">🛍️</div>
            </div>
            <div class="auth-figure auth-figure--3">
              <div class="auth-figure__body"></div>
              <div class="auth-figure__bag">🛍️</div>
            </div>
          </div>
        </div>

        <!-- Painel direito -->
        <div class="auth-panel" style="gap:12px">

          <button type="button" class="verify-back" id="btn-back-cadastro"
            aria-label="Voltar" style="align-self:flex-start;margin-bottom:4px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <h1 class="auth-panel__title" style="font-size:1.5rem;margin-bottom:8px">Cadastrar</h1>

          <!-- Nome completo -->
          <div class="cadastro-field-wrap">
            <input
              type="text"
              class="cadastro-field"
              id="cadastro-nome"
              placeholder="Nome completo"
              autocomplete="name"
              aria-label="Nome completo"
              aria-required="true"
            />
            <span class="verify-error" id="cadastro-nome-error" role="alert" aria-live="polite"></span>
          </div>

          <!-- CPF opcional -->
          <div class="cadastro-field-wrap">
            <input
              type="text"
              class="cadastro-field"
              id="cadastro-cpf"
              placeholder="CPF (opcional)"
              inputmode="numeric"
              maxlength="14"
              autocomplete="off"
              aria-label="CPF opcional"
            />
          </div>

          <!-- E-mail readonly -->
          <div class="cadastro-email-block">
            <span class="cadastro-email-label">E-mail</span>
            <span class="cadastro-email-value" id="cadastro-email-display">${email}</span>
          </div>

          <!-- Termos -->
          <p class="cadastro-termos">
            Concordo com os
            <a href="#" tabindex="0">Termos de Uso</a>
            e a
            <a href="#" tabindex="0">Política de Privacidade</a>
          </p>

          <!-- Botão cadastrar -->
          <button type="button" class="verify-btn-submit" id="btn-cadastrar">
            Cadastrar
          </button>

          <!-- Já tem conta -->
          <p class="cadastro-ja-tem">
            Já tem conta?
            <button type="button" id="btn-ja-tem-conta" class="cadastro-entrar-link">
              Entrar
            </button>
          </p>

        </div>
      </div>
    `

    this._bindCpfMask()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getNome() { return (document.getElementById('cadastro-nome')?.value ?? '').trim() }
  getCpf()  { return (document.getElementById('cadastro-cpf')?.value  ?? '').replace(/\D/g, '') }

  // ── UI ────────────────────────────────────────────────────────────────────

  showNomeError(msg) {
    const el = document.getElementById('cadastro-nome-error')
    const input = document.getElementById('cadastro-nome')
    if (el) el.textContent = msg
    if (input) input.classList.add('error')
  }

  clearNomeError() {
    const el = document.getElementById('cadastro-nome-error')
    const input = document.getElementById('cadastro-nome')
    if (el) el.textContent = ''
    if (input) input.classList.remove('error')
  }

  setLoading(v) {
    const btn = document.getElementById('btn-cadastrar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Cadastrando...' : 'Cadastrar'
  }

  showToast(message, type = 'default') {
    let t = document.getElementById('cadastro-final-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'cadastro-final-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = message
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onCadastrar(handler)  { document.getElementById('btn-cadastrar')?.addEventListener('click', handler) }
  onVoltar(handler)     { document.getElementById('btn-back-cadastro')?.addEventListener('click', handler) }
  onJaTemConta(handler) { document.getElementById('btn-ja-tem-conta')?.addEventListener('click', handler) }

  // ── CPF mask ──────────────────────────────────────────────────────────────

  _bindCpfMask() {
    const input = document.getElementById('cadastro-cpf')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11)
      if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
      else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
      input.value = v
    })
  }
}
