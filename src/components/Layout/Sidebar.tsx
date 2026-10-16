import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Logo e Título */}
        <div className="h-16 px-4 flex items-center gap-2 bg-surface-container-lowest">
          <img
            alt="Vértice Supply Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XPon_1KN3X79eS_kpQn67DqYfsxxUHPKrpuzmLWu7tikzQuyVyusAfggGbKZAiYqtL3dsxokSlmPsMy5Rpf2TsHlC8Qh2XyIpwv0f6WcEFAExihM01_e3mgmN5Hne-17GYe5sOniqdZg5RzxcUshPiKgiB2Gu3r1kqCEI4OYI7v0O9HtK2P9SvVRl9zusPT6rmv9d28X99HjO70gtJr0KNTzFm6bKqt8-s4dhzqpM5inj2rJuj7LK4pdgi"
          />
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-on-surface tracking-tight">
              Vértice Supply
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase">
              Gestão ERP
            </span>
          </div>
        </div>

        {/* Label de Navegação */}
        <div className="px-3 py-2">
          <span className="px-2 font-label-sm text-label-sm uppercase text-outline tracking-wider">
            Navegação Operacional
          </span>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex flex-col gap-1 px-3">
          <a
            aria-current="page"
            className="flex items-center gap-3 px-3 py-2 rounded transition-colors bg-primary-container text-on-primary font-title-sm shadow-sm"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">travel_explore</span>
            <span>Localizar Fornecedores</span>
          </a>
          {/* Outros itens de menu podem ser adicionados aqui */}
        </nav>
      </div>

      {/* Rodapé do Sidebar (se necessário) */}
      <div className="p-3 bg-surface-container-low"></div>
    </aside>
  );
};

export default Sidebar;
