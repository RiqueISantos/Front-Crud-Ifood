/**
 * RestauranteClienteView
 *
 * Tela do restaurante vista pelo cliente — hero, cardápio e botão sacola.
 * Rota: #/loja/:id
 */

export class RestauranteClienteView {
  constructor(container) { this._container = container }

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="rc-loading">
        <div class="rc-spinner"></div>
        <span style="color:#9e9e9e;font-size:0.9rem">Carregando cardápio...</span>
      </div>
    `
  }

  render(rest, produtos) {
    const inicial  = (rest.nome ?? 'R').charAt(0).toUpperCase()
    const taxa     = rest.taxa_entrega != null
      ? `R$ ${Number(rest.taxa_entrega).toFixed(2).replace('.', ',')} entrega`
      : 'Entrega grátis'
    const tempo    = rest.tempo_estimado ?? '—'

    // Agrupa produtos por disponibilidade
    const disponiveis   = produtos.filter(p => p.disponivel)
    const indisponiveis = produtos.filter(p => !p.disponivel)

    this._container.innerHTML = /* html */`
      <div class="rc-page">

        <!-- Topbar -->
        <div class="rc-topbar">
          <button class="rc-topbar__back" id="btn-rc-back">← Voltar</button>
          <a href="#/" class="rc-topbar__logo">iFood</a>
          <button class="rc-topbar__sacola-btn" id="btn-abrir-sacola" aria-label="Ver sacola">
            🛒
            <span class="rc-topbar__sacola-count" id="sacola-count">0</span>
            Ver sacola
          </button>
        </div>

        <!-- Hero -->
        <div class="rc-hero">
          <div class="rc-hero__avatar">${inicial}</div>
          <div class="rc-hero__info">
            <div class="rc-hero__nome">${rest.nome}</div>
            <div class="rc-hero__cat">${rest.categoria_principal}</div>
            <div class="rc-hero__meta">
              <span class="rc-hero__meta-item">🛵 ${taxa}</span>
              <span class="rc-hero__meta-item">⏱️ ${tempo}</span>
              <span class="rc-hero__meta-item">📍 ${rest.bairro}, ${rest.cidade}</span>
            </div>
          </div>
        </div>

        <!-- Conteúdo -->
        <div class="rc-content">
          ${disponiveis.length === 0 && indisponiveis.length === 0
            ? /* html */`
              <div class="rc-empty">
                <span class="rc-empty__icon">🍽️</span>
                <p>Este restaurante ainda não tem produtos no cardápio.</p>
              </div>`
            : /* html */`
              ${disponiveis.length > 0 ? /* html */`
                <p class="rc-section-title">Cardápio</p>
                <div class="rc-produtos-grid" id="rc-grid-disponiveis">
                  ${disponiveis.map(p => this._buildCard(p)).join('')}
                </div>` : ''}
              ${indisponiveis.length > 0 ? /* html */`
                <p class="rc-section-title" style="color:#9e9e9e">Indisponíveis</p>
                <div class="rc-produtos-grid">
                  ${indisponiveis.map(p => this._buildCard(p, true)).join('')}
                </div>` : ''}
            `}
        </div>

      </div>

      <!-- Modal de conflito de restaurante -->
      <div class="sacola-conflito-modal" id="modal-conflito" hidden>
        <div class="sacola-conflito-box">
          <p class="sacola-conflito-box__title">Iniciar nova sacola?</p>
          <p class="sacola-conflito-box__text" id="conflito-msg"></p>
          <div class="sacola-conflito-box__btns">
            <button class="cdp-btn-outline" id="btn-conflito-cancelar" style="flex:1">Cancelar</button>
            <button class="cdp-btn-primary" id="btn-conflito-confirmar" style="flex:1">Sim, limpar</button>
          </div>
        </div>
      </div>

