/**
 * LandingView — Landing page completa estilo iFood
 */

export class LandingView {
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
              <svg class="landing-logo__icon" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="30" cy="30" r="28" fill="#EA1D2C"/>
                <path d="M22 18h5v24h-5V18zm11 0h5v10h6v5h-6v9h-5V18z" fill="white"/>
                <circle cx="44" cy="42" r="4" fill="white"/>
              </svg>
              <span class="landing-logo__text">ifood</span>
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
                <input type="text" class="landing-search__input" id="address-input"
                  placeholder="Endereço de entrega e número"
                  autocomplete="street-address" aria-label="Endereço de entrega" />
              </div>
              <button type="button" class="landing-search__btn" id="btn-buscar">Buscar</button>
            </div>
          </section>

          <!-- ── Cards Restaurante / Mercado ── -->
          <section class="landing-cards" aria-label="Categorias principais">
            <div class="landing-card landing-card--red">
              <div class="landing-card__content">
                <h2 class="landing-card__title">Restaurante</h2>
                <button type="button" class="landing-card__btn" id="btn-restaurante">
                  Ver opções
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="landing-card__img" aria-hidden="true"><span class="landing-card__emoji">🍔</span></div>
            </div>
            <div class="landing-card landing-card--green">
              <div class="landing-card__content">
                <h2 class="landing-card__title">Mercado</h2>
                <button type="button" class="landing-card__btn" id="btn-mercado">
                  Buscar lojas
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="landing-card__img" aria-hidden="true"><span class="landing-card__emoji">🛒</span></div>
            </div>
          </section>

          <!-- ── Categorias ── -->
          <section class="landing-categories" aria-label="Outras categorias">
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--yellow" aria-hidden="true">🥤</div>
              <span class="landing-category__name">Bebidas <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--pink" aria-hidden="true">💊</div>
              <span class="landing-category__name">Farmácia <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
            <div class="landing-category">
              <div class="landing-category__img landing-category__img--purple" aria-hidden="true">🐾</div>
              <span class="landing-category__name">Pet shop <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="landing-category__arrow" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
            </div>
          </section>

          <!-- ── Melhores Restaurantes ── -->
          <section class="landing-section" aria-label="Os melhores restaurantes">
            <h2 class="landing-section__title">Os melhores restaurantes</h2>
            <div class="landing-store-list">
              <div class="landing-store-card">
                <div class="landing-store-card__logo" style="background:#DA291C;">
                  <span style="color:white;font-weight:900;font-size:1.1rem;">M</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Mcdonald's</p>
                  <p class="landing-store-card__cat">Lanches</p>
                </div>
                <button class="landing-store-card__fav" aria-label="Favoritar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div class="landing-store-card">
                <div class="landing-store-card__logo" style="background:#3D2B1F;">
                  <span style="color:white;font-weight:800;font-size:0.7rem;text-align:center;line-height:1.1;">COCO<br>BAMBU</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Coco Bambu</p>
                  <p class="landing-store-card__cat">Frutos Do Mar</p>
                </div>
                <button class="landing-store-card__fav" aria-label="Favoritar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div class="landing-store-card">
                <div class="landing-store-card__logo" style="background:#C41230;">
                  <span style="color:white;font-weight:800;font-size:0.65rem;text-align:center;line-height:1.1;">CHINA<br>IN BOX</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">China in Box</p>
                  <p class="landing-store-card__cat">Chinesa</p>
                </div>
                <button class="landing-store-card__fav" aria-label="Favoritar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div class="landing-store-card">
                <div class="landing-store-card__logo" style="background:#EA1D2C;">
                  <span style="color:white;font-weight:900;font-size:0.9rem;">HABIB'S</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Habib's</p>
                  <p class="landing-store-card__cat">Lanches</p>
                </div>
                <button class="landing-store-card__fav" aria-label="Favoritar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div class="landing-store-card">
                <div class="landing-store-card__logo" style="background:#1a1a1a;">
                  <span style="color:white;font-weight:800;font-size:0.65rem;text-align:center;line-height:1.1;">OUT<br>BACK</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Outback Steakhouse</p>
                  <p class="landing-store-card__cat">Lanches</p>
                </div>
                <button class="landing-store-card__fav" aria-label="Favoritar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#EA1D2C" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- ── Banners promocionais ── -->
          <section class="landing-promo-banners" aria-label="Promoções">
            <div class="landing-promo-banner landing-promo-banner--yellow">
              <div class="landing-promo-banner__tag">ENTREGA GRÁTIS</div>
              <div class="landing-promo-banner__content">
                <p class="landing-promo-banner__label">ALMOÇO</p>
                <p class="landing-promo-banner__price">A PARTIR DE<br><strong>R$ 10</strong></p>
              </div>
              <div class="landing-promo-banner__img" aria-hidden="true">🍽️</div>
            </div>
            <div class="landing-promo-banner landing-promo-banner--red">
              <div class="landing-promo-banner__tag">ENTREGA GRÁTIS</div>
              <div class="landing-promo-banner__content">
                <p class="landing-promo-banner__label">PRATOS</p>
                <p class="landing-promo-banner__price">COM ATÉ<br><strong>70% OFF</strong></p>
              </div>
              <div class="landing-promo-banner__img" aria-hidden="true">🥗</div>
            </div>
            <div class="landing-promo-banner landing-promo-banner--dark-red">
              <div class="landing-promo-banner__content">
                <p class="landing-promo-banner__label">SUPER ⭐⭐⭐⭐⭐</p>
                <p class="landing-promo-banner__price"><strong>RESTAURANTES</strong></p>
              </div>
              <div class="landing-promo-banner__img" aria-hidden="true">🍲</div>
            </div>
          </section>

