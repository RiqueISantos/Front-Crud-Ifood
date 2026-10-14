/**
 * AcompanhamentoView
 *
 * Tela de acompanhamento do pedido em tempo real.
 * Animação de moto em loop percorrendo rota simulada no mapa SVG.
 * Rota: #/acompanhar/:id
 */

export class AcompanhamentoView {
  constructor(container) {
    this._container = container
    this._animFrame = null
    this._progress  = 0
    this._direction = 1
  }

  render(pedido) {
    const status    = pedido.status
    const rest      = pedido.restaurante?.nome ?? 'Restaurante'
    const end       = pedido.endereco
    const endStr    = end ? `${end.logradouro}, ${end.numero} — ${end.bairro}` : 'Seu endereço'
    const total     = `R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}`
    const isCancelado = status === 'CANCELADO'
    const isEntregue  = status === 'ENTREGUE'

    this._container.innerHTML = /* html */`
      <div class="ac-page">

        <!-- Header -->
        <header class="ac-header">
          <button class="ac-header__back" id="btn-ac-back" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="ac-header__title">Pedido #${pedido.id}</span>
          <span class="ac-header__total">${total}</span>
        </header>

        <!-- Mapa animado -->
        <div class="ac-map" id="ac-map">
          ${isCancelado ? _buildCancelado() : isEntregue ? _buildEntregue() : _buildMapa(rest, endStr)}
        </div>

        <!-- Status tracker -->
        <div class="ac-tracker">
          ${_buildTracker(status)}
        </div>

        <!-- Info do pedido -->
        <div class="ac-info">
          <div class="ac-info__rest">
            <span class="ac-info__icon">🏪</span>
            <div>
              <div class="ac-info__label">Restaurante</div>
              <div class="ac-info__value">${rest}</div>
            </div>
          </div>
          <div class="ac-info__end">
            <span class="ac-info__icon">📍</span>
            <div>
              <div class="ac-info__label">Entrega em</div>
              <div class="ac-info__value">${endStr}</div>
            </div>
          </div>
          <div class="ac-info__pgto">
            <span class="ac-info__icon">${_iconPgto(pedido.forma_pagamento)}</span>
            <div>
              <div class="ac-info__label">Pagamento</div>
              <div class="ac-info__value">${_labelPgto(pedido.forma_pagamento)}</div>
            </div>
          </div>
        </div>

        <!-- Itens resumidos -->
        <div class="ac-itens">
          ${pedido.itens.slice(0, 3).map(i => /* html */`
            <div class="ac-item">
              <span class="ac-item__qty">${i.quantidade}×</span>
              <span class="ac-item__nome">${i.nome_produto}</span>
              <span class="ac-item__preco">R$ ${Number(i.subtotal_item).toFixed(2).replace('.', ',')}</span>
            </div>
          `).join('')}
          ${pedido.itens.length > 3 ? `<div class="ac-item ac-item--more">+ ${pedido.itens.length - 3} item(s)</div>` : ''}
        </div>

      </div>
    `

    if (!isCancelado && !isEntregue) {
      this._startAnimation()
    }
  }

