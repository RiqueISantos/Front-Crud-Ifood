export const UsuarioView = {
  // --- Referências ao DOM ---
  get form() { return document.getElementById('form-usuario'); },
  get inputId() { return document.getElementById('input-id'); },
  get inputNome() { return document.getElementById('input-nome'); },
  get inputEmail() { return document.getElementById('input-email'); },
  get inputSenha() { return document.getElementById('input-senha'); },
  get btnSalvar() { return document.getElementById('btn-salvar'); },
  get btnCancelar() { return document.getElementById('btn-cancelar'); },
  get tabelaBody() { return document.getElementById('tabela-body'); },
  get feedback() { return document.getElementById('feedback'); },
  get tituloForm() { return document.getElementById('titulo-form'); },

  // --- Feedback ---
  mostrarMensagem(msg, tipo = 'sucesso') {
    const el = this.feedback;
    el.textContent = msg;
    el.className = `feedback ${tipo}`;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3500);
  },

  mostrarErro(msg) {
    this.mostrarMensagem(msg, 'erro');
  },

  // --- Tabela ---
  renderizarTabela(usuarios) {
    const tbody = this.tabelaBody;
    tbody.innerHTML = '';

    if (usuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="vazio">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    usuarios.forEach((u) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${new Date(u.criado_em).toLocaleString('pt-BR')}</td>
        <td>
          <button class="btn-editar" data-id="${u.id}">Editar</button>
          <button class="btn-deletar" data-id="${u.id}">Deletar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  // --- Formulário ---
  modoEdicao(usuario) {
    this.tituloForm.textContent = 'Editar Usuário';
    this.inputId.value = usuario.id;
    this.inputNome.value = usuario.nome;
    this.inputEmail.value = usuario.email;
    this.inputSenha.value = '';
    this.inputSenha.placeholder = 'Deixe em branco para não alterar';
    this.btnSalvar.textContent = 'Atualizar';
    this.btnCancelar.style.display = 'inline-block';
    this.inputNome.focus();
  },

  modoCriacao() {
    this.tituloForm.textContent = 'Novo Usuário';
    this.form.reset();
    this.inputId.value = '';
    this.inputSenha.placeholder = 'Senha';
    this.btnSalvar.textContent = 'Salvar';
    this.btnCancelar.style.display = 'none';
  },

  getDadosForm() {
    return {
      id: this.inputId.value || null,
      nome: this.inputNome.value.trim(),
      email: this.inputEmail.value.trim(),
      senha: this.inputSenha.value,
    };
  },

  // --- Bind de eventos ---
  bindSalvar(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.getDadosForm());
    });
  },

  bindCancelar(handler) {
    this.btnCancelar.addEventListener('click', handler);
  },

  bindEditar(handler) {
    this.tabelaBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-editar')) {
        handler(Number(e.target.dataset.id));
      }
    });
  },

  bindDeletar(handler) {
    this.tabelaBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-deletar')) {
        handler(Number(e.target.dataset.id));
      }
    });
  },
};
