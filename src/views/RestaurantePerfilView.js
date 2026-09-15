/**
 * RestaurantePerfilView
 *
 * Tela de edição do perfil do restaurante — acessada pelo menu "Minha loja"
 * no dashboard. Permite atualizar nome, telefone, categoria, taxa, tempo
 * e exibe botão de exclusão da conta.
 */

const CATEGORIAS = [
  'Lanches','Pizza','Japonesa','Brasileira','Italiana','Árabe','Mexicana',
  'Chinesa','Frutos do Mar','Vegetariana','Saudável','Açaí','Sorvetes',
  'Doces & Bolos','Padaria','Cafeteria','Carnes','Frango','Marmita','Bebidas','Outro',
]

export class RestaurantePerfilView {
  constructor(container) { this._container = container }

  render(rest = {}) {
    const taxaVal = rest.taxa_entrega != null ? rest.taxa_entrega : ''
    this._container.innerHTML = /* html */`
      <div class="rdash-root">

        <!-- Sidebar mínima de volta -->
        <aside class="rdash-sidebar">
          <a href="#/restaurante" class="rdash-sidebar__logo">
            <span class="rdash-sidebar__logo-text">iFood</span>
            <span class="rdash-sidebar__logo-sub">para restaurantes</span>
          </a>
          <div class="rdash-sidebar__nav" style="padding-top:20px">
            <button class="rdash-nav-item" id="btn-perfil-back-dash">
              <span class="rdash-nav-item__icon">←</span> Voltar ao painel
            </button>
          </div>
        </aside>

        <div class="rdash-main">
          <header class="rdash-header">
            <h1 class="rdash-header__title">Minha loja</h1>
          </header>

          <main class="rdash-content">
            <div class="perfil-card">

              <div class="perfil-card__header">
                <h2 class="perfil-card__title">Dados do restaurante</h2>
                <p class="perfil-card__sub">Atualize as informações do seu estabelecimento.</p>
              </div>

              <form class="perfil-form" id="form-rest-perfil" novalidate>

                <div class="perfil-row">
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-nome">Nome do restaurante</label>
                    <input class="perfil-input" type="text" id="perf-nome"
                      value="${this._esc(rest.nome)}" maxlength="50" autocomplete="organization" />
                    <span class="perfil-error" id="perf-nome-error"></span>
                  </div>
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-telefone">Telefone / WhatsApp</label>
                    <input class="perfil-input" type="tel" id="perf-telefone"
                      value="${this._esc(rest.telefone)}" maxlength="15" inputmode="tel" />
                    <span class="perfil-error" id="perf-telefone-error"></span>
                  </div>
                </div>

                <div class="perfil-row">
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-categoria">Categoria principal</label>
                    <div class="perfil-select-wrap">
                      <select class="perfil-input perfil-select" id="perf-categoria">
                        ${CATEGORIAS.map(c =>
                          `<option value="${c}" ${c === rest.categoria_principal ? 'selected' : ''}>${c}</option>`
                        ).join('')}
                      </select>
                      <span class="perfil-select-arrow">▾</span>
                    </div>
                  </div>
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-tempo">Tempo estimado</label>
                    <div class="perfil-select-wrap">
                      <select class="perfil-input perfil-select" id="perf-tempo">
                        <option value="">Não informar</option>
                        ${['10-20 min','20-30 min','30-40 min','40-50 min','50-60 min','60-75 min','75-90 min']
                          .map(t => `<option value="${t}" ${t === rest.tempo_estimado ? 'selected' : ''}>${t}</option>`).join('')}
                      </select>
                      <span class="perfil-select-arrow">▾</span>
                    </div>
                  </div>
                </div>

                <div class="perfil-row">
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-taxa">Taxa de entrega (R$)</label>
                    <div class="perfil-prefix-wrap">
                      <span class="perfil-prefix">R$</span>
                      <input class="perfil-input perfil-input--prefixed" type="number"
                        id="perf-taxa" value="${taxaVal}" min="0" step="0.50" inputmode="decimal"
                        placeholder="0,00" />
                    </div>
                    <span class="perfil-hint">Deixe vazio para entrega grátis</span>
                  </div>
                  <div class="perfil-field">
                    <label class="perfil-label" for="perf-email">E-mail (somente leitura)</label>
                    <input class="perfil-input perfil-input--readonly" type="email"
                      id="perf-email" value="${this._esc(rest.email)}" readonly />
                  </div>
                </div>

                <div class="perfil-actions">
                  <button type="submit" class="perfil-btn-primary" id="btn-perf-salvar">
                    Salvar alterações
                  </button>
                </div>

              </form>
            </div>

            <!-- Zona de perigo -->
            <div class="perfil-danger-zone">
              <h3 class="perfil-danger-zone__title">⚠️ Zona de perigo</h3>
              <p class="perfil-danger-zone__text">
                Excluir seu restaurante é uma ação permanente e não pode ser desfeita.
                Todos os dados serão removidos.
              </p>
              <button class="perfil-btn-danger" id="btn-perf-deletar">
                Excluir restaurante
              </button>
            </div>

          </main>
        </div>
      </div>

      <!-- Modal de confirmação de exclusão -->
      <div class="perfil-modal-overlay" id="modal-deletar-rest" hidden>
        <div class="perfil-modal" role="dialog" aria-modal="true" aria-labelledby="modal-del-title">
          <h2 class="perfil-modal__title" id="modal-del-title">Excluir restaurante?</h2>
          <p class="perfil-modal__text">
            Esta ação é <strong>permanente</strong>. Todos os dados do restaurante
            <strong id="modal-del-nome"></strong> serão excluídos.
          </p>
          <div class="perfil-modal__actions">
            <button class="perfil-btn-outline" id="btn-modal-cancelar">Cancelar</button>
            <button class="perfil-btn-danger" id="btn-modal-confirmar">Sim, excluir</button>
          </div>
        </div>
      </div>
    `
    this._bindPhoneMask()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getDados() {
    const taxa = parseFloat(document.getElementById('perf-taxa')?.value ?? '') 
    return {
      nome:               (document.getElementById('perf-nome')?.value      ?? '').trim(),
      telefone:           (document.getElementById('perf-telefone')?.value  ?? '').replace(/\D/g,''),
      categoria_principal:(document.getElementById('perf-categoria')?.value ?? ''),
      taxa_entrega:       isNaN(taxa) ? null : taxa || null,
      tempo_estimado:     document.getElementById('perf-tempo')?.value || null,
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showFieldError(campo, msg) {
    const el = document.getElementById(`perf-${campo}-error`)
    const inp = document.getElementById(`perf-${campo}`)
    if (el) el.textContent = msg
    if (inp) inp.classList.add('error')
  }

  clearFieldError(campo) {
    const el = document.getElementById(`perf-${campo}-error`)
    const inp = document.getElementById(`perf-${campo}`)
    if (el) el.textContent = ''
    if (inp) inp.classList.remove('error')
  }

  setLoading(v) {
    const btn = document.getElementById('btn-perf-salvar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Salvando...' : 'Salvar alterações'
  }

  showModal(nomeRest) {
    const modal = document.getElementById('modal-deletar-rest')
    const nome  = document.getElementById('modal-del-nome')
    if (nome)  nome.textContent = nomeRest
    if (modal) { modal.removeAttribute('hidden'); modal.style.display = 'flex' }
  }

  hideModal() {
    const modal = document.getElementById('modal-deletar-rest')
    if (modal) { modal.setAttribute('hidden',''); modal.style.display = 'none' }
  }

  setDeleteLoading(v) {
    const btn = document.getElementById('btn-modal-confirmar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Excluindo...' : 'Sim, excluir'
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('perfil-rest-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'perfil-rest-toast'
      t.setAttribute('role','status')
      t.setAttribute('aria-live','polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onSalvar(handler) {
    document.getElementById('form-rest-perfil')?.addEventListener('submit', e => { e.preventDefault(); handler() })
    document.getElementById('btn-perf-salvar')?.addEventListener('click', handler)
  }

  onDeletar(handler)         { document.getElementById('btn-perf-deletar')?.addEventListener('click', handler) }
  onModalCancelar(handler)   { document.getElementById('btn-modal-cancelar')?.addEventListener('click', handler) }
  onModalConfirmar(handler)  { document.getElementById('btn-modal-confirmar')?.addEventListener('click', handler) }
  onVoltar(handler)          { document.getElementById('btn-perfil-back-dash')?.addEventListener('click', handler) }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _esc(v) { return (v ?? '').toString().replace(/"/g, '&quot;') }

  _bindPhoneMask() {
    const input = document.getElementById('perf-telefone')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g,'').slice(0,11)
      if (v.length > 10)      v = v.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3')
      else if (v.length > 6)  v = v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3')
      else if (v.length > 2)  v = v.replace(/(\d{2})(\d{0,5})/,'($1) $2')
      input.value = v
    })
  }
}
