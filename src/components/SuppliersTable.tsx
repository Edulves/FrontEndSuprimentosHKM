import React from 'react';
import type { FornecedorDoProduto } from '../types/api';

interface SuppliersTableProps {
  fornecedores: FornecedorDoProduto[];
  codProduto: number | null;
  codInterno: string;
  isLoading: boolean;
}

const Coluna: React.FC<{ titulo: string; campo: string; className?: string }> = ({ titulo, campo, className }) => (
  <th className={`py-3.5 px-4 ${className ?? ''}`}>
    {titulo}{' '}
    <span className="font-mono text-[10px] text-outline lowercase font-normal">({campo})</span>
  </th>
);

const SuppliersTable: React.FC<SuppliersTableProps> = ({ fornecedores, codProduto, codInterno, isLoading }) => {
  if (isLoading) {
    return (
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="font-body-md text-secondary">Carregando fornecedores...</p>
          </div>
        </div>
      </section>
    );
  }

  if (codProduto === null || fornecedores.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
          <p className="font-title-md text-secondary">
            {codProduto === null
              ? 'Selecione um produto para visualizar os fornecedores'
              : 'Nenhum fornecedor encontrado nas negociações deste produto'}
          </p>
        </div>
      </section>
    );
  }

  const referencia = codInterno || String(codProduto);

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Cabeçalho da tabela */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low/50 border-b border-surface-container-high">
        <div className="flex flex-wrap items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">
            Fornecedores que negociaram este produto
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-mono text-label-sm font-normal">
            cod_produto: <strong className="text-primary font-semibold">{codProduto}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
          <span>
            Total retornado:{' '}
            <strong className="text-on-surface font-tabular-nums">{fornecedores.length} fornecedores</strong>
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
            <tr>
              <Coluna titulo="Código Fornecedor" campo="cod_fornecedor" className="w-40" />
              <Coluna titulo="Fornecedor" campo="fornecedor" />
              <Coluna titulo="Telefone" campo="telefone" className="w-52" />
              <Coluna titulo="Negociações" campo="qtde" className="w-40 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/60 font-body-sm text-body-sm">
            {fornecedores.map((f) => (
              <tr key={f.cod_fornecedor} className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3.5 px-4 font-mono text-[13px] font-semibold text-primary">{f.cod_fornecedor}</td>
                <td className="py-3.5 px-4 font-title-sm text-title-sm text-on-surface font-medium">
                  {f.fornecedor ?? '—'}
                </td>
                <td className="py-3.5 px-4 text-on-surface whitespace-nowrap">{f.telefone || '—'}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container font-mono text-[12px] text-on-surface font-semibold">
                    {f.qtde_negociacoes}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/30 border-t border-surface-container-high">
        <div className="font-label-md text-label-md text-secondary">
          Exibindo <strong>{fornecedores.length}</strong> fornecedores com negociações do produto{' '}
          <span className="font-mono text-on-surface font-semibold">{referencia}</span>
        </div>
        <span className="font-label-sm text-label-sm text-outline">Fonte: tabela de negociações</span>
      </div>
    </section>
  );
};

export default SuppliersTable;
