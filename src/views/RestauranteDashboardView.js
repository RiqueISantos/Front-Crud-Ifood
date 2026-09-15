/**
 * RestauranteDashboardView
 *
 * Portal do Parceiro iFood — tela principal pós-login do restaurante.
 * Layout: sidebar fixa + header + conteúdo com métricas, dados e ações rápidas.
 */

export class RestauranteDashboardView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  // ── Skeleton de loading ───────────────────────────────────────────────────

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="rdash-loading">
        <div class="rdash-loading__spinner"></div>
        <span class="rdash-loading__text">Carregando seu painel...</span>
      </div>
    `
  }

  // ── Render principal ──────────────────────────────────────────────────────

  render(rest) {
    const inicial = (rest.nome ?? 'R').charAt(0).toUpperCase()
    const endereco = this._formatarEndereco(rest)
    const taxaEntrega = rest.taxa_entrega != null
      ? `R$ ${Number(rest.taxa_entrega).toFixed(2).replace('.', ',')}`
      : 'Grátis'
    const tempo = rest.tempo_estimado || 'Não informado'
    const criadoEm = rest.criado_em
      ? new Date(rest.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
      : '—'

    this._container.innerHTML = /* html */`
      <div class="rdash-root">

        <!-- ════════════════════════════════════
             SIDEBAR
             ════════════════════════════════════ -->
        <aside class="rdash-sidebar" role="navigation" aria-label="Menu do parceiro">

          <!-- Logo -->
          <a href="#/restaurante" class="rdash-sidebar__logo" aria-label="iFood para restaurantes">
            <span class="rdash-sidebar__logo-text">iFood</span>
            <span class="rdash-sidebar__logo-sub">para restaurantes</span>
          </a>

          <!-- Info do restaurante -->
          <div class="rdash-sidebar__rest">
            <div class="rdash-sidebar__rest-avatar" aria-hidden="true">${inicial}</div>
            <div class="rdash-sidebar__rest-info">
              <div class="rdash-sidebar__rest-name">${rest.nome}</div>
              <div class="rdash-sidebar__rest-cat">${rest.categoria_principal}</div>
              <div>
                <span class="rdash-status-badge rdash-status-badge--aberto" id="sidebar-status-badge">
                  <span class="rdash-status-badge__dot"></span>
                  Aberto
                </span>
              </div>
            </div>
          </div>

          <!-- Navegação -->
          <nav class="rdash-sidebar__nav">
            <div class="rdash-nav-section">Principal</div>

            <button class="rdash-nav-item rdash-nav-item--active" id="nav-visao-geral" aria-current="page">
              <span class="rdash-nav-item__icon" aria-hidden="true">🏠</span>
              Visão geral
            </button>

            <button class="rdash-nav-item" id="nav-pedidos">
              <span class="rdash-nav-item__icon" aria-hidden="true">📋</span>
              Pedidos
            </button>

            <button class="rdash-nav-item" id="nav-cardapio">
              <span class="rdash-nav-item__icon" aria-hidden="true">🍽️</span>
              Cardápio
            </button>

            <div class="rdash-nav-section">Configurações</div>

            <button class="rdash-nav-item" id="nav-minha-loja">
              <span class="rdash-nav-item__icon" aria-hidden="true">🏪</span>
              Minha loja
            </button>
            <button class="rdash-nav-item" id="nav-financeiro">
              <span class="rdash-nav-item__icon" aria-hidden="true">💳</span>
              Financeiro
            </button>

            <button class="rdash-nav-item" id="nav-avaliacoes">
              <span class="rdash-nav-item__icon" aria-hidden="true">⭐</span>
              Avaliações
            </button>
          </nav>

          <!-- Logout -->
          <div class="rdash-sidebar__footer">
            <button class="rdash-logout-btn" id="btn-rdash-logout">
              <span aria-hidden="true">🚪</span>
              Sair da conta
            </button>
          </div>

        </aside>

        <!-- ════════════════════════════════════
             MAIN
             ════════════════════════════════════ -->
        <div class="rdash-main">

          <!-- Header -->
          <header class="rdash-header">
            <h1 class="rdash-header__title" id="rdash-page-title">Visão geral</h1>
            <div class="rdash-header__actions">
              <span class="rdash-header__greeting">
                Olá, <strong>${rest.nome}</strong> 👋
              </span>
            </div>
          </header>

          <!-- Conteúdo -->
          <main class="rdash-content" id="rdash-page-content">

            <!-- Banner de boas-vindas -->
            <div class="rdash-welcome-banner">
              <div class="rdash-welcome-banner__text">
                <h2>Bem-vindo ao seu painel! 🎉</h2>
                <p>Gerencie seu restaurante e acompanhe sua operação em tempo real.</p>
              </div>
            </div>

            <!-- Toggle status da loja -->
            <div class="rdash-store-status">
              <div class="rdash-store-status__info">
                <h3>Status da loja</h3>
                <p>Controle se seu restaurante está recebendo pedidos agora</p>
              </div>
              <label class="rdash-toggle" aria-label="Loja aberta para pedidos">
                <input type="checkbox" id="toggle-loja-aberta" checked>
                <span class="rdash-toggle__slider"></span>
              </label>
            </div>

            <!-- Cards de métricas -->
            <div class="rdash-metrics-grid">
              <div class="rdash-metric-card">
                <div class="rdash-metric-card__header">
                  <span class="rdash-metric-card__label">Pedidos hoje</span>
                  <span class="rdash-metric-card__icon rdash-metric-card__icon--red" aria-hidden="true">📦</span>
                </div>
                <div class="rdash-metric-card__value">0</div>
                <div class="rdash-metric-card__sub">Nenhum pedido ainda hoje</div>
              </div>

              <div class="rdash-metric-card">
                <div class="rdash-metric-card__header">
                  <span class="rdash-metric-card__label">Faturamento hoje</span>
                  <span class="rdash-metric-card__icon rdash-metric-card__icon--green" aria-hidden="true">💰</span>
                </div>
                <div class="rdash-metric-card__value">R$ 0,00</div>
                <div class="rdash-metric-card__sub">Atualizado em tempo real</div>
              </div>

              <div class="rdash-metric-card">
                <div class="rdash-metric-card__header">
                  <span class="rdash-metric-card__label">Avaliação média</span>
                  <span class="rdash-metric-card__icon rdash-metric-card__icon--orange" aria-hidden="true">⭐</span>
                </div>
                <div class="rdash-metric-card__value">—</div>
                <div class="rdash-metric-card__sub">Sem avaliações ainda</div>
              </div>

              <div class="rdash-metric-card">
                <div class="rdash-metric-card__header">
                  <span class="rdash-metric-card__label">Tempo médio</span>
                  <span class="rdash-metric-card__icon rdash-metric-card__icon--blue" aria-hidden="true">⏱️</span>
                </div>
                <div class="rdash-metric-card__value">${tempo}</div>
                <div class="rdash-metric-card__sub">Estimativa de entrega</div>
              </div>
            </div>

            <!-- Ações rápidas -->
            <div class="rdash-actions-grid">
              <button class="rdash-action-btn" id="btn-action-cardapio">
                <span class="rdash-action-btn__icon" aria-hidden="true">🍕</span>
                <span class="rdash-action-btn__label">Gerenciar Cardápio</span>
              </button>
              <button class="rdash-action-btn" id="btn-action-horario">
                <span class="rdash-action-btn__icon" aria-hidden="true">🕐</span>
                <span class="rdash-action-btn__label">Horários de Funcionamento</span>
              </button>
              <button class="rdash-action-btn" id="btn-action-perfil">
                <span class="rdash-action-btn__icon" aria-hidden="true">✏️</span>
                <span class="rdash-action-btn__label">Editar Perfil</span>
              </button>
              <button class="rdash-action-btn" id="btn-action-promocao">
                <span class="rdash-action-btn__icon" aria-hidden="true">🎯</span>
                <span class="rdash-action-btn__label">Criar Promoção</span>
              </button>
              <button class="rdash-action-btn" id="btn-action-relatorio">
                <span class="rdash-action-btn__icon" aria-hidden="true">📊</span>
                <span class="rdash-action-btn__label">Relatórios</span>
              </button>
              <button class="rdash-action-btn" id="btn-action-suporte">
                <span class="rdash-action-btn__icon" aria-hidden="true">🎧</span>
                <span class="rdash-action-btn__label">Suporte iFood</span>
              </button>
            </div>

            <!-- Linha: Dados do restaurante + Endereço -->
            <div class="rdash-two-col">

              <!-- Card: Dados do restaurante -->
              <div class="rdash-card">
                <div class="rdash-card__header">
                  <span class="rdash-card__title">Dados do restaurante</span>
                  <span class="rdash-card__badge">ID #${rest.id}</span>
                </div>
                <div class="rdash-card__body">
                  <ul class="rdash-info-list" role="list">
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Nome</span>
                      <span class="rdash-info-item__value">${rest.nome}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">E-mail</span>
                      <span class="rdash-info-item__value">${rest.email}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Telefone</span>
                      <span class="rdash-info-item__value">${rest.telefone}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Categoria</span>
                      <span class="rdash-info-item__value">${rest.categoria_principal}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Taxa de entrega</span>
                      <span class="rdash-info-item__value">${taxaEntrega}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Tempo estimado</span>
                      <span class="rdash-info-item__value">${tempo}</span>
                    </li>
                    <li class="rdash-info-item">
                      <span class="rdash-info-item__label">Parceiro desde</span>
                      <span class="rdash-info-item__value">${criadoEm}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Card: Endereço -->
              <div class="rdash-card">
                <div class="rdash-card__header">
                  <span class="rdash-card__title">Endereço</span>
                </div>
                <div class="rdash-card__body">
                  <div class="rdash-address-block">
                    <span class="rdash-address-block__pin" aria-hidden="true">📍</span>
                    <div class="rdash-address-block__text">
                      ${endereco}
                    </div>
                  </div>
                  ${rest.latitude && rest.longitude ? /* html */`
                    <div style="margin-top:16px;border-radius:10px;overflow:hidden;height:160px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;">
                      <a
                        href="https://www.google.com/maps?q=${rest.latitude},${rest.longitude}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:#616161;font-size:0.82rem;font-weight:600;"
                      >
                        <span style="font-size:2rem">🗺️</span>
                        Ver no Google Maps
                      </a>
                    </div>
                  ` : ''}
                </div>
              </div>

            </div>

            <!-- Pedidos recentes -->
            <div class="rdash-card" style="margin-bottom:28px">
              <div class="rdash-card__header">
                <span class="rdash-card__title">Pedidos recentes</span>
                <span class="rdash-card__badge">Hoje</span>
              </div>
              <div class="rdash-card__body">
                <div class="rdash-empty-state">
                  <span class="rdash-empty-state__icon" aria-hidden="true">📭</span>
                  <p class="rdash-empty-state__text">
                    Nenhum pedido ainda.<br>
                    Quando chegarem, eles aparecerão aqui.
                  </p>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    `

    this._bindToggle()
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _formatarEndereco(rest) {
    const partes = [
      rest.logradouro,
      rest.numero ? `nº ${rest.numero}` : null,
      rest.complemento || null,
      rest.bairro,
    ].filter(Boolean)

    const linha1 = partes.join(', ')
    const linha2 = [rest.cidade, rest.uf].filter(Boolean).join(' — ')
    const linha3 = rest.cep ? `CEP: ${rest.cep}` : ''

    return [linha1, linha2, linha3].filter(Boolean).join('<br>')
  }

  _bindToggle() {
    const toggle = document.getElementById('toggle-loja-aberta')
    const badge  = document.getElementById('sidebar-status-badge')
    if (!toggle || !badge) return

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        badge.className = 'rdash-status-badge rdash-status-badge--aberto'
        badge.innerHTML = '<span class="rdash-status-badge__dot"></span>Aberto'
      } else {
        badge.className = 'rdash-status-badge rdash-status-badge--fechado'
        badge.innerHTML = '<span class="rdash-status-badge__dot"></span>Fechado'
      }
    })
  }

  // ── Eventos públicos ──────────────────────────────────────────────────────

  onLogout(handler) {
    document.getElementById('btn-rdash-logout')?.addEventListener('click', handler)
  }

  onMinhaLoja(handler) {
    document.getElementById('nav-minha-loja')?.addEventListener('click', handler)
  }

  onEditarPerfil(handler) {
    document.getElementById('btn-action-perfil')?.addEventListener('click', handler)
  }

  showToast(message, type = 'default') {
    let toast = document.getElementById('rdash-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'rdash-toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }
}
