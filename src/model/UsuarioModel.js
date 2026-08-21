const BASE_URL = 'http://localhost:5000/usuarios';

export const UsuarioModel = {
  async listar() {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error('Erro ao listar usuários');
    return res.json();
  },

  async buscar(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Usuário não encontrado');
    return res.json();
  },

  async criar(dados) {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.erro || 'Erro ao criar usuário');
    return body;
  },

  async atualizar(id, dados) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.erro || 'Erro ao atualizar usuário');
    return body;
  },

  async deletar(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const body = await res.json();
    if (!res.ok) throw new Error(body.erro || 'Erro ao deletar usuário');
    return body;
  },
};