      <!-- Modal de observação -->
      <div class="sacola-conflito-modal" id="modal-obs" hidden>
        <div class="sacola-conflito-box">
          <p class="sacola-conflito-box__title" id="obs-produto-nome"></p>
          <p class="sacola-conflito-box__text" style="margin-bottom:8px">Alguma observação? (opcional)</p>
          <textarea
            id="obs-input"
            class="rc-obs-input"
            maxlength="200"
            rows="3"
            placeholder="Ex: sem cebola, ponto da carne bem passado..."
          ></textarea>
          <div class="sacola-conflito-box__btns" style="margin-top:12px">
            <button class="cdp-btn-outline" id="btn-obs-cancelar" style="flex:1">Cancelar</button>
            <button class="cdp-btn-primary" id="btn-obs-confirmar" style="flex:1">Adicionar</button>
          </div>
        </div>
      </div>
    `
  }

  _buildCard(p, desabilitado = false) {
    return /* html */`
      <div class="rc-produto-card" data-id="${p.id}">
        <div class="rc-produto-card__emoji">🍽️</div>
        <div class="rc-produto-card__info">
          <div class="rc-produto-card__nome">${p.nome}</div>
          <div class="rc-produto-card__desc">${p.descricao}</div>
          <div class="rc-produto-card__preco">R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</div>
        </div>
        <button
          class="rc-produto-card__add"
          data-id="${p.id}"
          data-nome="${this._esc(p.nome)}"
          data-preco="${p.preco}"
          aria-label="Adicionar ${p.nome}"
          ${desabilitado ? 'disabled' : ''}
        >+</button>
      </div>
    `
  }

  // ── Sacola count badge ────────────────────────────────────────────────────

  atualizarContSacola(total) {
    const el = document.getElementById('sacola-count')
    if (el) el.textContent = total
  }

  // ── Modal conflito ────────────────────────────────────────────────────────

  showConflito(msg) {
    const m = document.getElementById('modal-conflito')
    const t = document.getElementById('conflito-msg')
    if (t) t.textContent = msg
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
  }

  hideConflito() {
    const m = document.getElementById('modal-conflito')
    if (m) { m.setAttribute('hidden', ''); m.style.display = 'none' }
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(msg, type = 'default') {
    let t = document.getElementById('rc-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'rc-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3000)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onVoltar(h)          { document.getElementById('btn-rc-back')?.addEventListener('click', h) }
  onAbrirSacola(h)     { document.getElementById('btn-abrir-sacola')?.addEventListener('click', h) }
  onConflitoCancelar(h){ document.getElementById('btn-conflito-cancelar')?.addEventListener('click', h) }
  onConflitoConfirmar(h){ document.getElementById('btn-conflito-confirmar')?.addEventListener('click', h) }

  onAdicionarProduto(h) {
    document.querySelectorAll('.rc-produto-card__add').forEach(btn => {
      btn.addEventListener('click', () => h({
        id:    Number(btn.dataset.id),
        nome:  btn.dataset.nome,
        preco: Number(btn.dataset.preco),
      }))
    })
  }

  // ── Modal observação ──────────────────────────────────────────────────────

  showObs(produto) {
    const m = document.getElementById('modal-obs')
    const n = document.getElementById('obs-produto-nome')
    const i = document.getElementById('obs-input')
    if (n) n.textContent = produto.nome
    if (i) i.value = ''
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
    setTimeout(() => i?.focus(), 100)
  }

  hideObs() {
    const m = document.getElementById('modal-obs')
    if (m) { m.setAttribute('hidden', ''); m.style.display = 'none' }
  }

  getObs() {
    return (document.getElementById('obs-input')?.value ?? '').trim()
  }

  onObsCancelar(h)  { document.getElementById('btn-obs-cancelar')?.addEventListener('click', h) }
  onObsConfirmar(h) { document.getElementById('btn-obs-confirmar')?.addEventListener('click', h) }

  _esc(v) { return (v ?? '').toString().replace(/"/g, '&quot;') }
}
