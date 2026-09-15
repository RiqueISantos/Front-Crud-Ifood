/**
 * EnderecosView
 *
 * Tela "Meus Endereços" do usuário cliente.
 * Lista endereços salvos, permite adicionar, editar e remover.
 * Acessada pelo dropdown da home (#/enderecos).
 */

const TIPOS = ['CASA', 'TRABALHO', 'OUTRO']

export class EnderecosView {
  constructor(container) { this._container = container }

  // ── Loading ───────────────────────────────────────────────────────────────

  renderLoading() {
    this._container.innerHTML = /* html */`
      <div class="perfil-page">
        <div class="perfil-topbar">
          <button class="perfil-topbar__back" id="btn-end-back">← Voltar</button>
          <span class="perfil-topbar__title">Meus Endereços</span>
        </div>
        <div class="perfil-loading">
          <div class="perfil-spinner"></div>
          <span>Carregando endereços...</span>
        </div>
      </div>
    `
  }

  // ── Lista de endereços ────────────────────────────────────────────────────

  renderLista(enderecos = []) {
    const cards = enderecos.length
      ? enderecos.map(e => this._buildCard(e)).join('')
      : /* html */`
          <div class="perfil-empty">
            <span class="perfil-empty__icon">📍</span>
            <p>Você ainda não tem endereços salvos.</p>
          </div>
        `

    this._container.innerHTML = /* html */`
      <div class="perfil-page">
        <div class="perfil-topbar">
          <button class="perfil-topbar__back" id="btn-end-back">← Voltar</button>
          <span class="perfil-topbar__title">Meus Endereços</span>
        </div>

        <div class="perfil-content">
          <div class="perfil-card" style="max-width:680px;margin:0 auto">
            <div class="perfil-card__header">
              <div>
                <h2 class="perfil-card__title">Meus Endereços</h2>
                <p class="perfil-card__sub">Gerencie seus endereços de entrega.</p>
              </div>
              <button class="perfil-btn-primary" id="btn-end-novo" style="width:auto;padding:10px 20px">
                + Novo endereço
              </button>
            </div>
            <div id="enderecos-lista">
              ${cards}
            </div>
          </div>
        </div>
      </div>

      ${this._buildForm()}
      ${this._buildModalDeletar()}
    `
    this._bindFormCep()
    this._bindCepEnter()
  }

  // ── Builders internos ─────────────────────────────────────────────────────

  _buildCard(e) {
    const icone = e.tipo_endereco === 'CASA' ? '🏠' : e.tipo_endereco === 'TRABALHO' ? '🏢' : '📍'
    const linha1 = [e.logradouro, e.numero ? `nº ${e.numero}` : null, e.complemento].filter(Boolean).join(', ')
    const linha2 = [e.bairro, e.cidade, e.uf].filter(Boolean).join(', ')
    return /* html */`
      <div class="end-card" data-id="${e.id}">
        <div class="end-card__icon">${icone}</div>
        <div class="end-card__info">
          <span class="end-card__tipo">${e.tipo_endereco}</span>
          <span class="end-card__linha1">${linha1}</span>
          <span class="end-card__linha2">${linha2} — CEP ${e.cep}</span>
        </div>
        <div class="end-card__actions">
          <button class="end-btn-edit" data-id="${e.id}" aria-label="Editar endereço">✏️</button>
          <button class="end-btn-del"  data-id="${e.id}" aria-label="Excluir endereço">🗑️</button>
        </div>
      </div>
    `
  }

