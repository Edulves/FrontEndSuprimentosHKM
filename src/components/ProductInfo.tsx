import React from 'react';
import { separarProduto, type ProdutoNegociado } from '../types/api';

interface ProductInfoProps {
  produto: ProdutoNegociado | null;
}

const Card: React.FC<{ label: string; campo: string; children: React.ReactNode }> = ({ label, campo, children }) => (
  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high/80 min-w-0">
    <span className="font-label-sm text-label-sm text-secondary block">{label}</span>
    {children}
    <span className="font-mono text-[11px] text-outline block mt-0.5">{campo}</span>
  </div>
);

const ProductInfo: React.FC<ProductInfoProps> = ({ produto }) => {
  if (!produto) return null;
  const { codInterno, nome } = separarProduto(produto.produto);

  return (
    <div className="bg-surface-container-low/70 border-t border-surface-container-high px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
          Dados do Produto Selecionado
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-[12px]">
          <span className="font-bold">GET</span> /localizador/produtos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Código do Produto" campo="cod_produto">
          <span className="font-mono font-semibold text-title-md text-on-surface">{produto.cod_produto}</span>
        </Card>

        <Card label="Código Interno" campo="produto (prefixo)">
          <span className="font-mono font-semibold text-title-md text-primary">{codInterno || '—'}</span>
        </Card>

        <Card label="Nome do Produto" campo="produto">
          <span className="font-semibold text-body-md text-on-surface truncate block" title={nome}>
            {nome}
          </span>
        </Card>

        <Card label="Fornecedores / Negociações" campo="tabela negociacoes">
          <span className="font-mono font-semibold text-title-md text-on-surface">
            {produto.qtde_fornecedores}
            <span className="text-secondary font-normal"> / {produto.qtde_negociacoes}</span>
          </span>
        </Card>
      </div>
    </div>
  );
};

export default ProductInfo;