  updateStatus(status) {
    const trackerEl = this._container.querySelector('.ac-tracker')
    if (trackerEl) trackerEl.innerHTML = _buildTracker(status)

    if (status === 'ENTREGUE' || status === 'CANCELADO') {
      this._stopAnimation()
      const mapEl = document.getElementById('ac-map')
      if (mapEl) {
        mapEl.innerHTML = status === 'ENTREGUE' ? _buildEntregue() : _buildCancelado()
      }
    }
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('ac-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'ac-toast'
      t.setAttribute('role', 'status')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  onVoltar(h) { document.getElementById('btn-ac-back')?.addEventListener('click', h) }

  destroy() { this._stopAnimation() }

  // ── Animação da moto ──────────────────────────────────────────────────────

  _startAnimation() {
    this._progress  = 0
    this._direction = 1
    const moto      = document.getElementById('ac-moto')
    const path      = document.getElementById('ac-path')
    if (!moto || !path) return

    const totalLen = path.getTotalLength?.() ?? 300

    const animate = () => {
      this._progress += this._direction * 0.4
      if (this._progress >= 100) { this._progress = 100; this._direction = -1 }
      if (this._progress <= 0)   { this._progress = 0;   this._direction =  1 }

      const pt = path.getPointAtLength?.((this._progress / 100) * totalLen)
      if (pt && moto) {
        moto.setAttribute('transform', `translate(${pt.x - 12}, ${pt.y - 12})`)
        // Vira a moto dependendo da direção
        const scale = this._direction > 0 ? '1,1' : '-1,1'
        moto.setAttribute('transform',
          `translate(${pt.x - 12}, ${pt.y - 12}) scale(${scale})`)
      }

      this._animFrame = requestAnimationFrame(animate)
    }

    this._animFrame = requestAnimationFrame(animate)
  }

  _stopAnimation() {
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame)
      this._animFrame = null
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Helpers exportados (usados também no MeusPedidosView) ────────────────────

export function buildMapaAnimado(rest, endStr) {
  return _buildMapa(rest, endStr)
}

export function buildTrackerAc(status) {
  return _buildTracker(status)
}

function _buildMapa(rest, endStr) {
  return /* html */`
    <div class="ac-map__inner">
      <svg class="ac-map__svg" viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg">
        <!-- Fundo estilo mapa -->
        <rect width="380" height="220" fill="#e8f0e8"/>

        <!-- Blocos de quadras simulados -->
        <rect x="20"  y="20"  width="60" height="40" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="100" y="15"  width="80" height="50" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="200" y="20"  width="70" height="35" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="290" y="15"  width="70" height="45" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="20"  y="130" width="50" height="60" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="90"  y="140" width="90" height="50" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="200" y="130" width="60" height="55" rx="4" fill="#c8d8c8" opacity=".6"/>
        <rect x="280" y="140" width="80" height="50" rx="4" fill="#c8d8c8" opacity=".6"/>

        <!-- Ruas -->
        <rect x="0"   y="80"  width="380" height="18" fill="#fff" opacity=".9"/>
        <rect x="80"  y="0"   width="18"  height="220" fill="#fff" opacity=".9"/>
        <rect x="180" y="0"   width="18"  height="220" fill="#fff" opacity=".9"/>
        <rect x="270" y="0"   width="18"  height="220" fill="#fff" opacity=".9"/>
        <rect x="0"   y="120" width="380" height="18"  fill="#fff" opacity=".9"/>

        <!-- Linhas tracejadas das ruas -->
        <line x1="0" y1="89" x2="380" y2="89" stroke="#ddd" stroke-width="1" stroke-dasharray="8,6"/>
        <line x1="89" y1="0" x2="89" y2="220" stroke="#ddd" stroke-width="1" stroke-dasharray="8,6"/>
        <line x1="189" y1="0" x2="189" y2="220" stroke="#ddd" stroke-width="1" stroke-dasharray="8,6"/>
        <line x1="279" y1="0" x2="279" y2="220" stroke="#ddd" stroke-width="1" stroke-dasharray="8,6"/>
        <line x1="0" y1="129" x2="380" y2="129" stroke="#ddd" stroke-width="1" stroke-dasharray="8,6"/>

        <!-- Rota destacada -->
        <path id="ac-path"
          d="M 50,89 L 89,89 L 89,50 L 189,50 L 189,89 L 279,89 L 279,129 L 340,129"
          fill="none" stroke="#ea1d2c" stroke-width="4"
          stroke-dasharray="8,4" stroke-linecap="round"
          opacity=".85"/>

        <!-- Ponto de origem (restaurante) -->
        <circle cx="50" cy="89" r="10" fill="#ea1d2c"/>
        <text x="50" y="93" text-anchor="middle" font-size="10" fill="white">🏪</text>

        <!-- Ponto de destino (casa) -->
        <circle cx="340" cy="129" r="10" fill="#1565c0"/>
        <text x="340" y="133" text-anchor="middle" font-size="10" fill="white">📍</text>

        <!-- Moto animada -->
        <g id="ac-moto" transform="translate(38, 77)">
          <text font-size="20">🛵</text>
        </g>
      </svg>

      <!-- Labels do mapa -->
      <div class="ac-map__from">🏪 ${rest}</div>
      <div class="ac-map__to">📍 ${endStr}</div>
    </div>
  `
}

function _buildEntregue() {
  return /* html */`
    <div class="ac-map__entregue">
      <div class="ac-map__entregue-icon">🎉</div>
      <div class="ac-map__entregue-text">Pedido entregue!</div>
    </div>
  `
}

function _buildCancelado() {
  return /* html */`
    <div class="ac-map__cancelado">
      <div class="ac-map__cancelado-icon">❌</div>
      <div class="ac-map__cancelado-text">Pedido cancelado</div>
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
    return `<div class="ac-tracker__cancelado">❌ Pedido cancelado</div>`
  }
  if (status === 'AGUARDANDO_PAGAMENTO') {
    return `<div class="ac-tracker__cancelado" style="color:#e65100">⏳ Aguardando pagamento</div>`
  }

  return /* html */`
    <div class="ac-tracker__steps">
      ${steps.map((s, i) => /* html */`
        <div class="ac-tracker__step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}">
          <div class="ac-tracker__step-dot">${i <= idx ? s.icon : '○'}</div>
          <div class="ac-tracker__step-label">${s.label}</div>
        </div>
        ${i < steps.length - 1 ? `<div class="ac-tracker__line ${i < idx ? 'done' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `
}

function _labelPgto(p) {
  const map = { CREDITO: 'Crédito', DEBITO: 'Débito', PIX: 'Pix', DINHEIRO: 'Dinheiro', VALE: 'Vale-refeição' }
  return map[p] ?? p
}

function _iconPgto(p) {
  const map = { CREDITO: '💳', DEBITO: '💳', PIX: '💠', DINHEIRO: '💵', VALE: '🎟️' }
  return map[p] ?? '💳'
}
