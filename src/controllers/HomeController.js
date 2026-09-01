/**
 * HomeController
 * Orquestra HomeModel ↔ HomeView após o login.
 */

import { getUserName, restaurants } from '../models/HomeModel.js'
import { clearToken } from '../services/api.js'

export class HomeController {
  /**
   * @param {import('../views/HomeView.js').HomeView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._allItems  = restaurants
  }

  // ── Ciclo de vida ──────────────────────────────────────────────────────

  init() {
    const userName = getUserName()
    this._view.render(userName)
    this._bindEvents()
    this._view.startBannerSlideshow()
  }

  destroy() {
    this._view.stopBannerSlideshow()
  }

  // ── Eventos ────────────────────────────────────────────────────────────

  _bindEvents() {
    this._view.onUserMenuToggle()

    this._view.onLogout(() => this._handleLogout())

    this._view.onSearch((query) => this._handleSearch(query))

    this._view.onCategoryClick((category) => {
      this._view.showToast(`Filtrando por: ${category}`, 'default')
    })

    this._view.onRestaurantClick((id) => {
      const r = this._allItems.find(x => String(x.id) === String(id))
      if (r) this._view.showToast(`Abrindo ${r.name}…`, 'default')
    })
  }

  // ── Logout ─────────────────────────────────────────────────────────────

  _handleLogout() {
    clearToken()
    localStorage.removeItem('ifood_user')
    this._router.navigate('/login')
  }

  // ── Busca (filtro visual simples) ──────────────────────────────────────

  _handleSearch(query) {
    const grid = document.getElementById('restaurants-grid')
    if (!grid) return

    const term = query.trim().toLowerCase()

    const filtered = term
      ? this._allItems.filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.category.toLowerCase().includes(term)
        )
      : this._allItems

    if (!filtered.length) {
      grid.innerHTML = `<p class="home-empty">Nenhum resultado para "<strong>${query}</strong>"</p>`
      return
    }

    grid.innerHTML = filtered.map(r => /* html */`
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
            <span aria-hidden="true">·</span>
            <span>${r.time}</span>
            <span aria-hidden="true">·</span>
            <span class="${r.fee === 'Grátis' ? 'free' : ''}">${r.fee}</span>
          </div>
        </div>
      </article>
    `).join('')

    // Re-bind de cliques após re-render
    this._view.onRestaurantClick((id) => {
      const r = this._allItems.find(x => String(x.id) === String(id))
      if (r) this._view.showToast(`Abrindo ${r.name}…`, 'default')
    })
  }
}
