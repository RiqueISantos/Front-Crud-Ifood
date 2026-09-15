/**
 * RestauranteEnderecoController
 *
 * Tela de endereço do restaurante (passo 2 de 2 no formulário).
 *
 * Fluxo:
 *  1. Usuário digita o CEP → busca no ViaCEP via frontend para preview
 *  2. Usuário confirma número e complemento
 *  3. Clica em "Finalizar cadastro" → monta o payload completo e chama
 *     POST /restaurante/cadastro/confirmar (que re-consulta o CEP no backend)
 *
 * Pré-requisitos no sessionStorage:
 *  - rest_email_verificado
 *  - rest_codigo_verificacao
 *  - rest_dados (JSON com nome, telefone, categoria, etc.)
 */

import { apiRestauranteConfirmarCadastro, saveRestauranteToken } from '../services/api.js'

export class RestauranteEnderecoController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._cepValido = false
  }

  init() {
    const email  = sessionStorage.getItem('rest_email_verificado') || ''
    const codigo = sessionStorage.getItem('rest_codigo_verificacao') || ''
    const dados  = sessionStorage.getItem('rest_dados') || ''

    if (!email || !codigo || !dados) {
      this._router.navigate('/restaurante/dados')
      return
    }

    this._view.render()
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onBuscarCep(  () => this._handleBuscarCep())
    this._view.onFinalizar(  () => this._handleFinalizar())
    this._view.onVoltar(     () => this._router.navigate('/restaurante/dados'))
  }

  // ── Busca de CEP (ViaCEP) no frontend — apenas para preview ──────────────

  async _handleBuscarCep() {
    const cep = this._view.getCep()
    this._view.clearAllErrors()
    this._cepValido = false

    if (!cep || cep.length !== 8) {
      this._view.showFieldError('cep', 'Digite um CEP válido com 8 dígitos')
      return
    }

    this._view.setCepLoading(true)
    this._view.hideEnderecoFields()

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()

      if (data.erro) {
        this._view.showFieldError('cep', 'CEP não encontrado. Verifique e tente novamente.')
        return
      }

      this._view.preencherEndereco({
        logradouro: data.logradouro || '',
        bairro:     data.bairro     || '',
        cidade:     data.localidade || '',
        uf:         data.uf         || '',
      })

      this._view.showEnderecoFields()
      this._cepValido = true
    } catch {
      this._view.showFieldError('cep', 'Erro ao buscar o CEP. Verifique sua conexão.')
    } finally {
      this._view.setCepLoading(false)
    }
  }

  // ── Finalizar cadastro ────────────────────────────────────────────────────

  async _handleFinalizar() {
    this._view.clearAllErrors()

    if (!this._cepValido) {
      this._view.showFieldError('cep', 'Busque um CEP válido antes de finalizar')
      return
    }

    const endereco = this._view.getEndereco()
    let valid = true

    if (!endereco.logradouro) {
      this._view.showFieldError('logradouro', 'Informe o nome da rua ou avenida')
      valid = false
    }

    if (!endereco.numero) {
      this._view.showFieldError('numero', 'Informe o número do estabelecimento')
      valid = false
    }

    if (!valid) return

    const email  = sessionStorage.getItem('rest_email_verificado') || ''
    const codigo = sessionStorage.getItem('rest_codigo_verificacao') || ''
    let dadosExtra = {}
    try { dadosExtra = JSON.parse(sessionStorage.getItem('rest_dados') || '{}') } catch {}

    const payload = {
      email,
      codigo,
      ...dadosExtra,
      cep:         endereco.cep,
      numero:      endereco.numero,
      complemento: endereco.complemento || undefined,
      // logradouro e bairro informados via frontend (para cidades com CEP geral)
      logradouro:  endereco.logradouro,
    }

    this._view.setFinalizarLoading(true)

    try {
      const result = await apiRestauranteConfirmarCadastro(payload)

      // Salva token de restaurante separado do token de cliente
      if (result.access_token) {
        saveRestauranteToken(result.access_token)
      }
      if (result.restaurante) {
        localStorage.setItem('ifood_restaurante', JSON.stringify(result.restaurante))
      }

      // Limpa dados temporários de sessão
      sessionStorage.removeItem('rest_email_verificado')
      sessionStorage.removeItem('rest_codigo_verificacao')
      sessionStorage.removeItem('rest_dados')

      this._view.showToast('Restaurante cadastrado com sucesso! Bem-vindo ao iFood 🎉', 'success')
      setTimeout(() => this._router.navigate('/restaurante/dashboard'), 1000)
    } catch (err) {
      const msg = (err.message ?? '').toLowerCase()
      if (msg.includes('código') || msg.includes('expirado') || msg.includes('invalido') || msg.includes('inválido')) {
        this._view.showToast('Código expirado ou inválido. Reinicie o cadastro.', 'error')
        setTimeout(() => this._router.navigate('/restaurante/email'), 2500)
      } else if (msg.includes('e-mail') || msg.includes('email') || msg.includes('cadastrado')) {
        this._view.showToast('E-mail já cadastrado. Faça login.', 'error')
        setTimeout(() => this._router.navigate('/restaurante/login'), 2000)
      } else {
        this._view.showToast(err.message || 'Erro ao finalizar o cadastro. Tente novamente.', 'error')
      }
    } finally {
      this._view.setFinalizarLoading(false)
    }
  }
}
