import React, { useState, useEffect } from 'react';
import HeaderBanner from '../components/HeaderBanner';
import ProductSearch from '../components/ProductSearch';
import ProductInfo from '../components/ProductInfo';
import SuppliersTable from '../components/SuppliersTable';
import { getMateriais, getFornecedoresDeUmMaterial } from '../services/api';
import type { Material, Fornecedor } from '../types/api';

const LocalizadorFornecedores: React.FC = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoadingMateriais, setIsLoadingMateriais] = useState(true);
  const [isLoadingFornecedores, setIsLoadingFornecedores] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar lista de materiais ao montar o componente
  useEffect(() => {
    const loadMateriais = async () => {
      try {
        setIsLoadingMateriais(true);
        setError(null);
        const data = await getMateriais();
        setMateriais(data);
      } catch (err) {
        console.error('Erro ao carregar materiais:', err);
        setError('Erro ao carregar lista de materiais. Verifique se o backend está rodando.');
      } finally {
        setIsLoadingMateriais(false);
      }
    };

    loadMateriais();
  }, []);

  // Buscar fornecedores quando um material é selecionado
  const handleSearch = async (material: Material | null) => {
    if (!material) {
      setFornecedores([]);
      setSelectedMaterial(null);
      return;
    }

    try {
      setIsLoadingFornecedores(true);
      setError(null);
      setSelectedMaterial(material);
      const data = await getFornecedoresDeUmMaterial(material.codInternoDoProduto);
      setFornecedores(data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError('Erro ao buscar fornecedores. Verifique se o backend está rodando.');
      setFornecedores([]);
    } finally {
      setIsLoadingFornecedores(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Banner de cabeçalho */}
      <HeaderBanner />

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-error-container border border-error rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <div className="flex-1">
            <p className="font-title-sm text-on-error-container">{error}</p>
            <p className="font-body-sm text-on-error-container/80 mt-1">
              Backend esperado em: https://localhost:7286
            </p>
          </div>
        </div>
      )}

      {/* Campo de busca de produto */}
      <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-visible">
        <ProductSearch
          materiais={materiais}
          onSearch={handleSearch}
          isLoading={isLoadingMateriais || isLoadingFornecedores}
        />

        {/* Informações do produto selecionado */}
        {selectedMaterial && <ProductInfo material={selectedMaterial} />}
      </div>

      {/* Tabela de fornecedores */}
      <SuppliersTable
        fornecedores={fornecedores}
        codInternoDoProduto={selectedMaterial?.codInternoDoProduto || ''}
        isLoading={isLoadingFornecedores}
      />
    </div>
  );
};

export default LocalizadorFornecedores;
