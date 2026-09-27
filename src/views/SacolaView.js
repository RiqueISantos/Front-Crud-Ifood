/**
 * SacolaView
 *
 * Drawer lateral da sacola — montado no <body> independente de rota.
 * Gerenciado pelo SacolaController que é singleton na sessão.
 */

export class SacolaView {
  constructor() {
    this._overlay = null
    this._drawer  = null
  }

  // ── Montagem no DOM ───────────────────────────────────────────────────────

  mount() {
    // Evita duplicar
    if (document.getElementById('sacola-overlay')) return

    const wrapper = document.createElement('div')
    wrapper.innerHTML = /* html */`
      <div class="sacola-overlay" id="sacola-overlay"></div>
      <div class="sacola-drawer"  id="sacola-drawer" role="dialog" aria-modal="true" aria-label="Sacola de compras">

        <div class="sacola-header">
          <span class="sacola-header__title">🛒 Minha sacola</span>
          <button class="sacola-header__close" id="btn-sacola-fechar" aria-label="Fechar sacola">✕</button>
        </div>

        <div class="sacola-rest-info" id="sacola-rest-info" style="display:none"></div>

        <div class="sacola-itens" id="sacola-itens">
          <div class="sacola-empty">
            <span class="sacola-empty__icon">🛒</span>
            <p class="sacola-empty__text">Sua sacola está vazia.<br>Adicione itens de um restaurante.</p>
          </div>
        </div>

        <div class="sacola-footer" id="sacola-footer" style="display:none">
          <div class="sacola-totais" id="sacola-totais"></div>
          <button class="sacola-btn-finalizar" id="btn-sacola-finalizar">
            Finalizar pedido
          </button>
          <button class="sacola-btn-limpar" id="btn-sacola-limpar">
            Limpar sacola
          </button>
        </div>

      </div>
    `

    document.body.appendChild(wrapper.children[0]) // overlay
    document.body.appendChild(wrapper.children[0]) // drawer

    this._overlay = document.getElementById('sacola-overlay')
    this._drawer  = document.getElementById('sacola-drawer')
  }

  // ── Abrir / fechar ────────────────────────────────────────────────────────

  open() {
    this._overlay?.classList.add('open')
    this._drawer?.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  close() {
    this._overlay?.classList.remove('open')
    this._drawer?.classList.remove('open')
    document.body.style.overflow = ''
  }

  isOpen() {
    return this._drawer?.classList.contains('open') ?? false
  }

  // ── Renderizar sacola ─────────────────────────────────────────────────────

  renderSacola(sacola) {
    const itensEl   = document.getElementById('sacola-itens')
    const footerEl  = document.getElementById('sacola-footer')
    const restEl    = document.getElementById('sacola-rest-info')
    const totaisEl  = document.getElementById('sacola-totais')

    if (!itensEl) return

    if (!sacola || !sacola.itens?.length) {
      itensEl.innerHTML = /* html */`
        <div class="sacola-empty">
          <span class="sacola-empty__icon">🛒</span>
          <p class="sacola-empty__text">Sua sacola está vazia.<br>Adicione itens de um restaurante.</p>
        </div>
      `
      if (footerEl) footerEl.style.display = 'none'
      if (restEl)   restEl.style.display   = 'none'
      return
    }

    // Info do restaurante
    if (restEl && sacola.restaurante) {
      restEl.style.display = 'flex'
      restEl.innerHTML = `🏪 <strong>${sacola.restaurante.nome}</strong>`
    }

    // Itens
    itensEl.innerHTML = sacola.itens.map(item => /* html */`
      <div class="sacola-item" data-item-id="${item.id}">
        <div class="sacola-item__emoji">🍽️</div>
        <div class="sacola-item__info">
          <div class="sacola-item__nome">${item.nome}</div>
          ${item.observacao ? `<div class="sacola-item__obs">${item.observacao}</div>` : ''}
        </div>
        <div class="sacola-qty">
          <button class="sacola-qty__btn btn-qty-menos" data-id="${item.id}" data-qty="${item.quantidade}" aria-label="Remover um">−</button>
          <span class="sacola-qty__num">${item.quantidade}</span>
          <button class="sacola-qty__btn btn-qty-mais" data-id="${item.id}" data-qty="${item.quantidade}" aria-label="Adicionar um">+</button>
        </div>
        <div class="sacola-item__preco">R$ ${Number(item.subtotal_item).toFixed(2).replace('.', ',')}</div>
      </div>
    `).join('')

    // Totais
    if (totaisEl) {
      totaisEl.innerHTML = /* html */`
        <div class="sacola-totais__linha">
          <span>Subtotal</span>
          <span>R$ ${Number(sacola.subtotal).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="sacola-totais__linha">
          <span>Taxa de entrega</span>
          <span>${sacola.taxa_entrega > 0 ? `R$ ${Number(sacola.taxa_entrega).toFixed(2).replace('.', ',')}` : 'Grátis'}</span>
        </div>
        <div class="sacola-totais__linha sacola-totais__linha--total">
          <span>Total</span>
          <span>R$ ${Number(sacola.total).toFixed(2).replace('.', ',')}</span>
        </div>
      `
    }

    if (footerEl) footerEl.style.display = 'block'
  }

  // ── Badge de quantidade no header ─────────────────────────────────────────

  atualizarBadge(total) {
    const badge = document.getElementById('cart-badge')
    if (badge) badge.textContent = total
    // Também atualiza o botão na tela do restaurante se existir
    const rcCount = document.getElementById('sacola-count')
    if (rcCount) rcCount.textContent = total
  }

  // ── Loading itens ─────────────────────────────────────────────────────────

  setItemLoading(itemId, loading) {
    const btns = document.querySelectorAll(`[data-id="${itemId}"]`)
    btns.forEach(b => { b.disabled = loading })
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(msg, type = 'default') {
    let t = document.getElementById('sacola-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'sacola-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3000)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onFechar(h) {
    document.getElementById('btn-sacola-fechar')?.addEventListener('click', h)
    document.getElementById('sacola-overlay')?.addEventListener('click', h)
  }

  onFinalizar(h) {
    document.getElementById('btn-sacola-finalizar')?.addEventListener('click', h)
  }

  onLimpar(h) {
    document.getElementById('btn-sacola-limpar')?.addEventListener('click', h)
  }

  onQtdMenos(h) {
    document.querySelectorAll('.btn-qty-menos').forEach(btn => {
      btn.addEventListener('click', () => h(Number(btn.dataset.id), Number(btn.dataset.qty) - 1))
    })
  }

  onQtdMais(h) {
    document.querySelectorAll('.btn-qty-mais').forEach(btn => {
      btn.addEventListener('click', () => h(Number(btn.dataset.id), Number(btn.dataset.qty) + 1))
    })
  }

  // Re-bind após renderizar itens
  bindItens(onMenos, onMais) {
    this.onQtdMenos(onMenos)
    this.onQtdMais(onMais)
  }
}
