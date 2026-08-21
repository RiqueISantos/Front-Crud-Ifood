import { UsuarioModel } from '../model/UsuarioModel.js';
import { UsuarioView } from '../view/UsuarioView.js';

export const UsuarioController = {
  async init() {
    UsuarioView.modoCriacao();
    await this.carregarLista();

    UsuarioView.bindSalvar((dados) => this.salvar(dados));
    UsuarioView.bindCancelar(() => UsuarioView.modoCriacao());
    UsuarioView.bindEditar((id) => this.carregarEdicao(id));
    UsuarioView.bindDeletar((id) => this.deletar(id));
  },

  async carregarLista() {
    try {
      const usuarios = await UsuarioModel.listar();
      UsuarioView.renderizarTabela(usuarios);
    } catch (err) {
      UsuarioView.mostrarErro(err.message);
    }
  },

  async salvar(dados) {
    try {
      if (dados.id) {
        // Atualização — só envia senha se preenchida
        const payload = { nome: dados.nome, email: dados.email };
        if (dados.senha) payload.senha = dados.senha;
        await UsuarioModel.atualizar(dados.id, payload);
        UsuarioView.mostrarMensagem('Usuário atualizado com sucesso!');
      } else {
        await UsuarioModel.criar({ nome: dados.nome, email: dados.email, senha: dados.senha });
        UsuarioView.mostrarMensagem('Usuário criado com sucesso!');
      }
      UsuarioView.modoCriacao();
      await this.carregarLista();
    } catch (err) {
      UsuarioView.mostrarErro(err.message);
    }
  },

  async carregarEdicao(id) {
    try {
      const usuario = await UsuarioModel.buscar(id);
      UsuarioView.modoEdicao(usuario);
    } catch (err) {
      UsuarioView.mostrarErro(err.message);
    }
  },

  async deletar(id) {
    if (!confirm(`Deseja realmente deletar o usuário ${id}?`)) return;
    try {
      await UsuarioModel.deletar(id);
      UsuarioView.mostrarMensagem('Usuário deletado com sucesso!');
      await this.carregarLista();
    } catch (err) {
      UsuarioView.mostrarErro(err.message);
    }
  },
};
