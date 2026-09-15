/**
 * RestauranteDadosController
 *
 * Tela de dados do restaurante (passo 1 de 2 no formulário).
 * Valida nome, telefone e categoria, então salva no sessionStorage
 * e redireciona para /restaurante/endereco.
 *
 * Pré-requisitos no sessionStorage:
 *  - rest_email_verificado
 *  - rest_codigo_verificacao
 */

export class RestauranteDadosController {
  constructor(view, router) {
    this._view   = view
    this._router = router
    this._email  = ''
  }

  init() {
    this._email  = sessionStorage.getItem('rest_email_verificado') || ''
    const codigo = sessionStorage.getItem('rest_codigo_verificacao') || ''

    if (!this._email || !codigo) {
      // Sessão perdida — volta ao início
      this._router.navigate('/restaurante/email')
      return
    }

    this._view.render(this._email)
    this._bindEvents()
  }

  destroy() {}

  _bindEvents() {
    this._view.onContinuar(() => this._handleContinuar())
    this._view.onVoltar(()    => this._router.navigate('/restaurante/email'))
  }

  _handleContinuar() {
    const dados = this._view.getDados()
    this._view.clearAllErrors()

    let valid = true

    if (!dados.nome || dados.nome.length < 2) {
      this._view.showFieldError('nome', 'Informe o nome do restaurante')
      valid = false
    }

    const telRaw = dados.telefone.replace(/\D/g, '')
    if (!telRaw || telRaw.length < 10) {
      this._view.showFieldError('telefone', 'Informe um telefone válido com DDD')
      valid = false
    }

    if (!dados.categoria_principal) {
      this._view.showFieldError('categoria', 'Selecione uma categoria')
      valid = false
    }

    if (!valid) return

    // Persiste dados para uso na etapa seguinte
    sessionStorage.setItem('rest_dados', JSON.stringify({
      nome:               dados.nome,
      telefone:           telRaw,
      categoria_principal: dados.categoria_principal,
      taxa_entrega:       dados.taxa_entrega,
      tempo_estimado:     dados.tempo_estimado,
    }))

    this._router.navigate('/restaurante/endereco')
  }
}
