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
import { getToken }               from './services/api.js'

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
