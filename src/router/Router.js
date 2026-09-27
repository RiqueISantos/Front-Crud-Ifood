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
    const full  = hash.replace('#', '') || '/'
    const path  = full.split('?')[0] || '/'

    // Tenta match exato primeiro
    let factory = this._routes[path]

    // Se não encontrou, tenta match por prefixo para rotas dinâmicas (/loja/3)
    if (!factory) {
      const segments = path.split('/')
      // tenta /loja/:id → chave /loja
      const parentPath = '/' + segments[1]
      // Para /loja/3 usa a factory de /loja e passa o id via hash
      if (this._routes[parentPath] && segments.length >= 3) {
        factory = this._routes[parentPath + '/:id'] ?? this._routes[parentPath]
      }
    }

    factory = factory ?? this._routes['/']

    if (this._current?.destroy) this._current.destroy()
    this._current = factory()
    this._current.init()
  }
}
