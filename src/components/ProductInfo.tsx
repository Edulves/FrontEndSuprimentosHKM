import React from 'react';
import type { Material } from '../types/api';

interface ProductInfoProps {
  material: Material | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ material }) => {
  if (!material) {
    return null;
  }

  return (
    <div className="bg-surface-container-low/70 border-t border-surface-container-high px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
          Dados do Produto Selecionado
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-[12px]">
          <span className="font-bold">GET</span> /produtos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Código do Produto */}
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high/80">
          <span className="font-label-sm text-label-sm text-secondary block">
            Código do Produto
          </span>
          <span className="font-mono font-semibold text-title-md text-on-surface">
            {material.codProduto}
          </span>
          <span className="font-mono text-[11px] text-outline block mt-0.5">
            codProduto
          </span>
        </div>

        {/* Código Interno */}
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high/80">
          <span className="font-label-sm text-label-sm text-secondary block">
            Código Interno
          </span>
          <span className="font-mono font-semibold text-title-md text-primary">
            {material.codInternoDoProduto}
          </span>
          <span className="font-mono text-[11px] text-outline block mt-0.5">
            codInternoDoProduto
          </span>
        </div>

        {/* Código Material Padrão */}
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high/80">
          <span className="font-label-sm text-label-sm text-secondary block">
            Cód. Material Padrão
          </span>
          <span className="font-mono font-semibold text-title-md text-on-surface">
            {material.codMatFornecedor}
          </span>
          <span className="font-mono text-[11px] text-outline block mt-0.5">
            codMatFornecedor
          </span>
        </div>

        {/* Nome do Material */}
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container-high/80">
          <span className="font-label-sm text-label-sm text-secondary block">
            Nome do Material
          </span>
          <span className="font-semibold text-body-md text-on-surface truncate block">
            {material.nomeDoMaterial}
          </span>
          <span className="font-mono text-[11px] text-outline block mt-0.5">
            nomeDoMaterial
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