  _buildForm() {
    return /* html */`
      <div class="perfil-modal-overlay" id="modal-end-form" hidden>
        <div class="perfil-modal perfil-modal--wide" role="dialog" aria-modal="true" aria-labelledby="modal-end-title">
          <h2 class="perfil-modal__title" id="modal-end-title">Novo endereço</h2>

          <div class="perfil-field" style="margin-bottom:12px">
            <label class="perfil-label">Tipo de endereço</label>
            <div class="end-tipo-group">
              ${TIPOS.map(t => /* html */`
                <label class="end-tipo-btn">
                  <input type="radio" name="end-tipo" value="${t}" ${t === 'CASA' ? 'checked' : ''}>
                  <span>${t === 'CASA' ? '🏠 Casa' : t === 'TRABALHO' ? '🏢 Trabalho' : '📍 Outro'}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- CEP -->
          <div class="perfil-field">
            <label class="perfil-label" for="end-cep">CEP *</label>
            <div class="end-cep-row">
              <input class="perfil-input" type="text" id="end-cep"
                placeholder="00000-000" inputmode="numeric" maxlength="9" />
              <button type="button" class="perfil-btn-cep" id="btn-end-buscar-cep">Buscar</button>
            </div>
            <span class="perfil-error" id="end-cep-error"></span>
          </div>

          <div id="end-campos-endereco" hidden>
            <div class="perfil-row">
              <div class="perfil-field" style="flex:2">
                <label class="perfil-label" for="end-logradouro">Rua / Avenida *</label>
                <input class="perfil-input" type="text" id="end-logradouro" placeholder="Nome da rua" />
                <span class="perfil-error" id="end-logradouro-error"></span>
              </div>
              <div class="perfil-field" style="flex:0 0 100px">
                <label class="perfil-label" for="end-numero">Número *</label>
                <input class="perfil-input" type="text" id="end-numero" placeholder="123" maxlength="10" />
                <span class="perfil-error" id="end-numero-error"></span>
              </div>
            </div>
            <div class="perfil-row">
              <div class="perfil-field">
                <label class="perfil-label" for="end-complemento">Complemento</label>
                <input class="perfil-input" type="text" id="end-complemento" placeholder="Apto, bloco..." />
              </div>
              <div class="perfil-field">
                <label class="perfil-label" for="end-bairro">Bairro</label>
                <input class="perfil-input perfil-input--readonly" type="text" id="end-bairro" readonly />
              </div>
            </div>
            <div class="perfil-row">
              <div class="perfil-field" style="flex:2">
                <label class="perfil-label" for="end-cidade">Cidade</label>
                <input class="perfil-input perfil-input--readonly" type="text" id="end-cidade" readonly />
              </div>
              <div class="perfil-field" style="flex:0 0 70px">
                <label class="perfil-label" for="end-uf">UF</label>
                <input class="perfil-input perfil-input--readonly" type="text" id="end-uf" readonly maxlength="2" />
              </div>
            </div>
          </div>

          <div class="end-cep-loading" id="end-cep-loading" hidden>
            <div class="perfil-spinner perfil-spinner--sm"></div>
            <span>Buscando CEP...</span>
          </div>

          <input type="hidden" id="end-edit-id" value="" />

          <div class="perfil-modal__actions" style="margin-top:20px">
            <button class="perfil-btn-outline" id="btn-end-form-cancelar">Cancelar</button>
            <button class="perfil-btn-primary" id="btn-end-form-salvar" style="width:auto;padding:12px 28px">
              Salvar endereço
            </button>
          </div>
        </div>
      </div>
    `
  }

  _buildModalDeletar() {
    return /* html */`
      <div class="perfil-modal-overlay" id="modal-end-deletar" hidden>
        <div class="perfil-modal" role="dialog" aria-modal="true">
          <h2 class="perfil-modal__title">Excluir endereço?</h2>
          <p class="perfil-modal__text">Este endereço será removido permanentemente.</p>
          <input type="hidden" id="end-del-id" value="" />
          <div class="perfil-modal__actions">
            <button class="perfil-btn-outline" id="btn-end-del-cancelar">Cancelar</button>
            <button class="perfil-btn-danger"  id="btn-end-del-confirmar">Excluir</button>
          </div>
        </div>
      </div>
    `
  }

  // ── Preencher form para edição ────────────────────────────────────────────

  preencherFormEdicao(e) {
    document.getElementById('end-edit-id').value      = e.id
    document.getElementById('end-cep').value          = e.cep || ''
    document.getElementById('end-logradouro').value   = e.logradouro || ''
    document.getElementById('end-numero').value       = e.numero || ''
    document.getElementById('end-complemento').value  = e.complemento || ''
    document.getElementById('end-bairro').value       = e.bairro || ''
    document.getElementById('end-cidade').value       = e.cidade || ''
    document.getElementById('end-uf').value           = e.uf || ''
    // Tipo
    const radio = document.querySelector(`input[name="end-tipo"][value="${e.tipo_endereco || 'CASA'}"]`)
    if (radio) radio.checked = true
    // Mostrar campos
    this.showCamposEndereco()
    // Título
    const title = document.getElementById('modal-end-title')
    if (title) title.textContent = 'Editar endereço'
  }

  limparForm() {
    document.getElementById('end-edit-id').value = ''
    ;['end-cep','end-logradouro','end-numero','end-complemento','end-bairro','end-cidade','end-uf']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
    const radio = document.querySelector('input[name="end-tipo"][value="CASA"]')
    if (radio) radio.checked = true
    this.hideCamposEndereco()
    const title = document.getElementById('modal-end-title')
    if (title) title.textContent = 'Novo endereço'
    this.clearAllErrors()
  }

  // ── Preenchimento automático CEP ──────────────────────────────────────────

  preencherCep({ logradouro, bairro, cidade, uf }) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? '' }
    set('end-logradouro', logradouro)
    set('end-bairro',     bairro)
    set('end-cidade',     cidade)
    set('end-uf',         uf)
    const logEl = document.getElementById('end-logradouro')
    if (logEl) {
      logEl.readOnly = !!logradouro
      logEl.classList.toggle('perfil-input--readonly', !!logradouro)
    }
    setTimeout(() => document.getElementById('end-numero')?.focus(), 80)
  }

  showCamposEndereco() {
    const el = document.getElementById('end-campos-endereco')
    if (el) { el.removeAttribute('hidden'); el.style.display = 'flex'; el.style.flexDirection = 'column'; el.style.gap = '12px' }
  }

  hideCamposEndereco() {
    const el = document.getElementById('end-campos-endereco')
    if (el) { el.setAttribute('hidden',''); el.style.display = 'none' }
  }

  // ── Modais ────────────────────────────────────────────────────────────────

  showFormModal()  { const m = document.getElementById('modal-end-form');    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' } }
  hideFormModal()  { const m = document.getElementById('modal-end-form');    if (m) { m.setAttribute('hidden',''); m.style.display = 'none' } }
  showDelModal(id) {
    const m = document.getElementById('modal-end-deletar')
    const i = document.getElementById('end-del-id')
    if (i) i.value = id
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
  }
  hideDelModal() { const m = document.getElementById('modal-end-deletar'); if (m) { m.setAttribute('hidden',''); m.style.display = 'none' } }

  // ── Loading CEP ───────────────────────────────────────────────────────────

  setCepLoading(v) {
    const spinner = document.getElementById('end-cep-loading')
    const btn     = document.getElementById('btn-end-buscar-cep')
    if (spinner) { if (v) spinner.removeAttribute('hidden'); else spinner.setAttribute('hidden','') }
    if (btn) { btn.disabled = v; btn.textContent = v ? '...' : 'Buscar' }
  }

  setSalvarLoading(v) {
    const btn = document.getElementById('btn-end-form-salvar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Salvando...' : 'Salvar endereço'
  }

  setDelLoading(v) {
    const btn = document.getElementById('btn-end-del-confirmar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Excluindo...' : 'Excluir'
  }

  // ── Erros ─────────────────────────────────────────────────────────────────

  showFieldError(campo, msg) {
    const el  = document.getElementById(`end-${campo}-error`)
    const inp = document.getElementById(`end-${campo}`)
    if (el)  el.textContent = msg
    if (inp) inp.classList.add('error')
  }

  clearFieldError(campo) {
    const el  = document.getElementById(`end-${campo}-error`)
    const inp = document.getElementById(`end-${campo}`)
    if (el)  el.textContent = ''
    if (inp) inp.classList.remove('error')
  }

  clearAllErrors() {
    ['cep','logradouro','numero'].forEach(c => this.clearFieldError(c))
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getFormData() {
    return {
      id:            document.getElementById('end-edit-id')?.value || null,
      tipo_endereco: document.querySelector('input[name="end-tipo"]:checked')?.value || 'CASA',
      cep:           (document.getElementById('end-cep')?.value         ?? '').replace(/\D/g,''),
      logradouro:    (document.getElementById('end-logradouro')?.value  ?? '').trim(),
      numero:        (document.getElementById('end-numero')?.value      ?? '').trim(),
      complemento:   (document.getElementById('end-complemento')?.value ?? '').trim() || null,
      bairro:        (document.getElementById('end-bairro')?.value      ?? '').trim(),
      cidade:        (document.getElementById('end-cidade')?.value      ?? '').trim(),
      uf:            (document.getElementById('end-uf')?.value          ?? '').trim(),
    }
  }

  getCep()      { return (document.getElementById('end-cep')?.value ?? '').replace(/\D/g,'') }
  getDelId()    { return document.getElementById('end-del-id')?.value || null }

  // ── Toast ─────────────────────────────────────────────────────────────────

  showToast(msg, type = 'default') {
    let t = document.getElementById('end-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'end-toast'
      t.setAttribute('role','status')
      t.setAttribute('aria-live','polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onVoltar(h)          { document.getElementById('btn-end-back')?.addEventListener('click', h) }
  onNovo(h)            { document.getElementById('btn-end-novo')?.addEventListener('click', h) }
  onFormCancelar(h)    { document.getElementById('btn-end-form-cancelar')?.addEventListener('click', h) }
  onFormSalvar(h)      { document.getElementById('btn-end-form-salvar')?.addEventListener('click', h) }
  onBuscarCep(h)       { document.getElementById('btn-end-buscar-cep')?.addEventListener('click', h) }
  onDelCancelar(h)     { document.getElementById('btn-end-del-cancelar')?.addEventListener('click', h) }
  onDelConfirmar(h)    { document.getElementById('btn-end-del-confirmar')?.addEventListener('click', h) }

  onEditarCard(h) {
    document.querySelectorAll('.end-btn-edit').forEach(btn =>
      btn.addEventListener('click', () => h(btn.dataset.id))
    )
  }

  onDeletarCard(h) {
    document.querySelectorAll('.end-btn-del').forEach(btn =>
      btn.addEventListener('click', () => h(btn.dataset.id))
    )
  }

  // ── Mask CEP ──────────────────────────────────────────────────────────────

  _bindFormCep() {
    const input = document.getElementById('end-cep')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g,'').slice(0,8)
      if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/,'$1-$2')
      input.value = v
    })
  }

  _bindCepEnter() {
    document.getElementById('end-cep')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-end-buscar-cep')?.click()
    })
  }
}
