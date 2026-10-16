// Tipos baseados nos endpoints do backend

export interface Material {
  codProduto: number;
  codInternoDoProduto: string;
  codMatFornecedor: number;
  nomeDoMaterial: string;
}

export interface Fornecedor {
  codFornecedor: number;
  nomeFornecedor: string;
  codMatFornecedor: string;
  nomeDoProduto: string;
}