          <!-- ── Melhores Mercados ── -->
          <section class="landing-section" aria-label="Os melhores mercados">
            <h2 class="landing-section__title">Os melhores mercados</h2>
            <div class="landing-store-list landing-store-list--markets">
              <div class="landing-store-card landing-store-card--wide">
                <div class="landing-store-card__logo" style="background:#EA1D2C;">
                  <span style="color:white;font-weight:900;font-size:1rem;">Dia</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Dia Supermercado</p>
                </div>
              </div>
              <div class="landing-store-card landing-store-card--wide">
                <div class="landing-store-card__logo" style="background:#fff;border:1px solid #eee;">
                  <span style="color:#1a1a1a;font-weight:900;font-size:1rem;">BIG</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Big</p>
                </div>
              </div>
              <div class="landing-store-card landing-store-card--wide">
                <div class="landing-store-card__logo" style="background:#fff;border:1px solid #eee;">
                  <span style="color:#1a1a1a;font-size:0.7rem;font-style:italic;font-weight:300;letter-spacing:2px;">eataly</span>
                </div>
                <div class="landing-store-card__info">
                  <p class="landing-store-card__name">Eataly</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ── CTA duplo: Entregador / Restaurante ── -->
          <section class="landing-cta-section" aria-label="Seja parceiro">
            <div class="landing-cta-card">
              <div class="landing-cta-card__illustration" aria-hidden="true">🧑‍💼</div>
              <div class="landing-cta-card__body">
                <h3 class="landing-cta-card__title">Quer fazer entregas pelo iFood?</h3>
                <p class="landing-cta-card__text">Faça agora o seu cadastro e comece o quanto antes.</p>
                <button type="button" class="landing-cta-card__btn">Saiba mais</button>
              </div>
            </div>
            <div class="landing-cta-card">
              <div class="landing-cta-card__illustration" aria-hidden="true">🏪</div>
              <div class="landing-cta-card__body">
                <h3 class="landing-cta-card__title">A sua fome de crescer ta no iFood</h3>
                <p class="landing-cta-card__text">Cadastre seu restaurante ou o seu mercado.</p>
                <button type="button" class="landing-cta-card__btn">Saiba mais</button>
              </div>
            </div>
          </section>

          <!-- ── FoodLover ── -->
          <section class="landing-foodlover" aria-label="Você tem fome do quê?">
            <div class="landing-foodlover__text">
              <h2 class="landing-foodlover__title">Você tem fome do quê?</h2>
              <p class="landing-foodlover__sub">Descubra como é ser um FoodLover e faça parte da nossa revolução!</p>
              <button type="button" class="landing-foodlover__btn">Saiba mais</button>
            </div>
            <div class="landing-foodlover__grid" aria-hidden="true">
              <div class="fl-photo fl-photo--1">😄</div>
              <div class="fl-photo fl-photo--2">🤩</div>
              <div class="fl-photo fl-photo--3">😎</div>
              <div class="fl-photo fl-photo--4">🥳</div>
              <div class="fl-photo fl-photo--5">😁</div>
              <div class="fl-photo fl-photo--6">🤗</div>
              <div class="fl-photo fl-photo--7">😜</div>
              <div class="fl-photo fl-photo--8">🥰</div>
              <div class="fl-photo fl-photo--9">😋</div>
            </div>
          </section>

