// Tipos do Localizador de Fornecedores (backendpython: /localizador, tabela negociacoes)

export interface ProdutoNegociado {
  cod_produto: number;
  produto: string | null;
  qtde_fornecedores: number;
  qtde_negociacoes: number;
}

export interface FornecedorDoProduto {
  cod_fornecedor: number;
  fornecedor: string | null;
  telefone: string | null;
  qtde_negociacoes: number;
}

/** O campo `produto` vem como "1-01-00005 - NOME DO PRODUTO": separa código interno e nome. */
export const separarProduto = (produto: string | null): { codInterno: string; nome: string } => {
  const texto = produto ?? '';
  const m = texto.match(/^\s*(\S+)\s+-\s+(.*)$/);
  return m ? { codInterno: m[1], nome: m[2] } : { codInterno: '', nome: texto };
};
