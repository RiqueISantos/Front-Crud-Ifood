/**
 * RestauranteDashboardController
 *
 * Carrega os dados do restaurante autenticado via GET /restaurantes/:id
 * e renderiza o dashboard do portal do parceiro.
 */

import { apiGetRestaurante, clearRestauranteToken } from '../services/api.js'

export class RestauranteDashboardController {
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  async init() {
    this._view.renderLoading()

    // Recupera dados do restaurante salvos no localStorage após login/cadastro
    let rest = null
    try {
      rest = JSON.parse(localStorage.getItem('ifood_restaurante') || 'null')
    } catch {}

    // Se tiver o id, busca dados frescos do backend
    if (rest?.id) {
      try {
        const dados = await apiGetRestaurante(rest.id)
        rest = dados
        // Atualiza o cache local com os dados mais recentes
        localStorage.setItem('ifood_restaurante', JSON.stringify(rest))
      } catch {
        // Se falhar (ex: rede), usa os dados em cache mesmo
      }
    }

    if (!rest) {
      // Sem dados nenhum — força novo login
      this._router.navigate('/restaurante/login')
      return
    }

    this._view.render(rest)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onLogout(       () => this._handleLogout())
    this._view.onMinhaLoja(    () => this._router.navigate('/restaurante/perfil'))
    this._view.onEditarPerfil( () => this._router.navigate('/restaurante/perfil'))
  }

  _handleLogout() {
    clearRestauranteToken()
    localStorage.removeItem('ifood_restaurante')
    this._router.navigate('/restaurante')
  }
}
