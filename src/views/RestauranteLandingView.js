/**
 * RestauranteLandingView
 *
 * Tela de entrada do portal de parceiros iFood.
 * Estilo igual ao portal "Quero ser parceiro" do iFood:
 * - Lado esquerdo: branding com benefícios
 * - Lado direito: painel com opções "Cadastrar" e "Entrar"
 */

export class RestauranteLandingView {
  /** @param {HTMLElement} container */
  constructor(container) {
    this._container = container
  }

  render() {
    this._container.innerHTML = /* html */`
      <div class="rest-landing-page">

        <!-- ── Lado esquerdo: branding ── -->
        <div class="rest-landing-left" aria-hidden="true">
          <div class="rest-landing-left__inner">

            <a href="#/" class="rest-landing-logo" aria-label="iFood – página inicial">
              <span class="rest-landing-logo__text">iFood</span>
              <span class="rest-landing-logo__for">para restaurantes</span>
            </a>

            <h1 class="rest-landing-headline">
              Leve seu restaurante<br>para mais pessoas
            </h1>

            <ul class="rest-landing-benefits" role="list">
              <li class="rest-landing-benefit">
                <span class="rest-landing-benefit__icon" aria-hidden="true">🚀</span>
                <span>Alcance milhões de clientes na maior plataforma de delivery do Brasil</span>
              </li>
              <li class="rest-landing-benefit">
                <span class="rest-landing-benefit__icon" aria-hidden="true">📊</span>
                <span>Gerencie pedidos e acompanhe seus resultados em tempo real</span>
              </li>
              <li class="rest-landing-benefit">
                <span class="rest-landing-benefit__icon" aria-hidden="true">💳</span>
                <span>Receba seus pagamentos de forma rápida e segura</span>
              </li>
              <li class="rest-landing-benefit">
                <span class="rest-landing-benefit__icon" aria-hidden="true">🎯</span>
                <span>Crie promoções e fidelize seus clientes com facilidade</span>
              </li>
            </ul>

          </div>
        </div>

        <!-- ── Lado direito: painel de acesso ── -->
        <div class="rest-landing-right">

          <!-- Logo para mobile (visível só em telas pequenas) -->
          <a href="#/" class="rest-landing-logo rest-landing-logo--mobile" aria-label="iFood – página inicial">
            <span class="rest-landing-logo__text">iFood</span>
            <span class="rest-landing-logo__for">para restaurantes</span>
          </a>

          <div class="rest-landing-panel">

            <h2 class="rest-landing-panel__title">Bem-vindo ao portal<br>de parceiros</h2>
            <p class="rest-landing-panel__subtitle">
              Cadastre seu restaurante ou acesse sua conta para gerenciar seu negócio.
            </p>

            <button type="button" class="rest-landing-btn rest-landing-btn--primary" id="btn-rest-cadastrar">
              Quero ser parceiro
            </button>

            <div class="rest-landing-divider">
              <span>ou</span>
            </div>

            <button type="button" class="rest-landing-btn rest-landing-btn--outline" id="btn-rest-entrar">
              Já sou parceiro — Entrar
            </button>

            <p class="rest-landing-terms">
              Ao continuar, você concorda com os
              <a href="#" tabindex="0">Termos de Uso</a> e a
              <a href="#" tabindex="0">Política de Privacidade</a> do iFood para Restaurantes.
            </p>

          </div>

          <a href="#/" class="rest-landing-back-home">
            ← Voltar para o iFood
          </a>

        </div>
      </div>
    `
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onCadastrar(handler) {
    document.getElementById('btn-rest-cadastrar')?.addEventListener('click', handler)
  }

  onEntrar(handler) {
    document.getElementById('btn-rest-entrar')?.addEventListener('click', handler)
  }
}