          <!-- ── iFood Benefícios ── -->
          <section class="landing-beneficios" aria-label="iFood Benefícios">
            <div class="landing-beneficios__left">
              <div class="landing-beneficios__logo">
                <svg viewBox="0 0 60 60" fill="none" width="32" height="32"><circle cx="30" cy="30" r="28" fill="#EA1D2C"/><path d="M22 18h5v24h-5V18zm11 0h5v10h6v5h-6v9h-5V18z" fill="white"/><circle cx="44" cy="42" r="4" fill="white"/></svg>
                <strong>Benefícios</strong>
              </div>
            </div>
            <div class="landing-beneficios__right">
              <div class="landing-beneficios__card" aria-hidden="true">💳</div>
              <p class="landing-beneficios__text">O <strong>vale-alimentação</strong> do iFood taxa zero para a sua empresa</p>
            </div>
          </section>
        </main>

        <!-- ── Footer ── -->
        <footer class="landing-footer" aria-label="Rodapé">
          <div class="landing-footer__inner">
            <div class="landing-footer__col">
              <h4 class="landing-footer__heading">iFood</h4>
              <ul class="landing-footer__list">
                <li><a href="#">Site Institucional</a></li>
                <li><a href="#">Fale Conosco</a></li>
                <li><a href="#">Conta e Segurança</a></li>
                <li><a href="#">Carreiras</a></li>
                <li><a href="#">Entregadores</a></li>
              </ul>
            </div>
            <div class="landing-footer__col">
              <h4 class="landing-footer__heading">Descubra</h4>
              <ul class="landing-footer__list">
                <li><a href="#">Cadastre seu Restaurante ou Mercado</a></li>
                <li><a href="#">iFood Shop</a></li>
                <li><a href="#">iFood Benefícios</a></li>
                <li><a href="#">Blog iFood Benefícios</a></li>
              </ul>
            </div>
            <div class="landing-footer__col">
              <h4 class="landing-footer__heading">Social</h4>
              <div class="landing-footer__social">
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="landing-footer__bottom">
            <div class="landing-footer__bottom-inner">
              <div class="landing-footer__bottom-brand">
                <svg viewBox="0 0 60 60" fill="none" width="28" height="28"><circle cx="30" cy="30" r="28" fill="#EA1D2C"/><path d="M22 18h5v24h-5V18zm11 0h5v10h6v5h-6v9h-5V18z" fill="white"/><circle cx="44" cy="42" r="4" fill="white"/></svg>
                <span class="landing-footer__bottom-text">
                  © Copyright 2021 – iFood – Todos os direitos reservados iFood com Agência de Restaurantes Online S.A.<br>
                  CNPJ 14.380.200/0001-21 / Avenida dos Autonomistas, nº 1496, Vila Yara, Osasco/SP – CEP 06.020-902
                </span>
              </div>
              <div class="landing-footer__bottom-links">
                <a href="#">Termos e condições de uso</a>
                <a href="#">Código de conduta</a>
                <a href="#">Privacidade</a>
                <a href="#">Dicas de segurança</a>
              </div>
            </div>
          </div>
        </footer>

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

  onEntrar(handler) { this._el('btn-entrar')?.addEventListener('click', handler) }
  onCriarConta(handler) {
    this._el('btn-criar-conta')?.addEventListener('click', handler)
    this._el('btn-coupon-criar')?.addEventListener('click', handler)
  }
  onBuscar(handler) {
    this._el('btn-buscar')?.addEventListener('click', handler)
    this._el('address-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handler() })
  }
  onCloseCoupon() {
    const coupon = this._el('landing-coupon')
    this._el('btn-close-coupon')?.addEventListener('click', () => { if (coupon) coupon.style.display = 'none' })
  }
  _el(id) { return document.getElementById(id) }
}
