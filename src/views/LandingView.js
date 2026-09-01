/**
 * LandingView
 *
 * Tela inicial estilo iFood:
 *  - Header com "criar conta" e botão "Entrar"
 *  - Hero com campo de endereço e botão Buscar
 *  - Cards de Restaurante e Mercado
 *  - Categorias (Bebidas, Farmácia, Pet shop…)
 */

export class LandingView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="landing-page">

        <!-- ── Header ── -->
        <header class="landing-header">
          <div class="landing-header__inner">
            <a href="#/" class="landing-logo" aria-label="iFood – página inicial">
              <span class="landing-logo__text">iFood</span>
            </a>

            <nav class="landing-nav" aria-label="Navegação principal">
              <a href="#" class="landing-nav__link">Entregador</a>
              <a href="#" class="landing-nav__link">Restaurante e Mercado</a>
              <a href="#" class="landing-nav__link">Carreiras</a>
              <a href="#" class="landing-nav__link">iFood Benefícios</a>
            </nav>

            <div class="landing-header__actions">
              <button type="button" class="btn-criar-conta" id="btn-criar-conta">criar conta</button>
              <button type="button" class="btn-entrar" id="btn-entrar">Entrar</button>
            </div>
          </div>
        </header>

        <!-- ── Hero ── -->
        <main class="landing-main">
          <section class="landing-hero">
            <h1 class="landing-hero__title">Tudo pra facilitar seu dia a dia</h1>
            <p class="landing-hero__subtitle">O que você precisa está aqui. Peça e receba onde estiver.</p>

            <div class="landing-search">
              <div class="landing-search__input-wrap">
                <svg class="landing-search__pin" viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  type="text"
                  class="landing-search__input"
                  id="address-input"
                  placeholder="Endereço de entrega e número"
                  autocomplete="street-address"
                  aria-label="Endereço de entrega"
                />
              </div>
              <button type="button" class="landing-search__btn" id="btn-buscar">Buscar</button>
            </div>
          </section>

          <!-- ── Cards principais ── -->
          <section class="landing-cards" aria-label="Categorias principais">
            <div class="landing-card landing-card--red">
              <div class="landing-card__content">
                <h2 class="landing-card__title">Restaurante</h2>
                <button type="button" class="landing-card__btn" id="btn-restaurante">
                  Ver opções
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="landing-card__img landing-card__img--burger" aria-hidden="true">
                <span class="landing-card__emoji">🍔</span>
              </div>
            </div>

            <div class="landing-card landing-card--green">
              <div class="landing-card__content">
                <h2 class="landing-card__title">Mercado</h2>
                <button type="button" class="landing-card__btn" id="btn-mercado">
                  Buscar lojas
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="landing-card__img" aria-hidden="true">
                <span class="landing-card__emoji">🛒</span>
              </div>
            </div>
          </section>

          <!-- ── Categorias ── -->
          <section class="landing-categories" aria-label="Outras categorias">
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--yellow" aria-hidden="true">🥤</div>
              <span class="landing-category__name">Bebidas <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--pink" aria-hidden="true">🏥</div>
              <span class="landing-category__name">Farmácia <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--purple" aria-hidden="true">🐾</div>
              <span class="landing-category__name">Pet shop <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
          </section>
        </main>

        <!-- ── Popup cupom ── -->
        <div class="landing-coupon" id="landing-coupon" role="complementary" aria-label="Promoção">
          <button type="button" class="landing-coupon__close" id="btn-close-coupon" aria-label="Fechar promoção">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="landing-coupon__body">
            <div class="landing-coupon__icon" aria-hidden="true">🏷️</div>
            <div class="landing-coupon__text">
              <strong>Ganhe cupons!</strong>
              <p>Pegue seu cupom e aproveite o desconto</p>
              <button type="button" class="landing-coupon__link" id="btn-coupon-criar">Criar conta</button>
            </div>
          </div>
        </div>

      </div>
    `
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onEntrar(handler) {
    this._el('btn-entrar')?.addEventListener('click', handler)
  }

  onCriarConta(handler) {
    this._el('btn-criar-conta')?.addEventListener('click', handler)
    this._el('btn-coupon-criar')?.addEventListener('click', handler)
  }

  onBuscar(handler) {
    this._el('btn-buscar')?.addEventListener('click', handler)
    this._el('address-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handler()
    })
  }

  onCloseCoupon() {
    const coupon = this._el('landing-coupon')
    this._el('btn-close-coupon')?.addEventListener('click', () => {
      if (coupon) coupon.style.display = 'none'
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _el(id) { return document.getElementById(id) }
}
