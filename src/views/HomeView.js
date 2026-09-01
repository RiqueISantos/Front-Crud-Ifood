/**
 * HomeView
 * Renderiza a tela principal do iFood após o login.
 */

import { categories, banners, restaurants } from '../models/HomeModel.js'

// ── Builders de seções ─────────────────────────────────────────────────────

function buildHeader(userName) {
  return /* html */`
    <header class="home-header">
      <div class="home-header__inner">

        <!-- Logo -->
        <a href="#" class="home-header__logo" aria-label="iFood">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#EA1D2C"/>
            <path d="M20 8C13.37 8 8 13.37 8 20s5.37 12 12 12 12-5.37 12-12S26.63 8 20 8zm-2 16h-3V16h3v8zm7 0h-3V16h3v8z" fill="white"/>
          </svg>
          <span>iFood</span>
        </a>

        <!-- Barra de endereço -->
        <button class="home-header__address" id="address-btn" aria-label="Alterar endereço de entrega">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <div class="home-header__address-text">
            <span class="home-header__address-label">Entregar em</span>
            <span class="home-header__address-value">Rua das Flores, 123 <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
          </div>
        </button>

        <!-- Ações do header -->
        <nav class="home-header__actions">
          <button class="home-header__action-btn" id="cart-btn" aria-label="Carrinho de compras">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="home-header__cart-badge" id="cart-badge" aria-label="0 itens">0</span>
          </button>

          <div class="home-header__user" id="user-menu-btn" role="button" tabindex="0" aria-label="Menu do usuário" aria-haspopup="true">
            <div class="home-header__avatar" aria-hidden="true">
              ${userName.charAt(0).toUpperCase()}
            </div>
            <span class="home-header__user-name">${userName}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>

            <!-- Dropdown -->
            <div class="user-dropdown" id="user-dropdown" role="menu" aria-hidden="true">
              <div class="user-dropdown__header">
                <div class="user-dropdown__avatar">${userName.charAt(0).toUpperCase()}</div>
                <div>
                  <p class="user-dropdown__name">${userName}</p>
                  <p class="user-dropdown__label">Minha conta</p>
                </div>
              </div>
              <ul class="user-dropdown__list">
                <li role="menuitem"><a href="#">Meus pedidos</a></li>
                <li role="menuitem"><a href="#">Favoritos</a></li>
                <li role="menuitem"><a href="#">Endereços</a></li>
                <li role="menuitem"><a href="#">iFood Pay</a></li>
                <li role="menuitem" class="user-dropdown__divider"><a href="#" id="logout-btn">Sair</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <!-- Barra de busca -->
      <div class="home-search-bar">
        <div class="home-search-bar__inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            id="search-input"
            class="home-search-bar__input"
            placeholder="Busque por item ou loja"
            autocomplete="off"
            aria-label="Buscar restaurantes ou pratos"
          />
        </div>
      </div>
    </header>
  `
}

function buildBanners() {
  const items = banners.map(b => /* html */`
    <div class="banner-slide" style="background:${b.bg}" role="listitem">
      <div class="banner-slide__content">
        <span class="banner-slide__badge">${b.badge}</span>
        <h2 class="banner-slide__title">${b.title}</h2>
        <p class="banner-slide__sub">${b.sub}</p>
      </div>
      <span class="banner-slide__emoji" aria-hidden="true">${b.emoji}</span>
    </div>
  `).join('')

  return /* html */`
    <section class="home-banners" aria-label="Promoções em destaque">
      <div class="home-banners__track" id="banners-track" role="list">
        ${items}
      </div>
      <div class="home-banners__dots" id="banner-dots" aria-label="Navegar pelos banners">
        ${banners.map((_, i) => `<button class="banner-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Banner ${i+1}"></button>`).join('')}
      </div>
    </section>
  `
}

function buildCategories() {
  const items = categories.map(c => /* html */`
    <button class="category-chip" data-category="${c.label}" aria-label="Ver ${c.label}">
      <span class="category-chip__icon" aria-hidden="true">${c.icon}</span>
      <span class="category-chip__label">${c.label}</span>
    </button>
  `).join('')

  return /* html */`
    <section class="home-categories" aria-label="Categorias">
      <div class="home-categories__track">
        ${items}
      </div>
    </section>
  `
}

