import React, { useState } from 'react';
import HeaderBanner from '../components/HeaderBanner';
import ProductSearch from '../components/ProductSearch';
import ProductInfo from '../components/ProductInfo';
import SuppliersTable from '../components/SuppliersTable';
import { getFornecedoresDoProduto } from '../services/api';
import { separarProduto, type FornecedorDoProduto, type ProdutoNegociado } from '../types/api';

const LocalizadorFornecedores: React.FC = () => {
  const [produto, setProduto] = useState<ProdutoNegociado | null>(null);
  const [fornecedores, setFornecedores] = useState<FornecedorDoProduto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (p: ProdutoNegociado | null) => {
    setProduto(p);
    setFornecedores([]);
    if (!p) return;

    try {
      setIsLoading(true);
      setError(null);
      setFornecedores(await getFornecedoresDoProduto(p.cod_produto));
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError('Erro ao buscar fornecedores. Verifique se o backend Python está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <HeaderBanner />

      {error && (
        <div className="bg-error-container border border-error rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <div className="flex-1">
            <p className="font-title-sm text-on-error-container">{error}</p>
            <p className="font-body-sm text-on-error-container/80 mt-1">
              Backend esperado em: http://localhost:8000 (proxy /suprimentos)
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-visible">
        <ProductSearch onSearch={handleSearch} isLoading={isLoading} />
        {produto && <ProductInfo produto={produto} />}
      </div>

      <SuppliersTable
        fornecedores={fornecedores}
        codProduto={produto?.cod_produto ?? null}
        codInterno={separarProduto(produto?.produto ?? null).codInterno}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LocalizadorFornecedores;
