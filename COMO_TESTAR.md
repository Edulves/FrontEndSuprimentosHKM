# 🧪 Como Testar o Projeto

## Pré-requisitos

1. ✅ Node.js instalado
2. ✅ Backend ASP.NET rodando em `https://localhost:7286`
3. ✅ Navegador moderno (Chrome, Edge, Firefox)

## Passo a Passo

### 1️⃣ Instalar Dependências

```bash
npm install
```

**Tempo estimado**: 1-2 minutos

### 2️⃣ Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

**Resultado esperado**:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 3️⃣ Abrir no Navegador

Acesse: **http://localhost:3000**

## 🎯 Checklist de Testes

### Interface Visual

- [ ] **Sidebar aparece à esquerda**
  - Logo Vértice Supply visível
  - Item "Localizar Fornecedores" destacado em azul

- [ ] **Banner de cabeçalho**
  - Badges "Mapeamento De-Para ERP" e "API v1 Ativa"
  - Título "Localizar Fornecedores por Produto"
  - Descrição com código `codInternoDoProduto`

- [ ] **Campo de busca**
  - Ícone de lupa à esquerda
  - Placeholder "Digite ou selecione o código do produto..."
  - Botão "Consultar Fornecedores" à direita

### Funcionalidade (COM Backend)

#### Teste 1: Carregar Materiais
- [ ] Ao abrir a página, deve carregar lista de materiais
- [ ] Campo de busca deve estar habilitado
- [ ] Nenhuma mensagem de erro deve aparecer

#### Teste 2: Autocomplete
- [ ] Digitar no campo de busca
- [ ] Lista de sugestões deve aparecer
- [ ] Sugestões devem filtrar enquanto digita
- [ ] Clicar em uma sugestão deve preencher o campo

#### Teste 3: Buscar Fornecedores
- [ ] Selecionar um produto
- [ ] Clicar em "Consultar Fornecedores"
- [ ] Card de informações do produto deve aparecer:
  - Código do Produto
  - Código Interno
  - Cód. Material Padrão
  - Nome do Material
- [ ] Tabela de fornecedores deve carregar
- [ ] Contador "Total retornado: X fornecedores" deve aparecer

#### Teste 4: Tabela de Fornecedores
- [ ] Colunas: Código, Nome, Cód. Material, Nome do Produto
- [ ] Linhas devem ter hover (fundo cinza claro)
- [ ] Códigos devem ter badges cinza
- [ ] Rodapé com resumo deve aparecer

### Funcionalidade (SEM Backend)

Se o backend não estiver rodando:

- [ ] **Mensagem de erro deve aparecer**:
  - Box vermelho/rosa
  - Ícone de erro
  - Texto: "Erro ao carregar lista de materiais..."
  - Subtexto: "Backend esperado em: https://localhost:7286"

- [ ] Campo de busca deve estar desabilitado

### Responsividade

#### Desktop (> 1024px)
- [ ] Sidebar visível à esquerda (256px)
- [ ] Conteúdo principal com margem esquerda
- [ ] Card de produto em grid 4 colunas
- [ ] Tabela com todas colunas visíveis

#### Tablet (768px - 1024px)
- [ ] Sidebar deve colapsar ou virar drawer
- [ ] Card de produto em grid 2 colunas
- [ ] Tabela responsiva

#### Mobile (< 768px)
- [ ] Layout em coluna única
- [ ] Card de produto em coluna única
- [ ] Tabela com scroll horizontal

### Estados de Loading

- [ ] **Loading inicial**: Spinner ao carregar materiais
- [ ] **Loading de busca**: 
  - Botão muda para "Consultando..."
  - Botão desabilitado
  - Spinner na tabela

### Console do Navegador

Abra o DevTools (F12) e verifique:

- [ ] **Sem erros no Console** (aba Console)
- [ ] **Requisições bem-sucedidas** (aba Network):
  - GET `/api/FornecedoresXMateriais` → 200 OK
  - GET `/api/FornecedoresXMateriais/FornecedoresDeUmMaterial` → 200 OK

## 🐛 Problemas Comuns

### Erro: "Cannot GET /api/FornecedoresXMateriais"

**Causa**: Backend não está rodando

**Solução**:
1. Vá para a pasta do backend
2. Execute o backend:
   ```bash
   cd ../backendSuprimentosHKM
   dotnet run
   ```

### Erro: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa**: CORS não configurado no backend

**Solução**: Adicionar no `Program.cs` do backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

app.UseCors(); // Antes de app.UseAuthorization()
```

### Erro: "certificate has expired"

**Causa**: Certificado HTTPS auto-assinado

**Solução**: Já configurado no `vite.config.ts` com `secure: false`

### Campo de busca não mostra sugestões

**Verificar**:
1. Backend retornou dados?
2. Formato do JSON está correto?
3. Console do navegador mostra erros?

## 📊 Testes Avançados

### Teste de Performance

```bash
npm run build
npm run preview
```

Abra o DevTools > Lighthouse:
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90

### Teste de Build

```bash
npm run build
```

Verificar:
- [ ] Build completa sem erros
- [ ] Arquivos em `/dist`
- [ ] Tamanho do bundle ~69KB (gzipped)

### Teste de Lint

```bash
npm run lint
```

Verificar:
- [ ] 0 erros
- [ ] 0 warnings

## ✅ Resultado Esperado

Ao final dos testes, você deve ter:

1. ✅ Aplicação rodando em `localhost:3000`
2. ✅ Sidebar e layout corretos
3. ✅ Busca funcionando com autocomplete
4. ✅ Dados do produto exibidos
5. ✅ Tabela de fornecedores populada
6. ✅ Sem erros no console
7. ✅ Design fiel ao modelo original

## 📸 Capturas de Tela (Opcional)

Para validação visual, compare com:
- `localizador_de_fornecedores/screen.png`

As diferenças aceitáveis:
- Dados diferentes (backend real vs mockup)
- Fontes podem ter pequenas variações
- Cores devem ser idênticas

## 🎓 Dica Final

Para melhor experiência de desenvolvimento:

1. Instale extensões do VS Code:
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer

2. Use React DevTools no navegador

3. Monitore o console sempre

---

**Boa sorte nos testes! 🚀**
