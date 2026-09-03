import './styles/global.css'
import './styles/landing.css'
import './styles/auth.css'
import './styles/verify.css'
import './styles/register.css'
import './styles/login.css'
import './styles/home.css'

import { Router }                 from './router/Router.js'
import { LandingView }            from './views/LandingView.js'
import { LandingController }      from './controllers/LandingController.js'
import { AuthView }               from './views/AuthView.js'
import { AuthController }         from './controllers/AuthController.js'
import { EmailInputView }         from './views/EmailInputView.js'
import { EmailInputController }   from './controllers/EmailInputController.js'
import { PhoneVerifyView }        from './views/PhoneVerifyView.js'
import { PhoneVerifyController }  from './controllers/PhoneVerifyController.js'
import { EmailVerifyView }        from './views/EmailVerifyView.js'
import { EmailVerifyController }  from './controllers/EmailVerifyController.js'
import { LoginView }              from './views/LoginView.js'
import { LoginController }        from './controllers/LoginController.js'
import { HomeView }               from './views/HomeView.js'
import { HomeController }         from './controllers/HomeController.js'
import { OAuthPhoneView }         from './views/OAuthPhoneView.js'
import { OAuthPhoneController }   from './controllers/OAuthPhoneController.js'
import { getToken, saveToken }    from './services/api.js'

const app = document.getElementById('app')

const router = new Router(app, {
  '/': () => {
    const view = new LandingView(app)
    return new LandingController(view, router)
  },
  '/auth': () => {
    const view = new AuthView(app)
    return new AuthController(view, router)
  },
  '/email-input': () => {
    const view = new EmailInputView(app)
    return new EmailInputController(view, router)
  },
  '/verify-phone': () => {
    const view = new PhoneVerifyView(app)
    return new PhoneVerifyController(view, router)
  },
  '/verify-email': () => {
    const view = new EmailVerifyView(app)
    return new EmailVerifyController(view, router)
  },
  '/login': () => {
    const view = new LoginView(app)
    return new LoginController(view, router)
  },
  '/oauth-callback': () => {
    // O backend redireciona para  #/oauth-callback?temp_token=...&tem_telefone=0|1&usuario=...
    const hash   = window.location.hash
    const qIndex = hash.indexOf('?')
    const params = qIndex !== -1
      ? new URLSearchParams(hash.slice(qIndex + 1))
      : new URLSearchParams()

    const tempToken   = params.get('temp_token')
    const temTelefone = params.get('tem_telefone') === '1'
    const usuarioRaw  = params.get('usuario')
    const erro        = params.get('erro')

    history.replaceState(null, '', window.location.pathname)

    if (!tempToken) {
      // Algo deu errado — volta para auth
      router.navigate('/auth')
      return { init() {}, destroy() {} }
    }

    let usuario = {}
    try { usuario = JSON.parse(decodeURIComponent(usuarioRaw || '{}')) } catch {}

    // Guarda estado no sessionStorage para a rota /oauth-phone usar
    sessionStorage.setItem('oauth_state', JSON.stringify({ tempToken, temTelefone, usuario }))
    router.navigate('/oauth-phone')
    return { init() {}, destroy() {} }
  },

  '/oauth-phone': () => {
    const raw = sessionStorage.getItem('oauth_state')
    if (!raw) { router.navigate('/auth'); return { init() {}, destroy() {} } }

    let state = {}
    try { state = JSON.parse(raw) } catch {}

    const view = new OAuthPhoneView(app)
    return new OAuthPhoneController(view, router, state)
  },
  '/home': () => {
    if (!getToken()) {
      router.navigate('/auth')
      return { init() {}, destroy() {} }
    }
    const view = new HomeView(app)
    return new HomeController(view, router)
  },
})

router.start()