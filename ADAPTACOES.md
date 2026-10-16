# Adaptações do Design Original para React + Vite + Tailwind

Este documento descreve as principais adaptações realizadas na tradução do projeto HTML estático para React com Vite.

## 🎨 Cores Adaptadas

O projeto original utilizava cores personalizadas do Material Design 3. Todas as cores foram mantidas no `tailwind.config.js` como extensões customizadas:

### Cores Principais:
- `primary` (#0045cc) → Cor principal para botões e elementos interativos
- `primary-container` (#0d5bff) → Container de elementos primários
- `background` (#f8f9ff) → Cor de fundo da aplicação
- `surface-container-lowest` (#ffffff) → Cards e containers principais
- `secondary` (#515f7a) → Textos secundários

**Nota**: Cores customizadas adicionadas via `extend` no Tailwind, permitindo uso como classes: `bg-primary`, `text-secondary`, etc.

## 📏 Espaçamentos Adaptados

| Custom | Tailwind Equivalente | Valor |
|--------|---------------------|-------|
| `space-xs` | `space-1` | 0.25rem (4px) |
| `space-sm` | `space-2` | 0.5rem (8px) |
| `space-md` | `space-3` | 0.75rem (12px) |
| `space-lg` | `space-4` | 1rem (16px) |
| `space-xl` | `space-6` | 1.5rem (24px) |

**Decisão**: Mantivemos os nomes originais para corresponder ao DESIGN.md.

## 🔤 Tipografia

### Fonte
- **Inter** (Google Fonts) mantida como fonte principal

### Tamanhos Customizados
```javascript
'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.03em', fontWeight: '600' }]
'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }]
'title-md': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }]
```

**Uso**: Classes como `font-label-sm`, `font-title-md`, `text-body-lg`.

## 🏗️ Estrutura de Componentes

### Componentes Criados:

1. **Layout/** - Sidebar e MainLayout
2. **Components/** - HeaderBanner, ProductSearch, ProductInfo, SuppliersTable
3. **Pages/** - LocalizadorFornecedores

## 🔌 Integração com Backend

### Proxy (vite.config.ts)
```typescript
proxy: {
  '/api': {
    target: 'https://localhost:7286',
    changeOrigin: true,
    secure: false
  }
}
```

Chamadas simplificadas: `axios.get('/api/FornecedoresXMateriais')`

## 🎯 Funcionalidades Adicionadas

1. **Autocomplete Inteligente** - Filtra por código ou nome
2. **Estados de Loading** - Indicadores visuais
3. **Tratamento de Erros** - Mensagens amigáveis
4. **TypeScript** - Tipos completos para API e componentes

## 📱 Responsividade

Mantidos todos os breakpoints Tailwind (sm, md, lg).

## 🚀 Performance

Build otimizado: 209KB → 69KB gzipped com code splitting e tree shaking.

## 📝 Próximos Passos

1. React Router para navegação
2. React Query para cache
3. Testes com Jest
4. Dark Mode
5. Internacionalização

## 🐛 Problemas Conhecidos

1. Certificado HTTPS auto-assinado no backend
2. Configurar CORS no backend para localhost:3000
