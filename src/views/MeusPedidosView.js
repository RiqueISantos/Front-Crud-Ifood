/**
 * MeusPedidosView
 *
 * Lista de pedidos do usuário — fiel ao iFood.
 * Cada card mostra restaurante, status com cor, itens resumidos e total.
 * Rota: #/meus-pedidos
 */

export class MeusPedidosView {
  constructor(container) { this._container = container }

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="mp-page">
        ${_buildHeader()}
        <div class="mp-loading">
          <div class="mp-spinner"></div>
          <span>Carregando pedidos...</span>
        </div>
      </div>
    `
  }

  render(pedidos) {
    this._container.innerHTML = /* html */`
      <div class="mp-page">
        ${_buildHeader()}
        <div class="mp-content">
          ${pedidos.length === 0
            ? /* html */`
              <div class="mp-empty">
                <span class="mp-empty__icon">📦</span>
                <p class="mp-empty__text">Você ainda não fez nenhum pedido.</p>
                <a href="#/home" class="mp-empty__link">Ver restaurantes</a>
              </div>`
            : pedidos.map(p => _buildCard(p)).join('')
          }
        </div>
      </div>
    `
  }

  renderDetalhe(pedido) {
    this._container.innerHTML = /* html */`
      <div class="mp-page">
        <header class="mp-header">
          <button class="mp-header__back" id="btn-mp-back-detalhe" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="mp-header__title">Pedido #${pedido.id}</span>
        </header>

        <div class="mp-content">
          <!-- Status tracker -->
          <div class="mp-tracker">
            ${_buildTracker(pedido.status)}
          </div>

          <!-- Restaurante -->
          <div class="mp-card" style="margin-bottom:12px">
            <div class="mp-card__rest">
              <span class="mp-card__rest-icon">🏪</span>
              <div>
                <div class="mp-card__rest-nome">${pedido.restaurante?.nome ?? '—'}</div>
                <div class="mp-card__data">${_formatarData(pedido.criado_em)}</div>
              </div>
            </div>
          </div>

          <!-- Itens -->
          <div class="mp-card" style="margin-bottom:12px">
            <div class="mp-card__section-title">Itens do pedido</div>
            ${pedido.itens.map(item => /* html */`
              <div class="mp-item">
                <span class="mp-item__qty">${item.quantidade}×</span>
                <span class="mp-item__nome">${item.nome_produto}</span>
                ${item.observacao ? `<span class="mp-item__obs">${item.observacao}</span>` : ''}
                <span class="mp-item__preco">R$ ${Number(item.subtotal_item).toFixed(2).replace('.', ',')}</span>
              </div>
            `).join('')}
          </div>

          <!-- Endereço -->
          ${pedido.endereco ? /* html */`
            <div class="mp-card" style="margin-bottom:12px">
              <div class="mp-card__section-title">Endereço de entrega</div>
              <div class="mp-endereco">
                <span>📍</span>
                <div>
                  <div>${pedido.endereco.logradouro}, ${pedido.endereco.numero}${pedido.endereco.complemento ? ` — ${pedido.endereco.complemento}` : ''}</div>
                  <div>${pedido.endereco.bairro} · ${pedido.endereco.cidade}/${pedido.endereco.uf}</div>
                </div>
              </div>
            </div>` : ''}

