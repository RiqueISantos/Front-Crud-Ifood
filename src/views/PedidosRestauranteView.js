/**
 * PedidosRestauranteView
 *
 * Painel de pedidos do restaurante — fiel ao iFood parceiros.
 * Colunas kanban: Novos | Em preparo | A caminho | Entregues
 * Rota: #/restaurante/pedidos
 */

const COLS = [
  { key: 'AGUARDANDO_CONFIRMACAO', label: '🆕 Novos',      color: '#ff6b00' },
  { key: 'CONFIRMADO',             label: '✅ Confirmados', color: '#1565c0' },
  { key: 'EM_PREPARACAO',          label: '👨‍🍳 Em preparo',  color: '#6a1b9a' },
  { key: 'SAIU_PARA_ENTREGA',      label: '🛵 A caminho',   color: '#00838f' },
  { key: 'ENTREGUE',               label: '🎉 Entregues',   color: '#2e7d32' },
]

export class PedidosRestauranteView {
  constructor(container) { this._container = container }

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="pr-page">
        ${_buildHeader()}
        <div class="pr-loading">
          <div class="pr-spinner"></div>
          <span>Carregando pedidos...</span>
        </div>
      </div>
    `
  }

  render(pedidos) {
    // Agrupa por status
    const grupos = {}
    COLS.forEach(c => { grupos[c.key] = [] })
    pedidos.forEach(p => {
      if (grupos[p.status] !== undefined) grupos[p.status].push(p)
    })

    // Pedidos especiais (aguardando pagamento / cancelados)
    const aguardandoPgto = pedidos.filter(p => p.status === 'AGUARDANDO_PAGAMENTO')
    const cancelados     = pedidos.filter(p => p.status === 'CANCELADO')

    this._container.innerHTML = /* html */`
      <div class="pr-page">
        ${_buildHeader()}

        <div class="pr-content">

          <!-- Alertas rápidos -->
          ${aguardandoPgto.length ? /* html */`
            <div class="pr-alert">
              ⏳ ${aguardandoPgto.length} pedido(s) aguardando pagamento
            </div>` : ''}

          <!-- Kanban -->
          <div class="pr-kanban" id="pr-kanban">
            ${COLS.map(col => /* html */`
              <div class="pr-col">
                <div class="pr-col__header" style="border-color:${col.color}">
                  <span>${col.label}</span>
                  <span class="pr-col__count">${grupos[col.key].length}</span>
                </div>
                <div class="pr-col__cards" id="pr-col-${col.key}">
                  ${grupos[col.key].length === 0
                    ? `<div class="pr-col__empty">Nenhum pedido</div>`
                    : grupos[col.key].map(p => _buildCard(p, col.key)).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Cancelados (collapsible) -->
          ${cancelados.length ? /* html */`
            <details class="pr-cancelados">
              <summary>❌ Cancelados hoje (${cancelados.length})</summary>
              <div class="pr-cancelados__lista">
                ${cancelados.map(p => _buildCard(p, 'CANCELADO')).join('')}
              </div>
            </details>` : ''}

        </div>
      </div>
    `
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  setAvancarLoading(pedidoId, v) {
    const btn = document.getElementById(`btn-pr-avancar-${pedidoId}`)
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? '...' : _labelAvancar(btn.dataset.status)
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('pr-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'pr-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  onVoltar(h) { document.getElementById('btn-pr-back')?.addEventListener('click', h) }

  onAvancar(h) {
    document.querySelectorAll('.btn-pr-avancar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation()
        h(Number(btn.dataset.id))
      })
    })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _buildHeader() {
  return /* html */`
    <header class="pr-header">
      <button class="pr-header__back" id="btn-pr-back" aria-label="Voltar ao dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="pr-header__title">Pedidos</span>
      <button class="pr-header__refresh" id="btn-pr-refresh" aria-label="Atualizar">🔄</button>
    </header>
  `
}

function _buildCard(p, colKey) {
  const podAvancar = !['ENTREGUE','CANCELADO','AGUARDANDO_PAGAMENTO'].includes(colKey)
  const primeiros  = p.itens.slice(0, 2).map(i => `${i.quantidade}× ${i.nome_produto}`).join(', ')
  const resto      = p.itens.length > 2 ? ` +${p.itens.length - 2}` : ''
  return /* html */`
    <div class="pr-card">
      <div class="pr-card__top">
        <span class="pr-card__id">#${p.id}</span>
        <span class="pr-card__hora">${_hora(p.criado_em)}</span>
      </div>
      <div class="pr-card__cliente">
        <span>👤</span>
        <span>Pedido #${p.id}</span>
      </div>
      <div class="pr-card__itens">${primeiros}${resto}</div>
      <div class="pr-card__total">R$ ${Number(p.total).toFixed(2).replace('.', ',')}</div>
      ${p.observacao ? `<div class="pr-card__obs">📝 ${p.observacao}</div>` : ''}
      ${podAvancar ? /* html */`
        <button class="btn-pr-avancar pr-card__btn"
          id="btn-pr-avancar-${p.id}"
          data-id="${p.id}"
          data-status="${p.status}">
          ${_labelAvancar(p.status)}
        </button>` : ''}
    </div>
  `
}

function _labelAvancar(status) {
  const map = {
    AGUARDANDO_CONFIRMACAO: 'Confirmar pedido',
    CONFIRMADO:             'Iniciar preparo',
    EM_PREPARACAO:          'Enviar para entrega',
    SAIU_PARA_ENTREGA:      'Marcar entregue',
  }
  return map[status] ?? 'Avançar'
}

function _hora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
