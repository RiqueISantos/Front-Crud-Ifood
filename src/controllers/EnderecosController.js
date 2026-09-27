/**
 * EnderecosController
 *
 * CRUD completo de endereços do usuário cliente.
 * Rota: #/enderecos
 */

import {
  apiListarEnderecos,
  apiSalvarEndereco,
  apiAtualizarEndereco,
  apiDeletarEndereco,
} from '../services/api.js'

export class EnderecosController {
  constructor(view, router) {
    this._view      = view
    this._router    = router
    this._usuario   = null
    this._enderecos = []
    this._cepValido = false
  }

  async init() {
    try { this._usuario = JSON.parse(localStorage.getItem('ifood_user') || 'null') } catch {}
    if (!this._usuario?.id) { this._router.navigate('/auth'); return }

    this._view.renderLoading()
    await this._carregarEnderecos()
  }

  destroy() {}

  async _carregarEnderecos() {
    try {
      this._enderecos = await apiListarEnderecos(this._usuario.id)
    } catch {
      this._enderecos = []
    }
    this._view.renderLista(this._enderecos)
    this._bindEvents()
  }

  _bindEvents() {
    this._view.onVoltar(       () => this._router.navigate('/home'))
    this._view.onNovo(         () => { this._cepValido = false; this._view.limparForm(); this._view.showFormModal() })
    this._view.onFormCancelar( () => this._view.hideFormModal())
    this._view.onFormSalvar(   () => this._handleSalvar())
    this._view.onBuscarCep(    () => this._handleBuscarCep())
    this._view.onDelCancelar(  () => this._view.hideDelModal())
    this._view.onDelConfirmar( () => this._handleDeletar())
    this._view.onEditarCard(   id  => this._handleEditar(id))
    this._view.onDeletarCard(  id  => this._view.showDelModal(id))
  }

  // ── Busca CEP ─────────────────────────────────────────────────────────────

  async _handleBuscarCep() {
    const cep = this._view.getCep()
    this._view.clearAllErrors()
    this._cepValido = false

    if (!cep || cep.length !== 8) {
      this._view.showFieldError('cep', 'Digite um CEP válido com 8 dígitos')
      return
    }

    this._view.setCepLoading(true)
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (data.erro) { this._view.showFieldError('cep', 'CEP não encontrado'); return }

      this._view.preencherCep({
        logradouro: data.logradouro || '',
        bairro:     data.bairro     || '',
        cidade:     data.localidade || '',
        uf:         data.uf         || '',
      })
      this._view.showCamposEndereco()
      this._cepValido = true
    } catch {
      this._view.showFieldError('cep', 'Erro ao buscar o CEP. Verifique sua conexão.')
    } finally {
      this._view.setCepLoading(false)
    }
  }

  // ── Salvar (novo ou editar) ───────────────────────────────────────────────

  async _handleSalvar() {
    const dados = this._view.getFormData()
    this._view.clearAllErrors()
    let valid = true

    if (!dados.cep || dados.cep.length !== 8) {
      this._view.showFieldError('cep', 'Busque um CEP válido primeiro')
      valid = false
    }
    if (!dados.logradouro) {
      this._view.showFieldError('logradouro', 'Informe a rua ou avenida')
      valid = false
    }
    if (!dados.numero) {
      this._view.showFieldError('numero', 'Informe o número')
      valid = false
    }
    if (!valid) return

    this._view.setSalvarLoading(true)
    try {
      const payload = { ...dados, usuario_id: this._usuario.id }
      delete payload.id

      if (dados.id) {
        await apiAtualizarEndereco(dados.id, payload)
        this._view.showToast('Endereço atualizado!', 'success')
      } else {
        await apiSalvarEndereco(payload)
        this._view.showToast('Endereço adicionado!', 'success')
      }

      this._view.hideFormModal()
      await this._carregarEnderecos()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao salvar endereço.', 'error')
    } finally {
      this._view.setSalvarLoading(false)
    }
  }

  // ── Editar ────────────────────────────────────────────────────────────────

  _handleEditar(id) {
    const end = this._enderecos.find(e => String(e.id) === String(id))
    if (!end) return
    this._cepValido = true          // CEP já está preenchido
    this._view.preencherFormEdicao(end)
    this._view.showFormModal()
  }

  // ── Deletar ───────────────────────────────────────────────────────────────

  async _handleDeletar() {
    const id = this._view.getDelId()
    if (!id) return
    this._view.setDelLoading(true)
    try {
      await apiDeletarEndereco(id)
      this._view.showToast('Endereço removido.', 'success')
      this._view.hideDelModal()
      await this._carregarEnderecos()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao remover endereço.', 'error')
    } finally {
      this._view.setDelLoading(false)
    }
  }
}
