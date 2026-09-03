/**
 * Router
 *
 * Roteador simples baseado em hash (#/register, #/login).
 * Responsável por instanciar o Controller correto e destruir o anterior.
 */

export class Router {
  /**
   * @param {HTMLElement} container - Elemento raiz onde as views são montadas
   * @param {Object} routes - Mapa de rota → função factory que retorna um controller
   *   Ex: { '/register': () => new RegisterController(new RegisterView(container)) }
   */
  constructor(container, routes) {
    this._container = container
    this._routes    = routes
    this._current   = null

    window.addEventListener('hashchange', () => this._resolve())
  }

  /** Inicia o roteador e resolve a rota atual */
  start() {
    if (!window.location.hash) {
      window.location.hash = '#/'
    }
    this._resolve()
  }

  /** Navega para uma rota */
  navigate(path) {
    window.location.hash = `#${path}`
  }

  // ── Privado ─────────────────────────────────────────────────────────────

  _resolve() {
    const hash  = window.location.hash || '#/'
    // Remove o '#' e descarta query params do hash (ex: #/oauth-callback?token=...)
    // para que o path seja apenas '/oauth-callback'
    const full  = hash.replace('#', '') || '/'
    const path  = full.split('?')[0] || '/'
    const factory = this._routes[path] ?? this._routes['/']

    // Destrói o controller anterior se existir
    if (this._current?.destroy) this._current.destroy()

    this._current = factory()
    this._current.init()
  }
}
