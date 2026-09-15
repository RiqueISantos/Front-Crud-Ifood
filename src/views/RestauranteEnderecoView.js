/**
 * RestauranteEnderecoView
 *
 * Tela de endereço do restaurante — etapa 4 (última) do cadastro.
 * Auto-preenche logradouro, bairro, cidade e UF via CEP.
 * Campos: CEP, logradouro (readonly após consulta), número, complemento,
 *         bairro (readonly), cidade (readonly), UF (readonly).
 */

export class RestauranteEnderecoView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="rest-page rest-page--wide">

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

        <!-- Painel -->
        <div class="rest-panel rest-panel--wide">

          <button type="button" class="verify-back" id="btn-back-endereco" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <!-- Indicador de progresso -->
          <div class="rest-progress" aria-label="Passo 2 de 2: Endereço do restaurante">
            <div class="rest-progress__step rest-progress__step--done">
              <span class="rest-progress__num">✓</span>
              <span class="rest-progress__label">Dados</span>
            </div>
            <div class="rest-progress__line rest-progress__line--done"></div>
            <div class="rest-progress__step rest-progress__step--active">
              <span class="rest-progress__num">2</span>
              <span class="rest-progress__label">Endereço</span>
            </div>
          </div>

          <h1 class="rest-panel__title">Endereço do<br>restaurante</h1>
          <p class="rest-panel__subtitle">
            Informe onde seu restaurante está localizado.
          </p>

          <!-- CEP -->
          <div class="rest-field-wrap rest-cep-wrap">
            <label class="rest-label" for="rest-cep">CEP <span class="rest-required" aria-hidden="true">*</span></label>
            <div class="rest-cep-row">
              <input
                type="text"
                class="rest-input"
                id="rest-cep"
                placeholder="00000-000"
                inputmode="numeric"
                maxlength="9"
                autocomplete="postal-code"
                aria-required="true"
              />
              <button type="button" class="rest-btn-cep" id="btn-buscar-cep" aria-label="Buscar CEP">
                Buscar
              </button>
            </div>
            <span class="rest-error" id="rest-cep-error" role="alert" aria-live="polite"></span>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              class="rest-cep-link"
              tabindex="0"
            >
              Não sei meu CEP
            </a>
          </div>

          <!-- Logradouro (preenchido pelo ViaCEP, editável se cidade com CEP único) -->
          <div class="rest-field-wrap" id="rest-endereco-fields" hidden>

            <div class="rest-field-wrap">
              <label class="rest-label" for="rest-logradouro">Rua / Avenida <span class="rest-required" aria-hidden="true">*</span></label>
              <input
                type="text"
                class="rest-input"
                id="rest-logradouro"
                placeholder="Nome da rua ou avenida"
                autocomplete="street-address"
                aria-required="true"
              />
              <span class="rest-error" id="rest-logradouro-error" role="alert" aria-live="polite"></span>
            </div>

            <!-- Número + Complemento na mesma linha -->
            <div class="rest-row">
              <div class="rest-field-wrap">
                <label class="rest-label" for="rest-numero">Número <span class="rest-required" aria-hidden="true">*</span></label>
                <input
                  type="text"
                  class="rest-input"
                  id="rest-numero"
                  placeholder="Ex: 123"
                  inputmode="numeric"
                  maxlength="10"
                  autocomplete="off"
                  aria-required="true"
                />
                <span class="rest-error" id="rest-numero-error" role="alert" aria-live="polite"></span>
              </div>

              <div class="rest-field-wrap">
                <label class="rest-label" for="rest-complemento">Complemento</label>
                <input
                  type="text"
                  class="rest-input"
                  id="rest-complemento"
                  placeholder="Apto, sala, bloco..."
                  maxlength="100"
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Bairro -->
            <div class="rest-field-wrap">
              <label class="rest-label" for="rest-bairro">Bairro</label>
              <input
                type="text"
                class="rest-input rest-input--readonly"
                id="rest-bairro"
                placeholder="Preenchido automaticamente"
                readonly
                aria-readonly="true"
              />
            </div>

            <!-- Cidade + UF na mesma linha -->
            <div class="rest-row">
              <div class="rest-field-wrap" style="flex:2">
                <label class="rest-label" for="rest-cidade">Cidade</label>
                <input
                  type="text"
                  class="rest-input rest-input--readonly"
                  id="rest-cidade"
                  placeholder="Preenchido automaticamente"
                  readonly
                  aria-readonly="true"
                />
              </div>
              <div class="rest-field-wrap" style="flex:0 0 80px">
                <label class="rest-label" for="rest-uf">UF</label>
                <input
                  type="text"
                  class="rest-input rest-input--readonly"
                  id="rest-uf"
                  placeholder="SP"
                  readonly
                  aria-readonly="true"
                  maxlength="2"
                />
              </div>
            </div>

          </div>

          <!-- Spinner de busca de CEP -->
          <div class="rest-cep-loading" id="rest-cep-loading" hidden aria-live="polite" aria-label="Buscando CEP...">
            <div class="rest-spinner" aria-hidden="true"></div>
            <span>Buscando endereço...</span>
          </div>

          <button type="button" class="rest-btn-primary" id="btn-endereco-finalizar" hidden>
            Finalizar cadastro
          </button>

        </div>
      </div>
    `

    this._bindCepMask()
    this._bindCepEnter()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getEndereco() {
    return {
      cep:         (document.getElementById('rest-cep')?.value          ?? '').replace(/\D/g, ''),
      logradouro:  (document.getElementById('rest-logradouro')?.value   ?? '').trim(),
      numero:      (document.getElementById('rest-numero')?.value       ?? '').trim(),
      complemento: (document.getElementById('rest-complemento')?.value  ?? '').trim() || null,
      bairro:      (document.getElementById('rest-bairro')?.value       ?? '').trim(),
      cidade:      (document.getElementById('rest-cidade')?.value       ?? '').trim(),
      uf:          (document.getElementById('rest-uf')?.value           ?? '').trim(),
    }
  }

  getCep() {
    return (document.getElementById('rest-cep')?.value ?? '').replace(/\D/g, '')
  }

  // ── Preenchimento automático ──────────────────────────────────────────────

  preencherEndereco({ logradouro, bairro, cidade, uf }) {
    const setVal = (id, val) => {
      const el = document.getElementById(id)
      if (el) el.value = val ?? ''
    }
    setVal('rest-logradouro', logradouro)
    setVal('rest-bairro',     bairro)
    setVal('rest-cidade',     cidade)
    setVal('rest-uf',         uf)

    // Se logradouro veio preenchido, deixa readonly; senão, permite editar
    const logEl = document.getElementById('rest-logradouro')
    if (logEl) {
      if (logradouro) {
        logEl.readOnly = true
        logEl.classList.add('rest-input--readonly')
      } else {
        logEl.readOnly = false
        logEl.classList.remove('rest-input--readonly')
        logEl.placeholder = 'Informe o nome da rua ou avenida'
      }
    }

    // Foca no número
    setTimeout(() => document.getElementById('rest-numero')?.focus(), 80)
  }

  showEnderecoFields() {
    const el = document.getElementById('rest-endereco-fields')
    const btn = document.getElementById('btn-endereco-finalizar')
    if (el)  { el.removeAttribute('hidden');  el.style.display = 'flex' }
    if (btn) { btn.removeAttribute('hidden'); btn.style.display = 'block' }
  }

  hideEnderecoFields() {
    const el = document.getElementById('rest-endereco-fields')
    const btn = document.getElementById('btn-endereco-finalizar')
    if (el)  { el.setAttribute('hidden', '');  el.style.display = 'none' }
    if (btn) { btn.setAttribute('hidden', ''); btn.style.display = 'none' }
  }

  // ── Loading do CEP ────────────────────────────────────────────────────────

  setCepLoading(loading) {
    const spinner = document.getElementById('rest-cep-loading')
    const btn     = document.getElementById('btn-buscar-cep')
    if (spinner) {
      if (loading) { spinner.removeAttribute('hidden') }
      else         { spinner.setAttribute('hidden', '') }
    }
    if (btn) {
      btn.disabled    = loading
      btn.textContent = loading ? '...' : 'Buscar'
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showFieldError(campo, msg) {
    const el    = document.getElementById(`rest-${campo}-error`)
    const input = document.getElementById(`rest-${campo}`)
    if (el)    el.textContent = msg
    if (input) input.classList.add('error')
  }

  clearFieldError(campo) {
    const el    = document.getElementById(`rest-${campo}-error`)
    const input = document.getElementById(`rest-${campo}`)
    if (el)    el.textContent = ''
    if (input) input.classList.remove('error')
  }

  clearAllErrors() {
    ['cep', 'logradouro', 'numero'].forEach(c => this.clearFieldError(c))
  }

  setFinalizarLoading(loading) {
    const btn = document.getElementById('btn-endereco-finalizar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Cadastrando...' : 'Finalizar cadastro'
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('rest-endereco-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'rest-endereco-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onBuscarCep(handler) {
    document.getElementById('btn-buscar-cep')?.addEventListener('click', handler)
  }

  onFinalizar(handler) {
    document.getElementById('btn-endereco-finalizar')?.addEventListener('click', handler)
  }

  onVoltar(handler) {
    document.getElementById('btn-back-endereco')?.addEventListener('click', handler)
  }

  // ── Máscara de CEP ────────────────────────────────────────────────────────

  _bindCepMask() {
    const input = document.getElementById('rest-cep')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 8)
      if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2')
      input.value = v
    })
  }

  _bindCepEnter() {
    const input = document.getElementById('rest-cep')
    if (!input) return
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-buscar-cep')?.click()
    })
  }
}
