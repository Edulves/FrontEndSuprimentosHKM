import suprimentosApi from './suprimentosApi';
import type { FornecedorDoProduto, ProdutoNegociado } from '../types/api';

// Localizador de Fornecedores — API Python (backendpython), dados da tabela de negociações.

/** Busca produtos negociados por trecho do nome/código interno ou pelo cod_produto. */
export const buscarProdutos = async (busca: string, limite = 20): Promise<ProdutoNegociado[]> => {
  const { data } = await suprimentosApi.get<ProdutoNegociado[]>('/localizador/produtos', {
    params: { busca, limite },
  });
  return data;
};

/** Fornecedores que já negociaram o produto. */
export const getFornecedoresDoProduto = async (codProduto: number): Promise<FornecedorDoProduto[]> => {
  const { data } = await suprimentosApi.get<FornecedorDoProduto[]>(
    `/localizador/produtos/${codProduto}/fornecedores`
  );
  return data;
};
