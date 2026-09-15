/**
 * api.js — Serviço centralizado de comunicação com o backend
 *
 * Toda requisição HTTP passa por aqui.
 * Os Models importam funções deste arquivo em vez de fazer fetch diretamente.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Wrapper sobre fetch que:
 *  - Adiciona Content-Type: application/json
 *  - Adiciona Authorization: Bearer <token> quando existir
 *  - Lança erro com a mensagem do backend em caso de status >= 400
 *
 * @param {string} path  - ex: '/usuarios/cadastro'
 * @param {RequestInit} options
 * @returns {Promise<any>} - JSON da resposta
 */
async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Tenta extrair o corpo como JSON independente do status
  let body = null
  try {
    body = await response.json()
  } catch {
    // resposta sem corpo (ex: 204)
  }

  if (!response.ok) {
    // Usa a mensagem do backend se disponível
    const message = body?.erro ?? body?.message ?? `Erro ${response.status}`
    throw new Error(message)
  }

  return body
}

// ── Token JWT ──────────────────────────────────────────────────────────────

/** Salva o token no localStorage */
export function saveToken(token) {
  localStorage.setItem('ifood_token', token)
}

/** Recupera o token do localStorage */
export function getToken() {
  return localStorage.getItem('ifood_token')
}

/** Remove o token (logout) */
export function clearToken() {
  localStorage.removeItem('ifood_token')
}

/** Retorna true se há token salvo */
export function isAuthenticated() {
  return Boolean(getToken())
}

// ── Endpoints de usuário ───────────────────────────────────────────────────

/**
 * Cadastra um novo usuário.
 * @param {{ nome: string, email: string, telefone: string }} data
 */