          <!-- Pagamento e totais -->
          <div class="mp-card" style="margin-bottom:12px">
            <div class="mp-card__section-title">Pagamento</div>
            <div class="mp-totais">
              <div class="mp-totais__forma">${_labelPgto(pedido.forma_pagamento)}</div>
              <div class="mp-totais__linha"><span>Subtotal</span><span>R$ ${Number(pedido.subtotal).toFixed(2).replace('.', ',')}</span></div>
              <div class="mp-totais__linha"><span>Entrega</span><span>${pedido.taxa_entrega > 0 ? `R$ ${Number(pedido.taxa_entrega).toFixed(2).replace('.', ',')}` : 'Grátis'}</span></div>
              <div class="mp-totais__linha mp-totais__linha--total"><span>Total</span><span>R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}</span></div>
            </div>
          </div>

          <!-- Pagar online -->
          ${pedido.url_pagamento && pedido.status === 'AGUARDANDO_PAGAMENTO' ? /* html */`
            <a href="${pedido.url_pagamento}" target="_blank" rel="noopener" class="mp-btn-pagar">
              Pagar agora 💠
            </a>` : ''}

          <!-- Cancelar -->
          ${['AGUARDANDO_PAGAMENTO','AGUARDANDO_CONFIRMACAO','CONFIRMADO'].includes(pedido.status) ? /* html */`
            <button class="mp-btn-cancelar" id="btn-mp-cancelar" data-id="${pedido.id}">
              Cancelar pedido
            </button>` : ''}
        </div>
      </div>
    `
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  setCancelLoading(v) {
    const btn = document.getElementById('btn-mp-cancelar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Cancelando...' : 'Cancelar pedido'
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('mp-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'mp-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  onVoltar(h)      { document.getElementById('btn-mp-back')?.addEventListener('click', h) }
  onVoltarDetalhe(h) { document.getElementById('btn-mp-back-detalhe')?.addEventListener('click', h) }

  onVerPedido(h) {
    document.querySelectorAll('.mp-card[data-pedido-id]').forEach(card => {
      card.addEventListener('click', () => h(Number(card.dataset.pedidoId)))
    })
  }

  onCancelar(h) {
    document.getElementById('btn-mp-cancelar')?.addEventListener('click', e => {
      h(Number(e.currentTarget.dataset.id))
    })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _buildHeader() {
  return /* html */`
    <header class="mp-header">
      <button class="mp-header__back" id="btn-mp-back" aria-label="Voltar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="mp-header__title">Meus pedidos</span>
    </header>
  `
}

function _buildCard(p) {
  const primeiros = p.itens.slice(0, 2).map(i => i.nome_produto).join(', ')
  const resto     = p.itens.length > 2 ? ` e mais ${p.itens.length - 2}` : ''
  return /* html */`
    <div class="mp-card" data-pedido-id="${p.id}" role="button" tabindex="0">
      <div class="mp-card__top">
        <div class="mp-card__rest">
          <span class="mp-card__rest-icon">🏪</span>
          <div>
            <div class="mp-card__rest-nome">${p.restaurante?.nome ?? '—'}</div>
            <div class="mp-card__data">${_formatarData(p.criado_em)}</div>
          </div>
        </div>
        <span class="mp-status-badge mp-status-badge--${p.status.toLowerCase()}">${_labelStatus(p.status)}</span>
      </div>
      <div class="mp-card__itens">${primeiros}${resto}</div>
      <div class="mp-card__bottom">
        <span class="mp-card__total">R$ ${Number(p.total).toFixed(2).replace('.', ',')}</span>
        <span class="mp-card__arrow">→</span>
      </div>
    </div>
  `
}

function _buildTracker(status) {
  const steps = [
    { key: 'AGUARDANDO_CONFIRMACAO', label: 'Confirmação', icon: '🕐' },
    { key: 'CONFIRMADO',             label: 'Confirmado',  icon: '✅' },
    { key: 'EM_PREPARACAO',          label: 'Em preparo',  icon: '👨‍🍳' },
    { key: 'SAIU_PARA_ENTREGA',      label: 'A caminho',   icon: '🛵' },
    { key: 'ENTREGUE',               label: 'Entregue',    icon: '🎉' },
  ]
  const order = steps.map(s => s.key)
  const idx   = order.indexOf(status)
  if (status === 'CANCELADO') {
    return `<div class="mp-tracker__cancelado">❌ Pedido cancelado</div>`
  }
  if (status === 'AGUARDANDO_PAGAMENTO') {
    return `<div class="mp-tracker__cancelado">⏳ Aguardando pagamento</div>`
  }
  return /* html */`
    <div class="mp-tracker__steps">
      ${steps.map((s, i) => /* html */`
        <div class="mp-tracker__step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}">
          <div class="mp-tracker__step-icon">${s.icon}</div>
          <div class="mp-tracker__step-label">${s.label}</div>
        </div>
        ${i < steps.length - 1 ? `<div class="mp-tracker__line ${i < idx ? 'done' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `
}

function _labelStatus(s) {
  const map = {
    AGUARDANDO_PAGAMENTO:   '⏳ Pag. pendente',
    AGUARDANDO_CONFIRMACAO: '🕐 Aguardando',
    CONFIRMADO:             '✅ Confirmado',
    EM_PREPARACAO:          '👨‍🍳 Em preparo',
    SAIU_PARA_ENTREGA:      '🛵 A caminho',
    ENTREGUE:               '🎉 Entregue',
    CANCELADO:              '❌ Cancelado',
  }
  return map[s] ?? s
}

function _labelPgto(p) {
  const map = { CREDITO: '💳 Crédito', DEBITO: '💳 Débito', PIX: '💠 Pix', DINHEIRO: '💵 Dinheiro', VALE: '🎟️ Vale' }
  return map[p] ?? p
}

function _formatarData(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
