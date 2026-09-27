/**
 * UsuarioPerfilView
 *
 * Tela de perfil do usuário cliente — editar nome, telefone.
 * Também exibe botão para deletar conta.
 * Acessada pelo dropdown da home (#/perfil).
 */

export class UsuarioPerfilView {
  constructor(container) { this._container = container }

  render(usuario = {}) {
    this._container.innerHTML = /* html */`
      <div class="perfil-page">

        <div class="perfil-topbar">
          <button class="perfil-topbar__back" id="btn-uperfil-back">← Voltar</button>
          <span class="perfil-topbar__title">Meu Perfil</span>
        </div>

        <div class="perfil-content">
          <div class="perfil-card" style="max-width:560px;margin:0 auto">

            <!-- Avatar -->
            <div class="uperfil-avatar-wrap">
              <div class="uperfil-avatar">${(usuario.nome || 'U').charAt(0).toUpperCase()}</div>
              <div>
                <p class="uperfil-avatar__name">${usuario.nome || ''}</p>
                <p class="uperfil-avatar__email">${usuario.email || ''}</p>
              </div>
            </div>

            <div class="perfil-card__header" style="border-top:1px solid #f0f0f0;padding-top:20px;margin-top:4px">
              <h2 class="perfil-card__title">Dados pessoais</h2>
              <p class="perfil-card__sub">Atualize seu nome e número de celular.</p>
            </div>

            <form class="perfil-form" id="form-uperfil" novalidate>

              <div class="perfil-field">
                <label class="perfil-label" for="uperfil-nome">Nome completo</label>
                <input class="perfil-input" type="text" id="uperfil-nome"
                  value="${this._esc(usuario.nome)}"
                  maxlength="50" autocomplete="name" />
                <span class="perfil-error" id="uperfil-nome-error"></span>
              </div>

              <div class="perfil-field">
                <label class="perfil-label" for="uperfil-email">E-mail (somente leitura)</label>
                <input class="perfil-input perfil-input--readonly" type="email"
                  id="uperfil-email" value="${this._esc(usuario.email)}" readonly />
              </div>

              <div class="perfil-field">
                <label class="perfil-label" for="uperfil-telefone">Celular</label>
                <input class="perfil-input" type="tel" id="uperfil-telefone"
                  value="${this._esc(this._formatTel(usuario.telefone))}"
                  maxlength="15" inputmode="tel" autocomplete="tel"
                  placeholder="(11) 99999-9999" />
                <span class="perfil-error" id="uperfil-telefone-error"></span>
              </div>

              <div class="perfil-field">
                <label class="perfil-label" for="uperfil-doc">CPF (opcional)</label>
                <input class="perfil-input" type="text" id="uperfil-doc"
                  value="${this._esc(this._formatCpf(usuario.documento))}"
                  maxlength="14" inputmode="numeric"
                  placeholder="000.000.000-00" />
              </div>

              <div class="perfil-actions">
                <button type="submit" class="perfil-btn-primary" id="btn-uperfil-salvar">
                  Salvar alterações
                </button>
              </div>

            </form>
          </div>

          <!-- Zona de perigo -->
          <div class="perfil-danger-zone" style="max-width:560px;margin:20px auto 0">
            <h3 class="perfil-danger-zone__title">⚠️ Zona de perigo</h3>
            <p class="perfil-danger-zone__text">
              Excluir sua conta é permanente. Todos os seus dados serão removidos.
            </p>
            <button class="perfil-btn-danger" id="btn-uperfil-deletar">
              Excluir minha conta
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmação de exclusão -->
      <div class="perfil-modal-overlay" id="modal-uperfil-deletar" hidden>
        <div class="perfil-modal" role="dialog" aria-modal="true">
          <h2 class="perfil-modal__title">Excluir conta?</h2>
          <p class="perfil-modal__text">
            Esta ação é <strong>permanente</strong>. Sua conta e todos os seus dados serão excluídos.
          </p>
          <div class="perfil-modal__actions">
            <button class="perfil-btn-outline"  id="btn-uperfil-del-cancelar">Cancelar</button>
            <button class="perfil-btn-danger"   id="btn-uperfil-del-confirmar">Sim, excluir</button>
          </div>
        </div>
      </div>
    `
    this._bindPhoneMask()
    this._bindCpfMask()
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  getDados() {
    return {
      nome:      (document.getElementById('uperfil-nome')?.value     ?? '').trim(),
      telefone:  (document.getElementById('uperfil-telefone')?.value ?? '').replace(/\D/g,''),
      documento: (document.getElementById('uperfil-doc')?.value      ?? '').replace(/\D/g,'') || null,
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  showFieldError(campo, msg) {
    const el  = document.getElementById(`uperfil-${campo}-error`)
    const inp = document.getElementById(`uperfil-${campo}`)
    if (el)  el.textContent = msg
    if (inp) inp.classList.add('error')
  }

  clearFieldError(campo) {
    const el  = document.getElementById(`uperfil-${campo}-error`)
    const inp = document.getElementById(`uperfil-${campo}`)
    if (el)  el.textContent = ''
    if (inp) inp.classList.remove('error')
  }

  setLoading(v) {
    const btn = document.getElementById('btn-uperfil-salvar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Salvando...' : 'Salvar alterações'
  }

  showModal() {
    const m = document.getElementById('modal-uperfil-deletar')
    if (m) { m.removeAttribute('hidden'); m.style.display = 'flex' }
  }

  hideModal() {
    const m = document.getElementById('modal-uperfil-deletar')
    if (m) { m.setAttribute('hidden',''); m.style.display = 'none' }
  }

  setDeleteLoading(v) {
    const btn = document.getElementById('btn-uperfil-del-confirmar')
    if (!btn) return
    btn.disabled = v
    btn.textContent = v ? 'Excluindo...' : 'Sim, excluir'
  }

  showToast(msg, type = 'default') {
    let t = document.getElementById('uperfil-toast')
    if (!t) {
      t = document.createElement('div')
      t.id = 'uperfil-toast'
      t.setAttribute('role','status')
      t.setAttribute('aria-live','polite')
      document.body.appendChild(t)
    }
    t.textContent = msg
    t.className = `toast ${type} show`
    setTimeout(() => t.classList.remove('show'), 3500)
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  onSalvar(h)          {
    document.getElementById('form-uperfil')?.addEventListener('submit', e => { e.preventDefault(); h() })
    document.getElementById('btn-uperfil-salvar')?.addEventListener('click', h)
  }
  onDeletar(h)         { document.getElementById('btn-uperfil-deletar')?.addEventListener('click', h) }
  onModalCancelar(h)   { document.getElementById('btn-uperfil-del-cancelar')?.addEventListener('click', h) }
  onModalConfirmar(h)  { document.getElementById('btn-uperfil-del-confirmar')?.addEventListener('click', h) }
  onVoltar(h)          { document.getElementById('btn-uperfil-back')?.addEventListener('click', h) }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _esc(v) { return (v ?? '').toString().replace(/"/g,'&quot;') }

  _formatTel(v) {
    if (!v) return ''
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3')
    if (d.length > 6)  return d.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3')
    return d
  }

  _formatCpf(v) {
    if (!v) return ''
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4')
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/,'$1.$2.$3')
    if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/,'$1.$2')
    return d
  }

  _bindPhoneMask() {
    const input = document.getElementById('uperfil-telefone')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g,'').slice(0,11)
      if (v.length > 10)     v = v.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3')
      else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3')
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/,'($1) $2')
      input.value = v
    })
  }

  _bindCpfMask() {
    const input = document.getElementById('uperfil-doc')
    if (!input) return
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g,'').slice(0,11)
      if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4')
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/,'$1.$2.$3')
      else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/,'$1.$2')
      input.value = v
    })
  }
}
