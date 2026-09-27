/**
 * CardapioView
 *
 * Tela de gerenciamento do cardápio do parceiro.
 * Acessada pelo menu "Cardápio" no dashboard do restaurante.
 * Permite: listar, criar, editar, ativar/desativar e deletar produtos.
 */

export class CardapioView {
  constructor(container) { this._container = container }

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="rdash-root">
        <aside class="rdash-sidebar">
          <a href="#/restaurante/dashboard" class="rdash-sidebar__logo">
            <span class="rdash-sidebar__logo-text">iFood</span>
            <span class="rdash-sidebar__logo-sub">para restaurantes</span>
          </a>
          <div class="rdash-sidebar__nav" style="padding-top:20px">
            <button class="rdash-nav-item" id="btn-cdp-back">
              <span class="rdash-nav-item__icon">←</span> Voltar ao painel
            </button>
          </div>
        </aside>
        <div class="rdash-main">
          <header class="rdash-header">
            <h1 class="rdash-header__title">Cardápio</h1>
          </header>
          <main class="rdash-content" style="display:flex;align-items:center;justify-content:center">
            <div class="perfil-loading">
              <div class="perfil-spinner"></div>
              <span>Carregando cardápio...</span>
            </div>
          </main>
        </div>
      </div>
    `
  }

  render(produtos = []) {
    this._container.innerHTML = /* html */`
      <div class="rdash-root">

        <aside class="rdash-sidebar">
          <a href="#/restaurante/dashboard" class="rdash-sidebar__logo">
            <span class="rdash-sidebar__logo-text">iFood</span>
            <span class="rdash-sidebar__logo-sub">para restaurantes</span>
          </a>
          <div class="rdash-sidebar__nav" style="padding-top:20px">
            <button class="rdash-nav-item" id="btn-cdp-back">
              <span class="rdash-nav-item__icon">←</span> Voltar ao painel
            </button>
          </div>
        </aside>

        <div class="rdash-main">
          <header class="rdash-header">
            <h1 class="rdash-header__title">Cardápio</h1>
          </header>

          <main class="rdash-content">

            <!-- Topbar: busca + botão novo -->
            <div class="cdp-topbar">
              <div class="cdp-search">
                <span class="cdp-search__icon">🔍</span>
                <input class="cdp-search__input" id="cdp-search-input"
                  type="search" placeholder="Buscar produto..." autocomplete="off" />
              </div>
              <button class="rdash-metric-card" id="btn-cdp-novo"
                style="cursor:pointer;background:#EA1D2C;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:0.88rem;font-weight:700;font-family:inherit;transition:background 0.15s;flex-shrink:0">
                + Novo produto
              </button>
            </div>

            <!-- Grid de produtos -->
            <div class="cdp-grid" id="cdp-grid">
              ${produtos.length === 0
                ? /* html */`
                  <div style="grid-column:1/-1">
                    <div class="perfil-empty">
                      <span class="perfil-empty__icon">🍽️</span>
                      <p>Nenhum produto cadastrado ainda.<br>Clique em "+ Novo produto" para começar.</p>
                    </div>
                  </div>`
                : produtos.map(p => this._buildCard(p)).join('')
              }
            </div>

          </main>
        </div>
      </div>

      ${this._buildModal()}
      ${this._buildModalDeletar()}
    `

    this._bindSearch(produtos)
  }

  // ── Card ──────────────────────────────────────────────────────────────────

  _buildCard(p) {
    const disp = p.disponivel
    return /* html */`
      <div class="cdp-card" data-id="${p.id}">
        <div class="cdp-card__body">
          <div class="cdp-card__emoji">🍽️</div>
          <div class="cdp-card__info">
            <div class="cdp-card__nome">
              ${p.nome}
              <span class="cdp-card__status ${disp ? 'cdp-card__status--on' : 'cdp-card__status--off'}">
                ${disp ? '● Ativo' : '● Inativo'}
              </span>
            </div>
            <div class="cdp-card__desc">${p.descricao}</div>
            <div class="cdp-card__preco">R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</div>
          </div>
        </div>
        <div class="cdp-card__footer">
          <label class="cdp-card__toggle">
            <input type="checkbox" class="cdp-toggle-check" data-id="${p.id}" ${disp ? 'checked' : ''}
              style="display:none" />
            <span>${disp ? 'Desativar' : 'Ativar'}</span>
          </label>
          <button class="cdp-btn-edit" data-id="${p.id}" title="Editar">✏️</button>
          <button class="cdp-btn-del"  data-id="${p.id}" title="Excluir">🗑️</button>
        </div>
      </div>
    `
  }

  // ── Modal criar/editar ────────────────────────────────────────────────────

  _buildModal() {
    return /* html */`
      <div class="cdp-modal-overlay" id="cdp-modal" hidden>
        <div class="cdp-modal" role="dialog" aria-modal="true" aria-labelledby="cdp-modal-title">

