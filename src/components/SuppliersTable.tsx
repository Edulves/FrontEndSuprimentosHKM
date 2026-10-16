import React from 'react';
import type { Fornecedor } from '../types/api';

interface SuppliersTableProps {
  fornecedores: Fornecedor[];
  codInternoDoProduto: string;
  isLoading: boolean;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ fornecedores, codInternoDoProduto, isLoading }) => {
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

  if (fornecedores.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
          <p className="font-title-md text-secondary">
            Selecione um produto para visualizar os fornecedores
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Cabeçalho da tabela */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low/50 border-b border-surface-container-high">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">
            Fornecedores que fornecem este produto
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-mono text-label-sm font-normal">
            codInternoDoProduto: <strong className="text-primary font-semibold">{codInternoDoProduto}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
          <span>
            Total retornado: <strong className="text-on-surface font-tabular-nums">{fornecedores.length} fornecedores</strong>
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-40">
                Código Fornecedor{' '}
                <span className="font-mono text-[10px] text-outline lowercase font-normal">
                  (codFornecedor)
                </span>
              </th>
              <th className="py-3.5 px-4">
                Nome do Fornecedor{' '}
                <span className="font-mono text-[10px] text-outline lowercase font-normal">
                  (nomeFornecedor)
                </span>
              </th>
              <th className="py-3.5 px-4 w-52">
                Cód. Material no Fornecedor{' '}
                <span className="font-mono text-[10px] text-outline lowercase font-normal">
                  (codMatFornecedor)
                </span>
              </th>
              <th className="py-3.5 px-4">
                Nome do Produto no Fornecedor{' '}
                <span className="font-mono text-[10px] text-outline lowercase font-normal">
                  (nomeDoProduto)
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/60 font-body-sm text-body-sm">
            {fornecedores.map((fornecedor, index) => (
              <tr
                key={`${fornecedor.codFornecedor}-${index}`}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td className="py-3.5 px-4 font-mono text-[13px] font-semibold text-primary">
                  {fornecedor.codFornecedor}
                </td>
                <td className="py-3.5 px-4 font-title-sm text-title-sm text-on-surface font-medium">
                  {fornecedor.nomeFornecedor}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded bg-surface-container font-mono text-[12px] text-on-surface font-semibold">
                    {fornecedor.codMatFornecedor}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-on-surface">
                  {fornecedor.nomeDoProduto}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/30 border-t border-surface-container-high">
        <div className="font-label-md text-label-md text-secondary">
          Exibindo <strong>{fornecedores.length}</strong> fornecedores vinculados ao código interno{' '}
          <span className="font-mono text-on-surface font-semibold">{codInternoDoProduto}</span>
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          Retorno via API de Fornecedores
        </span>
      </div>
    </section>
  );
};

export default SuppliersTable;
