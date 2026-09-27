/**
 * RestauranteDadosView
 *
 * Tela de dados do restaurante — etapa 3 do cadastro.
 * Campos: nome, telefone, categoria principal, taxa de entrega, tempo estimado.
 * Layout igual ao iFood para parceiros.
 */

const CATEGORIAS = [
  'Lanches',
  'Pizza',
  'Japonesa',
  'Brasileira',
  'Italiana',
  'Árabe',
  'Mexicana',
  'Chinesa',
  'Frutos do Mar',
  'Vegetariana',
  'Saudável',
  'Açaí',
  'Sorvetes',
  'Doces & Bolos',
  'Padaria',
  'Cafeteria',
  'Carnes',
  'Frango',
  'Marmita',
  'Bebidas',
  'Outro',
]

export class RestauranteDadosView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render(email = '') {
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

          <button type="button" class="verify-back" id="btn-back-dados" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Voltar
          </button>

          <!-- Indicador de progresso -->
          <div class="rest-progress" aria-label="Passo 1 de 2: Dados do restaurante">
            <div class="rest-progress__step rest-progress__step--active">
              <span class="rest-progress__num">1</span>
              <span class="rest-progress__label">Dados</span>
            </div>
            <div class="rest-progress__line"></div>
            <div class="rest-progress__step">
              <span class="rest-progress__num">2</span>
              <span class="rest-progress__label">Endereço</span>
            </div>
          </div>

          <h1 class="rest-panel__title">Dados do<br>restaurante</h1>
          <p class="rest-panel__subtitle">
            Preencha as informações do seu estabelecimento.
          </p>

          <!-- E-mail readonly -->
          <div class="rest-email-readonly">
            <span class="rest-email-readonly__label">E-mail verificado</span>
            <span class="rest-email-readonly__value" id="rest-dados-email">${email}</span>
          </div>

          <!-- Nome do restaurante -->
          <div class="rest-field-wrap">
            <label class="rest-label" for="rest-nome">Nome do restaurante <span class="rest-required" aria-hidden="true">*</span></label>
            <input
              type="text"
              class="rest-input"
              id="rest-nome"
              placeholder="Ex: Pizzaria do João"
              autocomplete="organization"
              maxlength="50"
              aria-required="true"
            />
            <span class="rest-error" id="rest-nome-error" role="alert" aria-live="polite"></span>
          </div>

          <!-- Telefone -->
          <div class="rest-field-wrap">
            <label class="rest-label" for="rest-telefone">Telefone / WhatsApp <span class="rest-required" aria-hidden="true">*</span></label>
            <input
              type="tel"
              class="rest-input"
              id="rest-telefone"
              placeholder="(11) 99999-9999"
              inputmode="tel"
              maxlength="15"
              autocomplete="tel"
              aria-required="true"
            />
            <span class="rest-error" id="rest-telefone-error" role="alert" aria-live="polite"></span>
          </div>

          <!-- Categoria principal -->
          <div class="rest-field-wrap">
            <label class="rest-label" for="rest-categoria">Categoria principal <span class="rest-required" aria-hidden="true">*</span></label>
            <div class="rest-select-wrap">
              <select class="rest-input rest-select" id="rest-categoria" aria-required="true">
                <option value="" disabled selected>Selecione uma categoria</option>
                ${CATEGORIAS.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
              <span class="rest-select-arrow" aria-hidden="true">▾</span>
            </div>
            <span class="rest-error" id="rest-categoria-error" role="alert" aria-live="polite"></span>
          </div>

          <!-- Linha: Taxa + Tempo -->
          <div class="rest-row">
            <div class="rest-field-wrap">
              <label class="rest-label" for="rest-taxa">Taxa de entrega (R$)</label>
              <div class="rest-input-prefix-wrap">
                <span class="rest-input-prefix" aria-hidden="true">R$</span>
                <input
                  type="number"
                  class="rest-input rest-input--prefixed"
                  id="rest-taxa"
                  placeholder="0,00"
                  min="0"
                  step="0.50"
                  inputmode="decimal"
                  aria-label="Taxa de entrega em reais"
                />
              </div>
              <span class="rest-hint">Deixe em branco para grátis</span>
            </div>

            <div class="rest-field-wrap">
              <label class="rest-label" for="rest-tempo">Tempo estimado</label>
              <div class="rest-select-wrap">
                <select class="rest-input rest-select" id="rest-tempo" aria-label="Tempo estimado de entrega">
                  <option value="" selected>Não informar</option>
                  <option value="10-20 min">10-20 min</option>
                  <option value="20-30 min">20-30 min</option>
                  <option value="30-40 min">30-40 min</option>
                  <option value="40-50 min">40-50 min</option>
                  <option value="50-60 min">50-60 min</option>
                  <option value="60-75 min">60-75 min</option>
                  <option value="75-90 min">75-90 min</option>
                </select>
                <span class="rest-select-arrow" aria-hidden="true">▾</span>
              </div>
            </div>
          </div>

          <button type="button" class="rest-btn-primary" id="btn-dados-continuar">
            Continuar
          </button>

        </div>
      </div>
    `

    this._bindPhoneMask()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getDados() {
    const taxa = parseFloat(document.getElementById('rest-taxa')?.value ?? '') || null
    const tempo = document.getElementById('rest-tempo')?.value || null
    return {
      nome:               (document.getElementById('rest-nome')?.value       ?? '').trim(),
      telefone:           (document.getElementById('rest-telefone')?.value   ?? '').trim(),
      categoria_principal: (document.getElementById('rest-categoria')?.value ?? '').trim(),
      taxa_entrega:       taxa,
      tempo_estimado:     tempo || null,
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
    ['nome', 'telefone', 'categoria'].forEach(c => this.clearFieldError(c))
  }

  setLoading(loading) {
    const btn = document.getElementById('btn-dados-continuar')
    if (!btn) return
    btn.disabled    = loading
    btn.textContent = loading ? 'Aguarde...' : 'Continuar'
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('rest-dados-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'rest-dados-toast'
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
    document.getElementById('btn-dados-continuar')?.addEventListener('click', handler)
  }

  onVoltar(handler) {
    document.getElementById('btn-back-dados')?.addEventListener('click', handler)
  }

  // ── Máscara de telefone ───────────────────────────────────────────────────

  _bindPhoneMask() {
    const input = document.getElementById('rest-telefone')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11)
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      } else if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2')
      } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, '($1')
      }
      input.value = v
    })
  }
}
