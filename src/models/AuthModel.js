/**
 * AuthModel
 *
 * Validações e chamadas de API para o fluxo de auth:
 *  - Validação de celular (DDD + número)
 *  - Envio e verificação do código SMS via Twilio (backend)
 *  - Validação de e-mail + senha + nome
 *  - Envio e verificação do código de e-mail (backend)
 *  - Cadastro completo do usuário
 */

import {
  apiSendSms,
  apiVerifySms,
  apiSendEmailCode,
  apiVerifyEmailCode,
  apiRegister,
} from '../services/api.js'

// ── Validadores ────────────────────────────────────────────────────────────

export function validatePhone(ddd, number) {
  const d = (ddd    || '').replace(/\D/g, '')
  const n = (number || '').replace(/\D/g, '')
  if (!d || d.length < 2)  return 'Informe o DDD'
  if (!n || n.length < 8)  return 'Informe o número completo (mínimo 8 dígitos)'
  return null
}

export function validateCode(code) {
  if (!code || code.replace(/\D/g, '').length < 6) return 'Digite os 6 dígitos do código'
  return null
}

export function validateName(value) {
  if (!value || value.trim().length < 2) return 'Informe seu nome completo'
  return null
}

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Informe seu e-mail'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'E-mail inválido'
  return null
}

export function validatePassword(value) {
  if (!value || value.length < 8) return 'A senha deve ter ao menos 8 caracteres'
  return null
}

// ── Formatação do número completo ──────────────────────────────────────────

export function formatPhoneDisplay(ddd, number) {
  const d = (ddd    || '').replace(/\D/g, '')
  const n = (number || '').replace(/\D/g, '')
  return `(${d}) ${n}`
}

export function buildPhoneString(ddd, number) {
  const d = (ddd    || '').replace(/\D/g, '')
  const n = (number || '').replace(/\D/g, '')
  return `${d}${n}`
}

// ── Máscara de celular ─────────────────────────────────────────────────────

export function maskPhoneNumber(value) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 4) return d
  if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

// ── Chamadas de API ────────────────────────────────────────────────────────

/**
 * Envia código SMS para o celular informado.
 * @param {string} phone - número completo com DDD, sem formatação especial
 */
export async function sendSmsCode(phone) {
  return apiSendSms(phone)
}

/**
 * Verifica o código SMS informado pelo usuário.
 * @param {string} phone - número completo com DDD
 * @param {string} code  - 6 dígitos
 */
export async function verifySmsCode(phone, code) {
  return apiVerifySms(phone, code)
}

/**
 * Registra o usuário e envia código de verificação para o e-mail.
 * O usuário já tem celular verificado neste ponto.
 * @param {{ name: string, email: string, password: string, phone: string }} data
 */
export async function registerAndSendEmailCode(data) {
  return apiRegister({
    nome:          data.name,
    email:         data.email,
    senha:         data.password,
    telefone:      data.phone,
    provedor_auth: 'local',
  })
}

/**
 * Reenvia o código de verificação de e-mail para a conta já cadastrada.
 * @param {string} email
 */
export async function resendEmailCode(email) {
  return apiSendEmailCode(email)
}

/**
 * Verifica o código de e-mail.
 * @param {string} email
 * @param {string} code - 6 dígitos
 */
export async function verifyEmailCode(email, code) {
  return apiVerifyEmailCode(email, code)
}
