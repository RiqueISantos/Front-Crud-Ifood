/**
 * LoginModel
 *
 * Responsável por:
 *  - Validar os campos do formulário de login
 *  - Submeter as credenciais para a API (ou mock)
 */

// ── Validadores ────────────────────────────────────────────────────────────

export const loginValidators = {
  email(value) {
    if (!value || !value.trim()) return 'Informe seu e-mail'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'E-mail inválido'
    return null
  },

  password(value) {
    if (!value || !value.trim()) return 'Informe sua senha'
    if (value.length < 8) return 'Senha deve ter ao menos 8 caracteres'
    return null
  },
}

import { apiLogin, apiRegister } from '../services/api.js'

/**
 * Valida todos os campos de login.
 * @param {{ email: string, password: string }} data
 * @returns {{ errors: Object, isValid: boolean }}
 */
export function validateLoginForm(data) {
  const errors = {}

  const emailErr    = loginValidators.email(data.email)
  const passwordErr = loginValidators.password(data.password)

  if (emailErr)    errors.email    = emailErr
  if (passwordErr) errors.password = passwordErr

  return { errors, isValid: Object.keys(errors).length === 0 }
}

/**
 * Autentica o usuário e salva o token JWT no localStorage.
 * @param {{ email: string, password: string }} data
 */
export async function submitLogin(data) {
  return apiLogin({
    email: data.email,
    senha: data.password,
  })
}

/**
 * Inicia o fluxo OAuth social para login.
 * @param {'google'|'facebook'} provider
 */
export async function submitSocialLogin(provider) {
  // Mock temporário enquanto o OAuth não está configurado
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const name = provider === 'google' ? 'Google' : 'Facebook'
  return { success: true, message: `Login com ${name}: configure o SDK OAuth.` }
}
