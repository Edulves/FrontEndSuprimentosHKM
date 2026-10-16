# 🚀 Guia de Início Rápido

## Pré-requisitos

✅ Node.js 18 ou superior instalado  
✅ Backend ASP.NET rodando em `https://localhost:7286`  
✅ Git (opcional)

## Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar em Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:3000**

### 3. Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `/dist`

### 4. Preview da Build

```bash
npm run preview
```

## 🔧 Configuração do Backend

O frontend espera o backend em `https://localhost:7286`.

Se seu backend estiver em outra porta, edite `vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:SUAPORTA', // ← Altere aqui
    ...
  }
}
```

## 📡 Endpoints Utilizados

1. **GET** `/FornecedoresXMateriais` - Lista de materiais
2. **GET** `/FornecedoresXMateriais/FornecedoresDeUmMaterial` - Fornecedores de um material

## 🐛 Resolução de Problemas

### Erro de CORS
Adicione no backend (ASP.NET):

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

app.UseCors();
```

### Erro de Certificado HTTPS
O vite.config.ts já está configurado com `secure: false` para aceitar certificados auto-assinados.

### Backend não conecta
1. Verifique se o backend está rodando
2. Teste direto no navegador: `https://localhost:7286/FornecedoresXMateriais`
3. Verifique o console do navegador (F12) para erros detalhados

## 📂 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── Layout/        # Layout (Sidebar, MainLayout)
│   ├── HeaderBanner.tsx
│   ├── ProductSearch.tsx
│   ├── ProductInfo.tsx
│   └── SuppliersTable.tsx
├── pages/             # Páginas
│   └── LocalizadorFornecedores.tsx
├── services/          # Serviços API
│   └── api.ts
├── types/             # Tipos TypeScript
│   └── api.ts
└── App.tsx            # Componente raiz
```

## 🎨 Personalização

### Alterar Cores
Edite `tailwind.config.js` na seção `extend.colors`

### Alterar Espaçamentos
Edite `tailwind.config.js` na seção `extend.spacing`

### Adicionar Novos Componentes
```bash
# Criar novo componente
touch src/components/MeuComponente.tsx
```

## 📚 Comandos Úteis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview build
npm run lint     # Verificar código
```

## 💡 Dicas

- Use a extensão **Tailwind CSS IntelliSense** no VS Code
- Use **React Developer Tools** para debug
- Console do navegador (F12) mostra erros de API
- Hot reload está ativado - mudanças aparecem automaticamente

## 🎯 Próximos Passos

1. Testar com dados reais do backend
2. Adicionar mais filtros na tabela
3. Implementar paginação
4. Adicionar exportação de dados (Excel/CSV)
5. Implementar autenticação

## 📞 Suporte

Para problemas técnicos, verifique:
- Console do navegador (F12)
- Terminal onde o `npm run dev` está rodando
- Logs do backend

---

**Versão**: 1.0.0  
**Última atualização**: Outubro 2026