function buildRestaurants(list, title = 'Restaurantes perto de você') {
  const cards = list.map(r => /* html */`
    <article class="restaurant-card" data-id="${r.id}" role="button" tabindex="0" aria-label="${r.name}">
      <div class="restaurant-card__thumb" style="background:${r.bg}">
        <span class="restaurant-card__emoji" aria-hidden="true">${r.emoji}</span>
        ${r.tag ? `<span class="restaurant-card__tag">${r.tag}</span>` : ''}
      </div>
      <div class="restaurant-card__info">
        <h3 class="restaurant-card__name">${r.name}</h3>
        <p class="restaurant-card__category">${r.category}</p>
        <div class="restaurant-card__meta">
          <span class="restaurant-card__rating">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#FA8C00"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${r.rating}
          </span>
          <span class="restaurant-card__dot" aria-hidden="true">·</span>
          <span class="restaurant-card__time">${r.time}</span>
          <span class="restaurant-card__dot" aria-hidden="true">·</span>
          <span class="restaurant-card__fee ${r.fee === 'Grátis' ? 'free' : ''}">${r.fee}</span>
        </div>
      </div>
    </article>
  `).join('')

  return /* html */`
    <section class="home-restaurants" aria-label="${title}">
      <div class="home-restaurants__header">
        <h2 class="home-restaurants__title">${title}</h2>
        <button class="home-restaurants__see-all" aria-label="Ver todos os restaurantes">Ver todos</button>
      </div>
      <div class="home-restaurants__grid" id="restaurants-grid">
        ${cards}
      </div>
    </section>
  `
}

function buildFooter() {
  return /* html */`
    <footer class="home-footer">
      <div class="home-footer__inner">
        <div class="home-footer__brand">
          <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
            <rect width="40" height="40" rx="10" fill="#EA1D2C"/>
            <path d="M20 8C13.37 8 8 13.37 8 20s5.37 12 12 12 12-5.37 12-12S26.63 8 20 8zm-2 16h-3V16h3v8zm7 0h-3V16h3v8z" fill="white"/>
          </svg>
          <span>iFood</span>
        </div>
        <p class="home-footer__copy">© 2026 iFood – Cópia acadêmica para fins de estudo</p>
      </div>
    </footer>
  `
}

// ── HomeView ───────────────────────────────────────────────────────────────

export class HomeView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render(userName) {
    this._container.innerHTML = /* html */`
      <div class="home-page">
        ${buildHeader(userName)}
        <main class="home-main">
          <div class="home-main__inner">
            ${buildBanners()}
            ${buildCategories()}
            ${buildRestaurants(restaurants)}
            ${buildRestaurants(
              restaurants.filter(r => r.fee === 'Grátis'),
              '🛵 Com frete grátis'
            )}
          </div>
        </main>
        ${buildFooter()}
      </div>
    `
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onLogout(handler) {
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  onUserMenuToggle() {
    const btn      = document.getElementById('user-menu-btn')
    const dropdown = document.getElementById('user-dropdown')
    if (!btn || !dropdown) return

    btn.addEventListener('click', () => this._toggleDropdown(dropdown))
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') this._toggleDropdown(dropdown)
    })

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target)) this._closeDropdown(dropdown)
    })
  }

  onCategoryClick(handler) {
    document.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => handler(btn.dataset.category))
    })
  }

  onRestaurantClick(handler) {
    document.querySelectorAll('.restaurant-card').forEach(card => {
      card.addEventListener('click', () => handler(card.dataset.id))
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handler(card.dataset.id)
      })
    })
  }

  onSearch(handler) {
    const input = document.getElementById('search-input')
    input?.addEventListener('input', () => handler(input.value))
  }

  // ── Banner slideshow ──────────────────────────────────────────────────────

  startBannerSlideshow() {
    const track = document.getElementById('banners-track')
    const dots  = document.querySelectorAll('.banner-dot')
    if (!track || !dots.length) return

    let current = 0
    const total = banners.length

    const goTo = (idx) => {
      current = (idx + total) % total
      track.style.transform = `translateX(-${current * 100}%)`
      dots.forEach((d, i) => d.classList.toggle('active', i === current))
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => goTo(Number(dot.dataset.index)))
    })

    this._slideTimer = setInterval(() => goTo(current + 1), 4000)
  }

  stopBannerSlideshow() {
    clearInterval(this._slideTimer)
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(message, type = 'default') {
    let toast = document.getElementById('home-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'home-toast'
      toast.className = 'toast'
      toast.setAttribute('role', 'status')
      toast.setAttribute('aria-live', 'polite')
      document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.className = `toast ${type} show`
    setTimeout(() => toast.classList.remove('show'), 3500)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _toggleDropdown(dropdown) {
    const isOpen = dropdown.classList.toggle('open')
    dropdown.setAttribute('aria-hidden', String(!isOpen))
  }

  _closeDropdown(dropdown) {
    dropdown.classList.remove('open')
    dropdown.setAttribute('aria-hidden', 'true')
  }
}
