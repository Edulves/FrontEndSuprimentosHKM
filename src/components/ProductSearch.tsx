import React, { useState } from 'react';
import type { Material } from '../types/api';

interface ProductSearchProps {
  materiais: Material[];
  onSearch: (material: Material | null) => void;
  isLoading: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ materiais, onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrar materiais baseado no termo de busca
  const filteredMateriais = materiais.filter(
    (material) =>
      material.codInternoDoProduto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.nomeDoMaterial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codProduto.toString().includes(searchTerm)
  );

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setSearchTerm(material.codInternoDoProduto);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (selectedMaterial) {
      onSearch(selectedMaterial);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedMaterial) {
      handleSearch();
    }
  };

  return (
    <section className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-visible">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Campo de busca */}
          <div className="flex-1 flex flex-col gap-1 relative z-50">
            <label
              className="font-label-sm text-label-sm uppercase text-secondary tracking-wider font-semibold"
              htmlFor="product-selector-input"
            >
              Selecionar Produto da API (codInternoDoProduto ou Nome)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[22px] z-10">
                search
              </span>
              <input
                className="w-full h-12 pl-12 pr-4 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container outline-none transition-all border border-transparent focus:border-primary-container relative z-10"
                id="product-selector-input"
                placeholder="Digite ou selecione o código do produto..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setSelectedMaterial(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay para permitir o click nas sugestões
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              
              {/* Dropdown de sugestões */}
              {showSuggestions && searchTerm && filteredMateriais.length > 0 && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-surface-container-high rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] max-h-60 overflow-y-auto">
                  {filteredMateriais.slice(0, 10).map((material) => (
                    <div
                      key={material.codProduto}
                      className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-surface-container-high last:border-b-0 transition-colors"
                      onClick={() => handleSelectMaterial(material)}
                    >
                      <div className="font-title-sm text-on-surface">{material.codInternoDoProduto}</div>
                      <div className="font-body-sm text-secondary text-body-sm">{material.nomeDoMaterial}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão de busca */}
          <button
            className="h-12 px-6 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:bg-surface-tint flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleSearch}
            disabled={!selectedMaterial || isLoading}
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            {isLoading ? 'Consultando...' : 'Consultar Fornecedores'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSearch;
