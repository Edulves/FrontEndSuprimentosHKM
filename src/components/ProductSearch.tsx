import React, { useEffect, useState } from 'react';
import { buscarProdutos } from '../services/api';
import { separarProduto, type ProdutoNegociado } from '../types/api';

interface ProductSearchProps {
  onSearch: (produto: ProdutoNegociado | null) => void;
  isLoading: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<ProdutoNegociado | null>(null);
  const [sugestoes, setSugestoes] = useState<ProdutoNegociado[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Busca no backend com debounce enquanto o usuário digita
  useEffect(() => {
    const termo = searchTerm.trim();
    if (selected || termo.length < 2) {
      setSugestoes([]);
      return;
    }
    let cancelado = false;
    const t = setTimeout(async () => {
      try {
        setBuscando(true);
        const data = await buscarProdutos(termo);
        if (!cancelado) setSugestoes(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        if (!cancelado) setSugestoes([]);
      } finally {
        if (!cancelado) setBuscando(false);
      }
    }, 300);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [searchTerm, selected]);

  const handleSelect = (produto: ProdutoNegociado) => {
    setSelected(produto);
    setSearchTerm(produto.produto ?? String(produto.cod_produto));
    setShowSuggestions(false);
    onSearch(produto);
  };

  const handleSearch = () => {
    if (selected) onSearch(selected);
    else if (sugestoes.length > 0) handleSelect(sugestoes[0]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
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
              Buscar produto negociado (código interno, nome ou cod_produto)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[22px] z-10">
                search
              </span>
              <input
                className="w-full h-12 pl-12 pr-10 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container outline-none transition-all border border-transparent focus:border-primary-container relative z-10"
                id="product-selector-input"
                placeholder="Ex.: 1-01-00005, grampo ou 1313"
                type="text"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setSelected(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay para permitir o click nas sugestões
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={handleKeyDown}
              />
              {buscando && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              )}

              {/* Dropdown de sugestões */}
              {showSuggestions && !selected && searchTerm.trim().length >= 2 && !buscando && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-surface-container-high rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)] max-h-72 overflow-y-auto">
                  {sugestoes.length === 0 ? (
                    <div className="px-4 py-3 font-body-sm text-secondary">
                      Nenhum produto encontrado nas negociações.
                    </div>
                  ) : (
                    sugestoes.map((p) => {
                      const { codInterno, nome } = separarProduto(p.produto);
                      return (
                        <div
                          key={p.cod_produto}
                          className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-surface-container-high last:border-b-0 transition-colors flex items-center justify-between gap-4"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(p)}
                        >
                          <div className="min-w-0">
                            <div className="font-title-sm text-on-surface">
                              <span className="font-mono">{codInterno || p.cod_produto}</span>
                              <span className="font-mono text-[11px] text-outline ml-2">cod_produto {p.cod_produto}</span>
                            </div>
                            <div className="font-body-sm text-secondary text-body-sm truncate">{nome}</div>
                          </div>
                          <span className="shrink-0 text-[12px] text-secondary">
                            {p.qtde_fornecedores} fornec.
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botão de busca */}
          <button
            className="h-12 px-6 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:bg-surface-tint flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleSearch}
            disabled={(!selected && sugestoes.length === 0) || isLoading}
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
