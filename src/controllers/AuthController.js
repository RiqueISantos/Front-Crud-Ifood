/**
 * AuthController
 *
 * Controla a tela "Falta pouco para matar sua fome!".
 * - Facebook: abre popup do FB SDK, pega access_token e chama POST /auth/facebook
 * - Google: redireciona para /auth/google (OAuth server-side)
 * - Celular → /verify-phone
 * - E-mail  → /email-input
 */

import { apiFacebookLogin, saveToken } from '../services/api.js'

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
    this._view.onFacebook(() => this._handleFacebook())

    this._view.onGoogle(() => {
      window.location.href = 'http://localhost:5000/auth/google'
    })

    this._view.onPhone(() => this._router.navigate('/verify-phone'))
    this._view.onEmail(() => this._router.navigate('/email-input'))
    this._view.onLogoBack(() => this._router.navigate('/'))
  }

  // ── Facebook Login ─────────────────────────────────────────────────────

  async _handleFacebook() {
    if (typeof FB === 'undefined') {
      this._view.showToast('SDK do Facebook ainda carregando. Tente novamente.', 'error')
      return
    }

    this._view.setFacebookLoading(true)

    // Verifica se já tem sessão ativa do Facebook
    FB.getLoginStatus(async (statusResponse) => {
      try {
        let accessToken = null

        if (statusResponse.status === 'connected') {
          // Já autenticado — usa o token existente direto
          accessToken = statusResponse.authResponse.accessToken
        } else {
          // Abre popup de login
          accessToken = await new Promise((resolve, reject) => {
            FB.login(
              (response) => {
                if (response.authResponse?.accessToken) {
                  resolve(response.authResponse.accessToken)
                } else {
                  // Se o popup foi bloqueado ou status inesperado
                  reject(new Error(
                    response.status === 'not_authorized'
                      ? 'Permissão negada.'
                      : 'cancelled'
                  ))
                }
              },
              { scope: 'public_profile,email', return_scopes: true }
            )
          })
        }

        // Envia token para o backend
        const result = await apiFacebookLogin(accessToken)

        if (result.access_token) saveToken(result.access_token)
        if (result.usuario) {
          localStorage.setItem('ifood_user', JSON.stringify(result.usuario))
        }

        this._view.showToast('Login com Facebook realizado!', 'success')
        setTimeout(() => this._router.navigate('/home'), 600)

      } catch (err) {
        const msg = err.message || ''
        if (msg === 'cancelled' || msg === 'Permissão negada.') {
          // Usuário fechou — silencioso
        } else {
          this._view.showToast(msg || 'Erro ao entrar com Facebook.', 'error')
        }
      } finally {
        this._view.setFacebookLoading(false)
      }
    })
  }
}
