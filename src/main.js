import './styles/global.css'
import './styles/landing.css'
import './styles/auth.css'
import './styles/verify.css'
import './styles/register.css'
import './styles/login.css'
import './styles/home.css'
import './styles/restaurante.css'
import './styles/restaurante-dashboard.css'
import './styles/perfil.css'

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
import { CadastroFinalView }      from './views/CadastroFinalView.js'
import { CadastroFinalController } from './controllers/CadastroFinalController.js'
import { getToken, saveToken, getRestauranteToken } from './services/api.js'

// ── Restaurante (portal de parceiros) ────────────────────────────────────
import { RestauranteLandingView }       from './views/RestauranteLandingView.js'
import { RestauranteLandingController } from './controllers/RestauranteLandingController.js'
import { RestauranteEmailView }         from './views/RestauranteEmailView.js'
import { RestauranteEmailController }   from './controllers/RestauranteEmailController.js'
import { RestauranteDadosView }         from './views/RestauranteDadosView.js'
import { RestauranteDadosController }   from './controllers/RestauranteDadosController.js'
import { RestauranteEnderecoView }      from './views/RestauranteEnderecoView.js'
import { RestauranteEnderecoController } from './controllers/RestauranteEnderecoController.js'
import { RestauranteLoginView }         from './views/RestauranteLoginView.js'
import { RestauranteLoginController }   from './controllers/RestauranteLoginController.js'
import { RestauranteDashboardView }     from './views/RestauranteDashboardView.js'
import { RestauranteDashboardController } from './controllers/RestauranteDashboardController.js'

// ── Perfil / Endereços ────────────────────────────────────────────────────
import { UsuarioPerfilView }            from './views/UsuarioPerfilView.js'
import { UsuarioPerfilController }      from './controllers/UsuarioPerfilController.js'
import { EnderecosView }                from './views/EnderecosView.js'
import { EnderecosController }          from './controllers/EnderecosController.js'
import { RestaurantePerfilView }        from './views/RestaurantePerfilView.js'
import { RestaurantePerfilController }  from './controllers/RestaurantePerfilController.js'

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

  '/cadastro': () => {
    const view = new CadastroFinalView(app)
    return new CadastroFinalController(view, router)
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

  // ── Portal de parceiros (restaurante) ──────────────────────────────────

  '/restaurante': () => {
    const view = new RestauranteLandingView(app)
    return new RestauranteLandingController(view, router)
  },

  '/restaurante/email': () => {
    const view = new RestauranteEmailView(app)
    return new RestauranteEmailController(view, router)
  },

  '/restaurante/dados': () => {
    const view = new RestauranteDadosView(app)
    return new RestauranteDadosController(view, router)
  },

  '/restaurante/endereco': () => {
    const view = new RestauranteEnderecoView(app)
    return new RestauranteEnderecoController(view, router)
  },

  '/restaurante/login': () => {
    const view = new RestauranteLoginView(app)
    return new RestauranteLoginController(view, router)
  },

  '/restaurante/dashboard': () => {
    // Guard — precisa de token de restaurante
    if (!getRestauranteToken()) {
      router.navigate('/restaurante/login')
      return { init() {}, destroy() {} }
    }
    const view = new RestauranteDashboardView(app)
    return new RestauranteDashboardController(view, router)
  },

  '/restaurante/perfil': () => {
    if (!getRestauranteToken()) {
      router.navigate('/restaurante/login')
      return { init() {}, destroy() {} }
    }
    const view = new RestaurantePerfilView(app)
    return new RestaurantePerfilController(view, router)
  },

  // ── Perfil e endereços do usuário cliente ─────────────────────────────

  '/perfil': () => {
    if (!getToken()) {
      router.navigate('/auth')
      return { init() {}, destroy() {} }
    }
    const view = new UsuarioPerfilView(app)
    return new UsuarioPerfilController(view, router)
  },

  '/enderecos': () => {
    if (!getToken()) {
      router.navigate('/auth')
      return { init() {}, destroy() {} }
    }
    const view = new EnderecosView(app)
    return new EnderecosController(view, router)
  },
})

router.start()