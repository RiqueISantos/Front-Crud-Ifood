/**
 * HomeController
 * Orquestra HomeModel ↔ HomeView após o login.
 * Carrega restaurantes do backend; usa fallback estático se falhar.
 */

import { getUserName, adaptarRestaurante, restaurantsFallback } from '../models/HomeModel.js'
import { clearToken, apiListarRestaurantes, apiBuscarProdutos } from '../services/api.js'

export class HomeController {
  constructor(view, router) {
    this._view     = view
    this._router   = router
    this._allItems = []
  }

  async init() {
    const userName = getUserName()
    this._view.render(userName)
    this._bindEvents()
    this._view.startBannerSlideshow()
    await this._carregarRestaurantes()
  }

  destroy() {
    this._view.stopBannerSlideshow()
  }

  async _carregarRestaurantes() {
    try {
      const lista = await apiListarRestaurantes()
      this._allItems = lista.map((r, i) => adaptarRestaurante(r, i))
    } catch {
      // Backend indisponível — usa fallback estático
      this._allItems = restaurantsFallback
    }
    this._renderizarGrid(this._allItems)
  }

  _renderizarGrid(lista) {
    const grid = document.getElementById('restaurants-grid')
    if (!grid) return

    if (!lista.length) {
      grid.innerHTML = `<p class="home-empty">Nenhum restaurante disponível no momento.</p>`
      return
    }

    grid.innerHTML = lista.map(r => /* html */`
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

    // Bind de cliques
    document.querySelectorAll('.restaurant-card').forEach(card => {
      const handler = () => {
        const id = card.dataset.id
        if (id && Number(id) > 0) {
          this._router.navigate(`/loja/${id}`)
        }
      }
      card.addEventListener('click', handler)
      card.addEventListener('keydown', e => { if (e.key === 'Enter') handler() })
    })
  }

  _bindEvents() {
    this._view.onUserMenuToggle()
    this._view.onLogout(() => this._handleLogout())
    this._view.onCartClick(() => window._sacola?.abrir())
    this._view.onCategoryClick(category => {
      const filtrados = category
        ? this._allItems.filter(r => r.category.toLowerCase().includes(category.toLowerCase()))
        : this._allItems
      this._renderizarGrid(filtrados.length ? filtrados : this._allItems)
    })
    this._view.onSearch(query => this._handleSearch(query))
  }

  _handleLogout() {
    clearToken()
    localStorage.removeItem('ifood_user')
    this._router.navigate('/login')
  }

  _handleSearch(query) {
    const term = query.trim().toLowerCase()

    if (!term) {
      this._renderizarGrid(this._allItems)
      this._view.clearSearchResults()
      return
    }

    // Filtra restaurantes localmente
    const restFiltrados = this._allItems.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term)
    )

    this._renderizarGrid(restFiltrados.length ? restFiltrados : [])

    // Busca produtos no backend em paralelo
    this._buscarProdutos(term)
  }

  async _buscarProdutos(term) {
    try {
      const produtos = await apiBuscarProdutos(term)
      if (produtos.length > 0) {
        this._view.renderSearchResults(produtos, (restauranteId) => {
          this._router.navigate(`/loja/${restauranteId}`)
        })
      } else {
        this._view.clearSearchResults()
      }
    } catch {
      this._view.clearSearchResults()
    }
  }
}
