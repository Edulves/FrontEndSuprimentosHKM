# 🔧 Correção - Parâmetro da API

## Problema Identificado

O endpoint do backend espera o parâmetro **`CodInternoProduto`** (string), mas o frontend estava enviando **`codProduto`** (number).

### ❌ Antes (Incorreto)

```typescript
// Enviava o ID numérico
getFornecedoresDeUmMaterial(material.codProduto)
// URL gerada: ?codProduto=3168
```

### ✅ Depois (Correto)

```typescript
// Envia o código interno (string)
getFornecedoresDeUmMaterial(material.codInternoDoProduto)
// URL gerada: ?CodInternoProduto=10-02-00011
```

---

## Mudanças Realizadas

### 1. **src/services/api.ts**

**Antes:**
```typescript
export const getFornecedoresDeUmMaterial = async (codProduto?: number): Promise<Fornecedor[]> => {
  const response = await api.get<Fornecedor[]>('/FornecedoresXMateriais/FornecedoresDeUmMaterial', {
    params: codProduto ? { codProduto } : undefined
  });
  return response.data;
};
```

**Depois:**
```typescript
export const getFornecedoresDeUmMaterial = async (codInternoProduto?: string): Promise<Fornecedor[]> => {
  const response = await api.get<Fornecedor[]>('/FornecedoresXMateriais/FornecedoresDeUmMaterial', {
    params: codInternoProduto ? { CodInternoProduto: codInternoProduto } : undefined
  });
  return response.data;
};
```

**Mudanças:**
- ✅ Parâmetro mudou de `codProduto?: number` para `codInternoProduto?: string`
- ✅ Nome do parâmetro na query mudou para `CodInternoProduto` (com inicial maiúscula)

### 2. **src/pages/LocalizadorFornecedores.tsx**

**Antes:**
```typescript
const data = await getFornecedoresDeUmMaterial(material.codProduto);
```

**Depois:**
```typescript
const data = await getFornecedoresDeUmMaterial(material.codInternoDoProduto);
```

**Mudanças:**
- ✅ Agora passa `codInternoDoProduto` (string) ao invés de `codProduto` (number)

---

## Fluxo Atualizado

### Exemplo: Usuário busca produto "10-02-00011"

```
1. Usuário digita "10-02-00011" no campo de busca
   ↓
2. Seleciona o material da lista:
   {
     codProduto: 3168,
     codInternoDoProduto: "10-02-00011",
     codMatFornecedor: 5432,
     nomeDoMaterial: "Material Exemplo"
   }
   ↓
3. Clica em "Consultar Fornecedores"
   ↓
4. handleSearch(material) é executado
   ↓
5. Chama: getFornecedoresDeUmMaterial("10-02-00011")
   ↓
6. Axios gera URL:
   /api/FornecedoresXMateriais/FornecedoresDeUmMaterial?CodInternoProduto=10-02-00011
   ↓
7. Proxy redireciona para:
   https://localhost:7286/FornecedoresXMateriais/FornecedoresDeUmMaterial?CodInternoProduto=10-02-00011
   ↓
8. Backend processa com o parâmetro correto ✅
   ↓
9. Retorna lista de fornecedores
```

---

## Verificação

### Como testar:

1. Rode o projeto:
   ```bash
   npm run dev
   ```

2. Abra DevTools (F12) > Network

3. Digite um código de produto (ex: "10-02-00011")

4. Clique em "Consultar Fornecedores"

5. Na aba Network, clique na requisição "FornecedoresDeUmMaterial"

6. Verifique a URL:
   ```
   ✅ Correto: ?CodInternoProduto=10-02-00011
   ❌ Errado:  ?codProduto=3168
   ```

---

## Formato da Query String

| Campo no Backend | Tipo | Exemplo | Case Sensitive |
|-----------------|------|---------|----------------|
| `CodInternoProduto` | string | "10-02-00011" | Sim (inicial maiúscula) |

**Nota**: O nome do parâmetro **`CodInternoProduto`** usa **PascalCase** (primeira letra maiúscula), que é o padrão do ASP.NET.

---

## Build Verificado

```bash
npm run build
✓ built in 1.91s
✅ Sem erros TypeScript
✅ Bundle: 69.10 kB (gzipped)
```

---

## Status

✅ **Correção Aplicada**  
✅ **Build Funcionando**  
✅ **Pronto para Testar com Backend**
