import React from 'react';

const HeaderBanner: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex flex-col gap-1 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              hub
            </span>
            Mapeamento De-Para ERP
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            API v1 Ativa
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
          Localizar Fornecedores por Produto
        </h1>

        <p className="font-body-md text-body-md text-secondary leading-relaxed">
          Consulte pelo Código Interno do Produto (
          <code className="text-on-surface font-semibold bg-surface-container-low px-1.5 py-0.5 rounded">
            codInternoDoProduto
          </code>
          ) para mapear parceiros homologados, auditar catálogos fornecedor-específicos e disparar cotações simultâneas.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
        <span className="font-mono text-[12px] text-secondary bg-surface-container-low px-3 py-1.5 rounded border border-surface-container-high">
          GET /FornecedoresXMateriais
        </span>
      </div>
    </section>
  );
};

export default HeaderBanner;
