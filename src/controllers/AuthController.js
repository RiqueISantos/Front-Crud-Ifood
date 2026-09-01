/**
 * AuthController
 *
 * Controla a tela "Falta pouco para matar sua fome!".
 * - Facebook / Google: botões visuais apenas (sem integração por ora)
 * - Celular → /verify-phone
 * - E-mail  → /email-input  (digita email, verifica se tem conta)
 */

export class AuthController {
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
    this._view.onFacebook(() => {
      this._view.showToast('Login com Facebook será implementado em breve.', 'default')
    })
    this._view.onGoogle(() => {
      this._view.showToast('Login com Google será implementado em breve.', 'default')
    })

    // Celular → verificação de celular
    this._view.onPhone(() => this._router.navigate('/verify-phone'))

    // E-mail → tela de input de e-mail (igual iFood)
    this._view.onEmail(() => this._router.navigate('/email-input'))

    this._view.onLogoBack(() => this._router.navigate('/'))
  }
}
