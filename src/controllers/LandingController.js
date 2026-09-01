/**
 * LandingController
 *
 * Controla a página inicial (landing page estilo iFood).
 * "Entrar" → /auth?mode=login
 * "Criar conta" → /auth?mode=register
 * Ambos usam a mesma AuthView.
 */

export class LandingController {
  /**
   * @param {import('../views/LandingView.js').LandingView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  init() {
    this._view.render()
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    // "Entrar" e "Criar conta" levam para a mesma tela de auth
    this._view.onEntrar(()     => this._router.navigate('/auth'))
    this._view.onCriarConta(() => this._router.navigate('/auth'))
    this._view.onCloseCoupon()

    this._view.onBuscar(() => {
      // Futuramente: navegar para busca com o endereço preenchido
      this._router.navigate('/auth')
    })
  }
}