export async function apiRegister(data) {
  return request('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Autentica um usuário via código OTP e salva o token JWT.
 * @param {{ identificador: string, codigo: string, canal?: string }} data
 */
export async function apiLogin(data) {
  const result = await request('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (result.access_token) {
    saveToken(result.access_token)
  }
  return result
}

/**
 * Solicita o envio de código OTP para login.
 * @param {{ identificador: string, canal?: string }} data
 */
export async function apiRequestLoginCode(data) {
  return request('/usuarios/login/solicitar', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Busca dados de um usuário pelo ID.
 * @param {number} id
 */
export async function apiGetUser(id) {
  return request(`/usuarios/${id}`)
}

/**
 * Deleta a conta do usuário autenticado pelo ID.
 * Requer token JWT válido.
 * @param {number} id
 */
export async function apiDeleteAccount(id) {
  const result = await request(`/usuarios/${id}`, { method: 'DELETE' })
  clearToken()
  return result
}

/**
 * Atualiza dados do usuário autenticado pelo ID.
 * @param {number} id
 * @param {{ nome?: string, telefone?: string }} data
 */
export async function apiUpdateUser(id, data) {
  return request(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ── Endpoints de verificação de celular (antes do cadastro) ───────────────

/**
 * Envia código SMS via WhatsApp para um número avulso.
 * @param {string} telefone - apenas dígitos com DDD, sem +55
 */
export async function apiSendSms(telefone) {
  return request('/usuarios/sms/enviar', {
    method: 'POST',
    body: JSON.stringify({ telefone }),
  })
}

/**
 * Verifica o código SMS de um número avulso.
 * @param {string} telefone
 * @param {string} codigo - 6 dígitos
 */
export async function apiVerifySms(telefone, codigo) {
  return request('/usuarios/sms/verificar', {
    method: 'POST',
    body: JSON.stringify({ telefone, codigo }),
  })
}

// ── Endpoints de verificação de e-mail ────────────────────────────────────

/**
 * Envia código de verificação para um e-mail.
 * @param {string} email
 */
export async function apiSendEmailCode(email) {
  return request('/usuarios/email/enviar', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/**
 * Verifica o código de e-mail.
 * @param {string} email
 * @param {string} codigo - 6 dígitos
 */
export async function apiVerifyEmailCode(email, codigo) {
  return request('/usuarios/email/verificar', {
    method: 'POST',
    body: JSON.stringify({ email, codigo }),
  })
}

// ── Endpoints de restaurante ───────────────────────────────────────────────

/**
 * Etapa 1 do cadastro de restaurante: envia código de verificação para o e-mail.
 * @param {string} email
 */
export async function apiRestauranteSolicitarCadastro(email) {
  return request('/restaurantes/cadastro/solicitar', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/**
 * Etapa 2 do cadastro de restaurante: confirma código e persiste os dados.
 * @param {{ email, codigo, nome, telefone, categoria_principal, cep, numero, complemento?, taxa_entrega?, tempo_estimado? }} data
 */
export async function apiRestauranteConfirmarCadastro(data) {
  const result = await request('/restaurantes/cadastro/confirmar', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (result.access_token) {
    saveToken(result.access_token)
  }
  return result
}

/**
 * Etapa 1 do login de restaurante: envia código de verificação para o e-mail.
 * @param {string} email
 */
export async function apiRestauranteSolicitarLogin(email) {
  return request('/restaurantes/login/solicitar', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/**
 * Etapa 2 do login de restaurante: confirma código e retorna o JWT.
 * @param {string} email
 * @param {string} codigo
 */
export async function apiRestauranteLogin(email, codigo) {
  const result = await request('/restaurantes/login', {
    method: 'POST',
    body: JSON.stringify({ email, codigo }),
  })
  if (result.access_token) {
    saveToken(result.access_token)
  }
  return result
}

/**
 * Busca dados de um restaurante pelo ID.
 * @param {number} id
 */
export async function apiGetRestaurante(id) {
  return request(`/restaurantes/${id}`)
}

/**
 * Salva token de restaurante separado do token de usuário.
 * @param {string} token
 */
export function saveRestauranteToken(token) {
  localStorage.setItem('ifood_restaurante_token', token)
}

/**
 * Recupera o token de restaurante.
 */
export function getRestauranteToken() {
  return localStorage.getItem('ifood_restaurante_token')
}

/**
 * Remove o token de restaurante (logout).
 */
export function clearRestauranteToken() {
  localStorage.removeItem('ifood_restaurante_token')
}

// ── Endpoints de endereço ──────────────────────────────────────────────────

/**
 * Lista todos os endereços de um usuário.
 * @param {number} usuarioId
 */
export async function apiListarEnderecos(usuarioId) {
  return request(`/enderecos/usuario/${usuarioId}`)
}

/**
 * Busca um endereço pelo ID.
 * @param {number} id
 */
export async function apiGetEndereco(id) {
  return request(`/enderecos/${id}`)
}

/**
 * Salva um novo endereço para o usuário.
 * @param {{ usuario_id, tipo_endereco, cep, logradouro, numero, complemento?, bairro, cidade, uf }} data
 */
export async function apiSalvarEndereco(data) {
  return request('/enderecos/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza um endereço existente.
 * @param {number} id
 * @param {object} data
 */
export async function apiAtualizarEndereco(id, data) {
  return request(`/enderecos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta um endereço pelo ID.
 * @param {number} id
 */
export async function apiDeletarEndereco(id) {
  return request(`/enderecos/${id}`, { method: 'DELETE' })
}

/**
 * Consulta um CEP via backend (ViaCEP proxy).
 * @param {string} cep - apenas dígitos
 */
export async function apiConsultarCep(cep) {
  return request(`/enderecos/consulta-cep/${cep}`)
}

// ── Perfil do restaurante ──────────────────────────────────────────────────

/**
 * Atualiza dados do restaurante autenticado.
 * Requer token JWT do restaurante.
 * @param {number} id
 * @param {object} data
 */
export async function apiAtualizarRestaurante(id, data) {
  return request(`/restaurantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Deleta o restaurante autenticado.
 * Requer token JWT do restaurante.
 * @param {number} id
 */
export async function apiDeletarRestaurante(id) {
  return request(`/restaurantes/${id}`, { method: 'DELETE' })
}