          <h2 class="cdp-modal__title" id="cdp-modal-title">Novo produto</h2>

          <div class="cdp-field">
            <label class="cdp-label" for="cdp-nome">Nome *</label>
            <input class="cdp-input" type="text" id="cdp-nome" maxlength="60"
              placeholder="Ex: X-Burguer Especial" />
            <span class="cdp-error" id="cdp-nome-error"></span>
          </div>

          <div class="cdp-field">
            <label class="cdp-label" for="cdp-desc">Descrição *</label>
            <textarea class="cdp-input" id="cdp-desc" rows="3"
              placeholder="Ingredientes, detalhes do produto..."></textarea>
            <span class="cdp-error" id="cdp-desc-error"></span>
          </div>

          <div class="cdp-row">
            <div class="cdp-field">
              <label class="cdp-label" for="cdp-preco">Preço *</label>
              <div class="cdp-prefix-wrap">
                <span class="cdp-prefix">R$</span>
                <input class="cdp-input cdp-input--prefixed" type="number"
                  id="cdp-preco" min="0.01" step="0.01" placeholder="0,00"
                  inputmode="decimal" />
              </div>
              <span class="cdp-error" id="cdp-preco-error"></span>
            </div>

            <div class="cdp-field" style="justify-content:flex-end">
              <label class="cdp-label">Disponível</label>
              <div class="cdp-toggle-wrap">
                <label class="cdp-toggle" aria-label="Produto disponível">
                  <input type="checkbox" id="cdp-disponivel" checked>
                  <span class="cdp-toggle__slider"></span>
                </label>
                <span class="cdp-toggle-label" id="cdp-disponivel-label">Sim</span>
              </div>
            </div>
          </div>

          <input type="hidden" id="cdp-edit-id" value="" />

          <div class="cdp-modal__actions">
            <button class="cdp-btn-outline"  id="btn-cdp-cancelar">Cancelar</button>
            <button class="cdp-btn-primary"  id="btn-cdp-salvar">Salvar produto</button>
          </div>

