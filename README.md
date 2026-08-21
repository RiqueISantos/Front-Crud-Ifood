# CRUD de Usuários — Frontend

Interface web para gerenciamento de usuários, desenvolvida com **JavaScript puro**, **Vite** e arquitetura **MVC**. Consome a API REST do backend Flask.

---

## Tecnologias

- JavaScript (ES Modules)
- Vite 5
- HTML5 / CSS3

---

## Estrutura do projeto

```
front-crud/
├── index.html                        # Página principal
├── package.json
└── src/
    ├── main.js                       # Entry point — inicializa o controller
    ├── style.css                     # Estilos globais
    ├── model/
    │   └── UsuarioModel.js           # Model — chamadas fetch à API
    ├── view/
    │   └── UsuarioView.js            # View — manipulação do DOM
    └── controller/
        └── UsuarioController.js      # Controller — orquestra model e view
```

---

## Arquitetura MVC

| Camada         | Arquivo                    | Responsabilidade                                      |
| -------------- | -------------------------- | ----------------------------------------------------- |
| **Model**      | `UsuarioModel.js`          | Toda comunicação HTTP com a API (fetch)               |
| **View**       | `UsuarioView.js`           | Renderização da tabela, formulário e mensagens        |
| **Controller** | `UsuarioController.js`     | Liga model e view, gerencia o fluxo das operações     |

---

## Funcionalidades

- Listar todos os usuários em tabela
- Criar novo usuário (nome, e-mail, senha)
- Editar usuário existente (senha opcional na edição)
- Deletar usuário com confirmação
- Feedback visual de sucesso e erro

---

## Como rodar

### Pré-requisito

O backend precisa estar rodando em `http://localhost:5000`.  
Veja as instruções em [`crud/README.md`](../crud/README.md).

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

---

## Build para produção

```bash
npm run build
npm run preview
```

---

## Configuração da API

A URL base da API está definida em `src/model/UsuarioModel.js`:

```js
const BASE_URL = 'http://localhost:5000/usuarios';
```

Altere conforme o endereço do seu backend.
