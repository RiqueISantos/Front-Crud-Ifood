/**
 * PedidoView
 *
 * Tela de confirmação do pedido — fiel ao iFood.
 * Layout: header fixo + scroll com endereço, itens, pagamento, totais.
 * Rota: #/pedido
 */

const PAGAMENTO_CONFIG = {
  PIX:      { icon: '💠', label: 'Pix', desc: 'Pagamento instantâneo' },
  CREDITO:  { icon: '💳', label: 'Crédito', desc: 'Cartão de crédito' },
  DEBITO:   { icon: '💳', label: 'Débito', desc: 'Cartão de débito' },
  DINHEIRO: { icon: '💵', label: 'Dinheiro', desc: 'Pagar na entrega' },
  VALE:     { icon: '🎟️', label: 'Vale-refeição', desc: 'VR, VA ou similar' },
}

export class PedidoView {
  constructor(container) { this._container = container }

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="pd-loading">
        <div class="pd-spinner"></div>
        <span>Carregando...</span>
      </div>
    `
  }

  render({ sacola, enderecos }) {
    const rest  = sacola.restaurante
    const itens = sacola.itens ?? []
    const taxa  = Number(sacola.taxa_entrega ?? 0)
    const sub   = Number(sacola.subtotal ?? 0)
    const total = sub + taxa

    this._container.innerHTML = /* html */`
      <div class="pd-page">

        <!-- Header -->
        <header class="pd-header">
          <button class="pd-header__back" id="btn-pd-back" aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="pd-header__title">Confirmar pedido</span>
        </header>

        <div class="pd-scroll">

          <!-- Restaurante -->
          <div class="pd-section pd-rest-info">
            <span class="pd-rest-info__emoji">🏪</span>
            <div>
              <div class="pd-rest-info__nome">${rest.nome}</div>
              <div class="pd-rest-info__tempo">${rest.tempo_estimado ?? '30–45 min'}</div>
            </div>
          </div>

