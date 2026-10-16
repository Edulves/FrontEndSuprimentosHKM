# Frontend Suprimentos HKM

Sistema de localização de fornecedores baseado no Vértice Supply - Gestão ERP.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server extremamente rápido
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP para requisições à API

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `https://localhost:7286`

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🎨 Design System

O projeto utiliza um design system baseado no Material Design 3 com as seguintes características:

- **Cores**: Paleta personalizada de azuis corporativos
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Material Symbols Outlined
- **Espaçamento**: Grid de 4px
- **Componentes**: Baseados em padrões enterprise

## 🔌 Integração com Backend

O projeto se conecta com o backend em `https://localhost:7286` através de dois endpoints:

### GET /FornecedoresXMateriais
Retorna lista de produtos/materiais disponíveis.

**Resposta:**
```json
[
  {
    "codProduto": 1,
    "codInternoDoProduto": "string",
    "codMatFornecedor": 1,
    "nomeDoMaterial": "string"
  }
]
```

### GET /FornecedoresXMateriais/FornecedoresDeUmMaterial
Retorna fornecedores de um material específico.

**Resposta:**
```json
[
  {
    "codFornecedor": 1,
    "nomeFornecedor": "string",
    "codMatFornecedor": "string",
    "nomeDoProduto": "string"
  }
]
```

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── Layout/        # Componentes de layout (Sidebar, Header, etc)
│   ├── HeaderBanner.tsx
│   ├── ProductSearch.tsx
│   ├── ProductInfo.tsx
│   └── SuppliersTable.tsx
├── pages/             # Páginas da aplicação
│   └── LocalizadorFornecedores.tsx
├── services/          # Serviços de API
│   └── api.ts
├── types/             # Definições TypeScript
│   └── api.ts
├── App.tsx            # Componente principal
├── main.tsx           # Entry point
└── index.css          # Estilos globais
```

## 🎯 Funcionalidades

- ✅ Busca de produtos por código interno ou nome
- ✅ Autocomplete com sugestões de produtos
- ✅ Visualização de detalhes do produto selecionado
- ✅ Listagem de fornecedores do produto
- ✅ Design responsivo e acessível
- ✅ Tratamento de erros e estados de loading

## 🔐 Configuração do Proxy

O Vite está configurado para fazer proxy das requisições `/api/*` para `https://localhost:7286`.

Isso permite fazer chamadas como:
```typescript
axios.get('/api/FornecedoresXMateriais')
```

E elas serão redirecionadas para:
```
https://localhost:7286/FornecedoresXMateriais
```

## 📝 Licença

Este projeto é proprietário da HKM Suprimentos.
