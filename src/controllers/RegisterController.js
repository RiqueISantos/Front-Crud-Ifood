/**
 * RegisterController
 *
 * Responsável por:
 *  - Orquestrar Model e View
 *  - Ouvir eventos da View e chamar o Model para validar/persistir
 *  - Passar resultados do Model de volta para a View atualizar o DOM
 *  - NÃO manipula o DOM diretamente
 *  - NÃO contém regras de negócio ou validação
 */

import {
  validateForm,
  submitRegister,
  submitSocialLogin,
  getPasswordStrength,
  validators,
  maskCPF,
  maskDate,
  maskPhone,
} from '../models/RegisterModel.js'

export class RegisterController {
  /**
   * @param {import('../views/RegisterView.js').RegisterView} view
   * @param {import('../router/Router.js').Router} router
   */
  constructor(view, router) {
    this._view   = view
    this._router = router
  }

  // ── Ciclo de vida ──────────────────────────────────────────────────────

  init() {
    this._view.render()
    this._bindEvents()
  }

  destroy() {
    // Nada a limpar por ora
  }

  // ── Binding de eventos ─────────────────────────────────────────────────

  _bindEvents() {
    const v = this._view

    // Submit
    v.onSubmit(() => this._handleSubmit())

    // Password toggles
    v.onPasswordToggle('toggle-password', 'password')
    v.onPasswordToggle('toggle-confirm-password', 'confirmPassword')

    // Login redirect
    v.onLoginLink(() => this._handleLoginRedirect())

    // Login social
    v.onSocialLogin('google',   (provider) => this._handleSocialLogin(provider))
    v.onSocialLogin('facebook', (provider) => this._handleSocialLogin(provider))

    // Máscaras em tempo real
    v.onFieldInput('cpf',       (val) => v.setFieldValue('cpf',       maskCPF(val)))
    v.onFieldInput('birthDate', (val) => v.setFieldValue('birthDate', maskDate(val)))
    v.onFieldInput('phoneDDD',  (val) => v.setFieldValue('phoneDDD',  val.replace(/\D/g, '').slice(0, 2)))
    v.onFieldInput('phoneNumber', (val) => v.setFieldValue('phoneNumber', maskPhone(val)))

    // Força da senha em tempo real
    v.onFieldInput('password', (val) => {
      const { score, label } = getPasswordStrength(val)
      v.updateStrengthBar(score, label)
      // Se já tinha erro visível, revalida enquanto digita
      this._revalidateIfDirty('password', () => validators.password(val))
    })

    // Validação inline no blur (campo a campo)
    const blurRules = [
      { id: 'firstName',  validate: (val) => validators.firstName(val) },
      { id: 'lastName',   validate: (val) => validators.lastName(val) },
      { id: 'email',      validate: (val) => validators.email(val) },
      { id: 'cpf',        validate: (val) => validators.cpf(val) },
      { id: 'birthDate',  validate: (val) => validators.birthDate(val) },
      { id: 'password',   validate: (val) => validators.password(val) },
      {
        id: 'confirmPassword',
        validate: (val) => validators.confirmPassword(v.getFieldValue('password'), val),
      },
    ]

    blurRules.forEach(({ id, validate }) => {
      v.onFieldBlur(id, (val) => {
        const error = validate(val)
        error ? v.showFieldError(id, error) : v.clearFieldError(id)
      })
    })

    // Blur no telefone (valida ambos os campos juntos)
    const phoneBlurHandler = () => {
      const ddd = v.getFieldValue('phoneDDD')
      const num = v.getFieldValue('phoneNumber')
      const error = validators.phone(ddd, num)
      if (error) {
        v.showErrors({ phone: error })
      } else {
        v.clearFieldError('phone')
        // Limpa manualmente os estilos de erro do telefone via showErrors com objeto vazio
        v.showErrors({})
      }
    }
    v.onFieldBlur('phoneDDD',    phoneBlurHandler)
    v.onFieldBlur('phoneNumber', phoneBlurHandler)

    // Confirmar senha: revalida enquanto digita se já tinha erro
    v.onFieldInput('confirmPassword', (val) => {
      this._revalidateIfDirty('confirmPassword', () =>
        validators.confirmPassword(v.getFieldValue('password'), val)
      )
    })
  }

  // ── Submit ─────────────────────────────────────────────────────────────

  async _handleSubmit() {
    const data = this._view.getFormData()
    const { errors, isValid } = validateForm(data)

    if (!isValid) {
      this._view.showErrors(errors)
      // Foca o primeiro campo com erro
      this._focusFirstError(errors)
      return
    }

    this._view.setSubmitLoading(true)

    try {
      await submitRegister(data)
      this._view.showToast('Conta criada com sucesso! 🎉', 'success')
      this._view.resetForm()
      setTimeout(() => this._router.navigate('/login'), 1200)
    } catch (err) {
      // Trata erros conhecidos do backend
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('email já cadastrado') || msg.toLowerCase().includes('email')) {
        this._view.showFieldError('email', 'Este e-mail já está cadastrado')
        document.getElementById('email')?.focus()
      } else {
        this._view.showToast(msg || 'Ocorreu um erro. Tente novamente.', 'error')
      }
    } finally {
      this._view.setSubmitLoading(false)
    }
  }

  // ── Login redirect ─────────────────────────────────────────────────────

  _handleLoginRedirect() {
    this._router.navigate('/login')
  }

  // ── Social login ───────────────────────────────────────────────────────

  async _handleSocialLogin(provider) {
    this._view.setSocialLoading(provider, true)
    try {
      const result = await submitSocialLogin(provider)
      this._view.showToast(result.message, 'success')
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao autenticar. Tente novamente.', 'error')
    } finally {
      this._view.setSocialLoading(provider, false)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  /**
   * Revalida um campo somente se ele já possui a classe de erro visível.
   * Evita mostrar erros prematuros enquanto o usuário ainda está digitando.
   */
  _revalidateIfDirty(fieldId, validate) {
    const el = document.getElementById(fieldId)
    if (el && el.classList.contains('error')) {
      const error = validate()
      error
        ? this._view.showFieldError(fieldId, error)
        : this._view.clearFieldError(fieldId)
    }
  }

  /** Foca o primeiro input com erro para melhorar a acessibilidade */
  _focusFirstError(errors) {
    const order = [
      'firstName', 'lastName', 'email', 'cpf',
      'birthDate', 'phone', 'password', 'confirmPassword',
    ]
    const firstKey = order.find((k) => errors[k] && k !== 'terms')
    if (!firstKey) return
    const inputId = firstKey === 'phone' ? 'phoneDDD' : firstKey
    document.getElementById(inputId)?.focus()
  }
}
