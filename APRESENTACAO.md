# Guia de Apresentação para o Professor

## Arquitetura geral

O projeto é um **SPA (Single Page Application)** feito em JavaScript puro, sem frameworks.
A troca de telas é feita pelo hash da URL (ex: `#/home`, `#/restaurante/dashboard`).
Não há recarregamento de página — tudo acontece dinamicamente no DOM.

Padrão usado: **MVC (Model - View - Controller)**
- **Model** → regras de validação e dados (`src/models/`)
- **View** → monta o HTML e expõe eventos (`src/views/`)
- **Controller** → orquestra chamadas à API e à view (`src/controllers/`)

---

## Arquivo central: `src/main.js`

É o ponto de entrada de tudo. Ele:
- Importa todos os controllers e views
- Define todas as rotas com seus guards de autenticação
- Instancia o `Router` e o singleton da `Sacola`

```js
// Exemplo de rota com guard
'/home': () => {
  if (!getToken()) {
    router.navigate('/auth')
    return { init() {}, destroy() {} }
  }
  const view = new HomeView(app)
  return new HomeController(view, router)
},
```

---

## Arquivo de rotas: `src/router/Router.js`

Escuta mudanças no hash da URL (`hashchange`) e instancia o controller correto.
Destrói o controller anterior antes de criar o novo.

---

## Arquivo de API: `src/services/api.js`

Centraliza **todas** as chamadas HTTP ao backend.
Tem duas funções internas:
- `request()` — usa o token do **usuário** (`ifood_token`)
- `requestRest()` — usa o token do **restaurante** (`ifood_restaurante_token`)

---

## Fluxo 1: Cadastro e login do usuário

| Passo | Arquivo |
|---|---|
| Tela inicial com botões Google, Facebook, Celular, Email | `AuthView.js` + `AuthController.js` |
| Digitar celular + código SMS | `PhoneVerifyView.js` + `PhoneVerifyController.js` |
| Digitar email + código email | `EmailInputView.js` + `EmailInputController.js` |
| Preencher nome e criar conta | `EmailVerifyView.js` + `EmailVerifyController.js` |
| Login com Google (verificar celular) | `OAuthPhoneView.js` + `OAuthPhoneController.js` |
| Home logada | `HomeView.js` + `HomeController.js` |

**Em desenvolvimento:** os campos de código OTP são preenchidos automaticamente com números aleatórios e o backend aceita qualquer código via rota `/dev-bypass`.

---

## Fluxo 2: Home → Restaurante → Sacola

| Passo | Arquivo |
|---|---|
| Home com lista de restaurantes e busca | `HomeView.js` + `HomeController.js` |
| Busca conectada ao backend (`GET /produtos/busca`) | `HomeController._buscarProdutos()` |
| Tela do restaurante com cardápio | `RestauranteClienteView.js` + `RestauranteClienteController.js` |
| Clicar no `+` abre modal de observação | `RestauranteClienteView.showObs()` |
| Adicionar item com observação à sacola | `SacolaController.adicionarItem()` |
| Drawer da sacola (abre em qualquer tela) | `SacolaView.js` + `SacolaController.js` |
| Badge do carrinho atualiza automaticamente | `SacolaController._atualizar()` |

A sacola é um **singleton** — instanciada uma vez no `main.js` e compartilhada via `window._sacola`.

---

## Fluxo 3: Perfil e endereços do usuário

| Passo | Arquivo |
|---|---|
| Editar nome, telefone, CPF | `UsuarioPerfilView.js` + `UsuarioPerfilController.js` |
| Excluir conta | `UsuarioPerfilController._handleDeletar()` |
| Listar, adicionar, editar, remover endereços | `EnderecosView.js` + `EnderecosController.js` |
| Busca automática de endereço pelo CEP | `EnderecosController._handleBuscarCep()` via ViaCEP |

---

## Fluxo 4: Portal do Restaurante

### Cadastro
| Passo | Arquivo |
|---|---|
| Landing do portal | `RestauranteLandingView.js` + `RestauranteLandingController.js` |
| Digitar email + código | `RestauranteEmailView.js` + `RestauranteEmailController.js` |
| Preencher dados (nome, telefone, categoria) | `RestauranteDadosView.js` + `RestauranteDadosController.js` |
| Preencher endereço + finalizar | `RestauranteEnderecoView.js` + `RestauranteEnderecoController.js` |

### Login
| Passo | Arquivo |
|---|---|
| Digitar email + código | `RestauranteLoginView.js` + `RestauranteLoginController.js` |

### Dashboard e operações
| Passo | Arquivo |
|---|---|
| Dashboard com métricas e ações rápidas | `RestauranteDashboardView.js` + `RestauranteDashboardController.js` |
| Editar perfil e endereço do restaurante | `RestaurantePerfilView.js` + `RestaurantePerfilController.js` |
| Gerenciar cardápios (criar, editar, excluir) | `CardapioView.js` + `CardapioController.js` |
| Gerenciar itens do cardápio | `CardapioItemView.js` + `CardapioItemController.js` |

---

## Dois tokens separados

| Token | Chave no localStorage | Usado por |
|---|---|---|
| Usuário | `ifood_token` | `request()` em `api.js` |
| Restaurante | `ifood_restaurante_token` | `requestRest()` em `api.js` |

Isso permite que o sistema saiba distinguir se quem está autenticado é um cliente ou um restaurante.

---

## Estrutura de pastas resumida

```
src/
├── main.js                  → ponto de entrada, rotas, guards
├── router/
│   └── Router.js            → troca de telas pelo hash da URL
├── services/
│   └── api.js               → todas as chamadas HTTP ao backend
├── models/
│   ├── AuthModel.js         → validações de telefone, email, código
│   └── HomeModel.js         → adaptação dos dados do restaurante para a home
├── views/                   → arquivos que montam o HTML
├── controllers/             → arquivos que conectam view ↔ API
└── styles/                  → CSS por tela
```