          <!-- Itens -->
          <div class="pd-section">
            <div class="pd-section__title">Seu pedido</div>
            <div class="pd-itens">
              ${itens.map(item => /* html */`
                <div class="pd-item">
                  <span class="pd-item__qty">${item.quantidade}×</span>
                  <span class="pd-item__nome">${item.nome}</span>
                  ${item.observacao ? `<span class="pd-item__obs">${item.observacao}</span>` : ''}
                  <span class="pd-item__preco">R$ ${Number(item.subtotal_item).toFixed(2).replace('.', ',')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Endereço de entrega -->
          <div class="pd-section">
            <div class="pd-section__title">Endereço de entrega</div>
            ${enderecos.length === 0
              ? /* html */`
                <div class="pd-no-address">
                  <span>📍</span>
                  <p>Você não tem endereços cadastrados.</p>
                  <a href="#/enderecos" class="pd-link">Adicionar endereço</a>
                </div>`
              : /* html */`
                <div class="pd-enderecos" id="pd-enderecos">
                  ${enderecos.map(e => /* html */`
                    <label class="pd-endereco-card" data-id="${e.id}">
                      <input type="radio" name="endereco" value="${e.id}"
                        class="pd-endereco-radio" ${e === enderecos[0] ? 'checked' : ''}>
                      <div class="pd-endereco-card__body">
                        <div class="pd-endereco-card__tipo">${e.tipo_endereco ?? 'Casa'}</div>
                        <div class="pd-endereco-card__rua">${e.logradouro}, ${e.numero}${e.complemento ? ` — ${e.complemento}` : ''}</div>
                        <div class="pd-endereco-card__cidade">${e.bairro} · ${e.cidade}/${e.uf}</div>
                      </div>
                      <span class="pd-endereco-card__check">✓</span>
                    </label>
                  `).join('')}
                </div>`
            }
          </div>

          <!-- Forma de pagamento -->
          <div class="pd-section">
            <div class="pd-section__title">Forma de pagamento</div>
            <div class="pd-pagamentos" id="pd-pagamentos">
              ${Object.entries(PAGAMENTO_CONFIG).map(([key, cfg], idx) => /* html */`
                <label class="pd-pgto-card" data-key="${key}">
                  <input type="radio" name="pagamento" value="${key}"
                    class="pd-pgto-radio" ${idx === 0 ? 'checked' : ''}>
                  <span class="pd-pgto-card__icon">${cfg.icon}</span>
                  <div class="pd-pgto-card__info">
                    <div class="pd-pgto-card__label">${cfg.label}</div>
                    <div class="pd-pgto-card__desc">${cfg.desc}</div>
                  </div>
                  <span class="pd-pgto-card__check">✓</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Observação -->
          <div class="pd-section">
            <div class="pd-section__title">Observação (opcional)</div>
            <textarea id="pd-observacao" class="pd-obs-input"
              maxlength="300" rows="2"
              placeholder="Ex: deixar na portaria, campainha não funciona..."></textarea>
          </div>

          <!-- Totais -->
          <div class="pd-section pd-totais">
            <div class="pd-totais__linha">
              <span>Subtotal</span>
              <span>R$ ${sub.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="pd-totais__linha">
              <span>Taxa de entrega</span>
              <span>${taxa > 0 ? `R$ ${taxa.toFixed(2).replace('.', ',')}` : 'Grátis'}</span>
            </div>
            <div class="pd-totais__linha pd-totais__linha--total">
              <span>Total</span>
              <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <!-- Spacer para o botão fixo -->
          <div style="height: 100px"></div>
        </div>

        <!-- Botão fixo -->
        <div class="pd-footer">
          <button class="pd-btn-confirmar" id="btn-pd-confirmar">
            <span id="btn-pd-confirmar-text">Fazer pedido · R$ ${total.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>

      </div>
    `
  }

  renderSucesso(pedido) {
    const isPagOnline = pedido.url_pagamento != null
    this._container.innerHTML = /* html */`
      <div class="pd-sucesso">
        <div class="pd-sucesso__icon">🎉</div>
        <h1 class="pd-sucesso__titulo">Pedido realizado!</h1>
        <p class="pd-sucesso__id">Pedido #${pedido.id}</p>
        <div class="pd-sucesso__status">
          <span class="pd-status-badge pd-status-badge--${pedido.status.toLowerCase()}">${_labelStatus(pedido.status)}</span>
        </div>
        <div class="pd-sucesso__rest">${pedido.restaurante?.nome ?? ''}</div>

        ${isPagOnline ? /* html */`
          <a href="${pedido.url_pagamento}" target="_blank" rel="noopener" class="pd-btn-pagar">
            Pagar agora 💠
          </a>` : ''}

        <button class="pd-btn-acompanhar" id="btn-pd-acompanhar">
          Acompanhar pedido
        </button>
        <button class="pd-btn-home" id="btn-pd-home">
          Voltar ao início
        </button>
      </div>
    `
  }

  // ── Leitura ────────────────────────────────────────────────────────────────

  getEnderecoId() {
    return Number(document.querySelector('input[name="endereco"]:checked')?.value ?? 0)
  }

  getFormaPagamento() {
    return document.querySelector('input[name="pagamento"]:checked')?.value ?? 'PIX'
  }

  getObservacao() {
    return (document.getElementById('pd-observacao')?.value ?? '').trim()
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  setConfirmarLoading(v) {
    const btn  = document.getElementById('btn-pd-confirmar')
    const text = document.getElementById('btn-pd-confirmar-text')
    if (!btn) return
    btn.disabled = v
    if (text) text.textContent = v ? 'Processando...' : btn.dataset.label ?? 'Fazer pedido'
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('pd-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'pd-toast'
      t.setAttribute('role', 'status')
      t.setAttribute('aria-live', 'polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  onVoltar(h)      { document.getElementById('btn-pd-back')?.addEventListener('click', h) }
  onConfirmar(h)   { document.getElementById('btn-pd-confirmar')?.addEventListener('click', h) }
  onAcompanhar(h)  { document.getElementById('btn-pd-acompanhar')?.addEventListener('click', h) }
  onHome(h)        { document.getElementById('btn-pd-home')?.addEventListener('click', h) }
}

function _labelStatus(s) {
  const map = {
    AGUARDANDO_PAGAMENTO:   '⏳ Aguardando pagamento',
    AGUARDANDO_CONFIRMACAO: '🕐 Aguardando confirmação',
    CONFIRMADO:             '✅ Confirmado',
    EM_PREPARACAO:          '👨‍🍳 Em preparo',
    SAIU_PARA_ENTREGA:      '🛵 Saiu para entrega',
    ENTREGUE:               '🎉 Entregue',
    CANCELADO:              '❌ Cancelado',
  }
  return map[s] ?? s
}
