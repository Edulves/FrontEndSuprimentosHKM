import React from 'react';
import { NavLink } from 'react-router-dom';

const ItemMenu: React.FC<{ para: string; icone: string; rotulo: string }> = ({ para, icone, rotulo }) => (
  <NavLink
    to={para}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded transition-colors font-title-sm text-title-sm ${
        isActive
          ? 'bg-primary-container text-on-primary shadow-sm'
          : 'text-on-surface-variant hover:bg-surface-container-low'
      }`
    }
  >
    <span className="material-symbols-outlined text-[20px]">{icone}</span>
    <span>{rotulo}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Logo e Título */}
        <div className="h-16 px-4 flex items-center gap-2 bg-surface-container-lowest">
          <div
            aria-hidden="true"
            className="h-9 w-9 shrink-0 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-title-md text-title-md text-on-surface tracking-tight">
              Suprimentos HKM
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase">
              Gestão de Compras
            </span>
          </div>
        </div>

        {/* Label de Navegação */}
        <div className="px-3 py-2">
          <span className="px-2 font-label-sm text-label-sm uppercase text-outline tracking-wider">
            Navegação Operacional
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          <ItemMenu para="/" icone="travel_explore" rotulo="Localizar Fornecedores" />
        </nav>

        <div className="px-3 pt-4 pb-2">
          <span className="px-2 font-label-sm text-label-sm uppercase text-outline tracking-wider">
            Acompanhamento
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          <ItemMenu para="/solicitacoes" icone="assignment" rotulo="Solicitações" />
          <ItemMenu para="/cotacoes" icone="request_quote" rotulo="Cotações" />
          <ItemMenu para="/ordens-de-compra" icone="shopping_cart_checkout" rotulo="Ordens de Compra" />
          <ItemMenu para="/compras" icone="inventory" rotulo="Compras" />
        </nav>
      </div>

      {/* Rodapé do Sidebar (se necessário) */}
      <div className="p-3 bg-surface-container-low"></div>
    </aside>
  );
};

export default Sidebar;