        </div>
      </div>
    `
  }

  _buildModalDeletar() {
    return /* html */`
      <div class="cdp-modal-overlay" id="cdp-modal-del" hidden>
        <div class="cdp-modal" role="dialog" aria-modal="true" style="max-width:380px">
          <h2 class="cdp-modal__title">Excluir produto?</h2>
          <p style="font-size:0.88rem;color:#616161">
            Esta ação é permanente e não pode ser desfeita.
          </p>
          <input type="hidden" id="cdp-del-id" value="" />
          <div class="cdp-modal__actions">
            <button class="cdp-btn-outline" id="btn-cdp-del-cancelar">Cancelar</button>
            <button class="cdp-btn-danger"  id="btn-cdp-del-confirmar">Excluir</button>
          </div>
        </div>
      </div>
    `
  }

  // ── Modais ────────────────────────────────────────────────────────────────

  showModal(produto = null) {
    const m = document.getElementById('cdp-modal')
    const t = document.getElementById('cdp-modal-title')
    if (produto) {
      if (t) t.textContent = 'Editar produto'
      document.getElementById('cdp-edit-id').value   = produto.id
      document.getElementById('cdp-nome').value      = produto.nome
      document.getElementById('cdp-desc').value      = produto.descricao
      document.getElementById('cdp-preco').value     = produto.preco
      document.getElementById('cdp-disponivel').checked = produto.disponivel
      this._atualizarLabelDisponivel(produto.disponivel)
    } else {
      if (t) t.textContent = 'Novo produto'
      document.getElementById('cdp-edit-id').value   = ''
      document.getElementById('cdp-nome').value      = ''
      document.getElementById('cdp-desc').value      = ''
      document.getElementById('cdp-preco').value     = ''
      document.getElementById('cdp-disponivel').checked = true
      this._atualizarLabelDisponivel(true)
    }
    this.clearAllErrors()
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
    setTimeout(() => document.getElementById('cdp-nome')?.focus(), 50)
    this._bindDisponivelToggle()
  }

  hideModal() {
    const m = document.getElementById('cdp-modal')
    if (m) { m.setAttribute('hidden', ''); m.style.display = 'none' }
  }

  showDelModal(id) {
    const m = document.getElementById('cdp-modal-del')
    const i = document.getElementById('cdp-del-id')
    if (i) i.value = id
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
  }

  hideDelModal() {
    const m = document.getElementById('cdp-modal-del')
    if (m) { m.setAttribute('hidden', ''); m.style.display = 'none' }
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getFormData() {
    return {
      id:         document.getElementById('cdp-edit-id')?.value || null,
      nome:       (document.getElementById('cdp-nome')?.value  ?? '').trim(),
      descricao:  (document.getElementById('cdp-desc')?.value  ?? '').trim(),
      preco:      parseFloat(document.getElementById('cdp-preco')?.value ?? ''),
      disponivel: document.getElementById('cdp-disponivel')?.checked ?? true,
    }
  }

  getDelId() { return document.getElementById('cdp-del-id')?.value || null }

  // ── UI ────────────────────────────────────────────────────────────────────

  showFieldError(campo, msg) {
    const el  = document.getElementById(`cdp-${campo}-error`)
    const inp = document.getElementById(`cdp-${campo}`)
    if (el)  el.textContent = msg
    if (inp) inp.classList.add('error')
  }

  clearFieldError(campo) {
    const el  = document.getElementById(`cdp-${campo}-error`)
    const inp = document.getElementById(`cdp-${campo}`)
    if (el)  el.textContent = ''
    if (inp) inp.classList.remove('error')
  }

  clearAllErrors() { ['nome','desc','preco'].forEach(c => this.clearFieldError(c)) }

  setSalvarLoading(v) {
    const btn = document.getElementById('btn-cdp-salvar')
    if (!btn) return
    btn.disabled    = v
    btn.textContent = v ? 'Salvando...' : 'Salvar produto'
  }

  setDelLoading(v) {
    const btn = document.getElementById('btn-cdp-del-confirmar')
    if (!btn) return
    btn.disabled    = v
    btn.textContent = v ? 'Excluindo...' : 'Excluir'
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('cdp-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'cdp-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onVoltar(h)          { document.getElementById('btn-cdp-back')?.addEventListener('click', h) }
  onNovo(h)            { document.getElementById('btn-cdp-novo')?.addEventListener('click', h) }
  onModalCancelar(h)   { document.getElementById('btn-cdp-cancelar')?.addEventListener('click', h) }
  onModalSalvar(h)     { document.getElementById('btn-cdp-salvar')?.addEventListener('click', h) }
  onDelCancelar(h)     { document.getElementById('btn-cdp-del-cancelar')?.addEventListener('click', h) }
  onDelConfirmar(h)    { document.getElementById('btn-cdp-del-confirmar')?.addEventListener('click', h) }

  onEditar(h) {
    document.querySelectorAll('.cdp-btn-edit').forEach(btn =>
      btn.addEventListener('click', () => h(Number(btn.dataset.id)))
    )
  }

  onDeletar(h) {
    document.querySelectorAll('.cdp-btn-del').forEach(btn =>
      btn.addEventListener('click', () => h(Number(btn.dataset.id)))
    )
  }

  onToggleDisponivel(h) {
    document.querySelectorAll('.cdp-toggle-check').forEach(chk =>
      chk.addEventListener('change', () => h(Number(chk.dataset.id), chk.checked))
    )
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _atualizarLabelDisponivel(v) {
    const el = document.getElementById('cdp-disponivel-label')
    if (el) el.textContent = v ? 'Sim' : 'Não'
  }

  _bindDisponivelToggle() {
    document.getElementById('cdp-disponivel')?.addEventListener('change', (e) => {
      this._atualizarLabelDisponivel(e.target.checked)
    })
  }

  _bindSearch(produtos) {
    const input = document.getElementById('cdp-search-input')
    if (!input) return
    input.addEventListener('input', () => {
      const q   = input.value.trim().toLowerCase()
      const grid = document.getElementById('cdp-grid')
      if (!grid) return
      const filtrados = q ? produtos.filter(p => p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q)) : produtos
      grid.innerHTML = filtrados.length
        ? filtrados.map(p => this._buildCard(p)).join('')
        : `<div style="grid-column:1/-1"><div class="perfil-empty"><span class="perfil-empty__icon">🔍</span><p>Nenhum produto encontrado para "${input.value}".</p></div></div>`
      // Re-bind após re-render
      this._rebindCards()
    })
  }

  _rebindCards() {
    // Dispara evento customizado para o controller re-fazer os binds
    document.dispatchEvent(new CustomEvent('cdp:rebind'))
  }
}
