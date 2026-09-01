/**
 * RegisterModel
 *
 * Responsável por:
 *  - Definir a estrutura dos dados do formulário
 *  - Validar cada campo individualmente
 *  - Submeter os dados para a API (ou mock)
 */

// ── Máscaras ───────────────────────────────────────────────────────────────

export function maskCPF(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

export function maskDate(value) {
  const d = value.replace(/\D/g, '').slice(0, 8)
  return d
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
}

export function maskPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 4) return d
  return d.replace(/(\d{4,5})(\d)/, '$1-$2')
}

// ── Validadores individuais ────────────────────────────────────────────────

export const validators = {
  firstName(value) {
    if (!value || value.trim().length < 2) return 'Informe seu nome'
    return null
  },

  lastName(value) {
    if (!value || value.trim().length < 2) return 'Informe seu sobrenome'
    return null
  },

  email(value) {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Informe um e-mail válido'
    }
    return null
  },

  cpf(value) {
    const digits = (value || '').replace(/\D/g, '')
    if (digits.length !== 11) return 'CPF inválido'
    if (/^(\d)\1{10}$/.test(digits)) return 'CPF inválido'

    let sum = 0
    for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i)
    let check = (sum * 10) % 11
    if (check === 10 || check === 11) check = 0
    if (check !== Number(digits[9])) return 'CPF inválido'

    sum = 0
    for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i)
    check = (sum * 10) % 11
    if (check === 10 || check === 11) check = 0
    if (check !== Number(digits[10])) return 'CPF inválido'

    return null
  },

  birthDate(value) {
    if (!value) return 'Informe sua data de nascimento'
    const match = (value || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!match) return 'Data inválida (DD/MM/AAAA)'

    const [, d, m, y] = match
    const day = Number(d)
    const month = Number(m)
    const year = Number(y)

    // Usa construtor local (ano, mês 0-indexado, dia) para evitar
    // o problema de fuso horário do parsing ISO via new Date(string)
    const date = new Date(year, month - 1, day)
    if (
      isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return 'Data inválida'
    }

    const today = new Date()
    let age = today.getFullYear() - year
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age--
    }
    if (age < 18) return 'Você precisa ter ao menos 18 anos'
    return null
  },

  phone(ddd, number) {
    const d = (ddd || '').replace(/\D/g, '')
    const n = (number || '').replace(/\D/g, '')
    if (!d || d.length < 2) return 'Informe o DDD'
    if (!n || n.length < 8) return 'Informe um celular válido com DDD'
    return null
  },

  password(value) {
    if (!value || value.length < 8) return 'A senha deve ter ao menos 8 caracteres'
    return null
  },

  confirmPassword(password, confirm) {
    if (!confirm) return 'Confirme sua senha'
    if (password !== confirm) return 'As senhas não coincidem'
    return null
  },

  terms(checked) {
    if (!checked) return 'Você precisa aceitar os termos de uso'
    return null
  },
}

// ── Força da senha ─────────────────────────────────────────────────────────

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['', 'Fraca', 'Regular', 'Boa', 'Forte']
  return { score, label: labels[score] }
}

// ── Validação completa do formulário ───────────────────────────────────────

/**
 * Valida todos os campos e retorna um mapa de erros.
 * @param {Object} data - Dados do formulário
 * @returns {{ errors: Object, isValid: boolean }}
 */
export function validateForm(data) {
  const errors = {}

  const check = (key, error) => {
    if (error) errors[key] = error
  }

  check('firstName',       validators.firstName(data.firstName))
  check('lastName',        validators.lastName(data.lastName))
  check('email',           validators.email(data.email))
  check('cpf',             validators.cpf(data.cpf))
  check('birthDate',       validators.birthDate(data.birthDate))
  check('phone',           validators.phone(data.phoneDDD, data.phoneNumber))
  check('password',        validators.password(data.password))
  check('confirmPassword', validators.confirmPassword(data.password, data.confirmPassword))
  check('terms',           validators.terms(data.termsAccepted))

  return { errors, isValid: Object.keys(errors).length === 0 }
}

// ── Submissão (integração com API) ─────────────────────────────────────────

import { apiRegister, apiLogin, saveToken } from '../services/api.js'

/**
 * Monta o payload e envia o cadastro para a API.
 * @param {Object} data - Dados validados do formulário
 */
export async function submitRegister(data) {
  const telefone = `(${data.phoneDDD}) ${data.phoneNumber}`

  return apiRegister({
    nome:          `${data.firstName} ${data.lastName}`.trim(),
    email:         data.email,
    senha:         data.password,
    telefone,
    provedor_auth: 'local',
  })
}

/**
 * Inicia o fluxo OAuth social para cadastro.
 * Substitua pelo SDK real (Google Identity Services / Facebook Login SDK).
 *
 * @param {'google'|'facebook'} provider
 */
export async function submitSocialLogin(provider) {
  // ── Exemplo Google (descomente e configure quando o back estiver pronto)
  // google.accounts.id.initialize({
  //   client_id: 'SEU_CLIENT_ID.apps.googleusercontent.com',
  //   callback: async (response) => {
  //     await apiRegister({ provedor_auth: 'google', token: response.credential })
  //   },
  // })
  // google.accounts.id.prompt()

  // ── Exemplo Facebook (descomente e configure quando o back estiver pronto)
  // FB.login((response) => {
  //   if (response.authResponse) {
  //     apiRegister({ provedor_auth: 'facebook', token: response.authResponse.accessToken })
  //   }
  // }, { scope: 'public_profile,email' })

  // Mock temporário enquanto o OAuth não está configurado
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const name = provider === 'google' ? 'Google' : 'Facebook'
  return { success: true, message: `Cadastro com ${name}: configure o SDK OAuth.` }
}
