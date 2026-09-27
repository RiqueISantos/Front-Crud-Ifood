/**
 * RestauranteLandingController
 *
 * Controla a tela de entrada do portal de parceiros.
 * Botão "Quero ser parceiro" → /restaurante/email (modo cadastro)
 * Botão "Já sou parceiro"   → /restaurante/login
 */

export class RestauranteLandingController {
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
    this._view.onCadastrar(() => {
      sessionStorage.setItem('rest_cadastro_modo', 'cadastro')
      this._router.navigate('/restaurante/email')
    })

    this._view.onEntrar(() => {
      this._router.navigate('/restaurante/login')
    })
  }
}
