import React, { ReactNode, useEffect, useState } from 'react';
import { isoDate } from '../../utils/format';
import { getEmpresas } from '../../services/suprimentosApi';
import type { FiltroResumo } from '../../types/suprimentos';

// ---------------------------------------------------------------------------
// Cabeçalho da página (mesmo padrão do HeaderBanner)
// ---------------------------------------------------------------------------
interface PageHeaderProps {
  icone: string;
  etiqueta: string;
  titulo: string;
  descricao: ReactNode;
  endpoint: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icone, etiqueta, titulo, descricao, endpoint }) => (
  <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
    <div className="flex flex-col gap-1 max-w-3xl">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wide">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            {icone}
          </span>
          {etiqueta}
        </span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">{titulo}</h1>
      <p className="font-body-md text-body-md text-secondary leading-relaxed">{descricao}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
      <span className="font-mono text-[12px] text-secondary bg-surface-container-low px-3 py-1.5 rounded border border-surface-container-high">
        {endpoint}
      </span>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Filtro de período
// ---------------------------------------------------------------------------
export type Preset = '30d' | '90d' | '12m' | 'ano' | 'tudo' | 'custom';

const PRESETS: { id: Exclude<Preset, 'custom'>; nome: string }[] = [
  { id: '30d', nome: '30 dias' },
  { id: '90d', nome: '90 dias' },
  { id: '12m', nome: '12 meses' },
  { id: 'ano', nome: 'Ano atual' },
  { id: 'tudo', nome: 'Tudo' },
];

export const filtroDoPreset = (p: Exclude<Preset, 'custom'>): FiltroResumo => {
  const hoje = new Date();
  const fim = isoDate(hoje);
  const menos = (dias: number) => isoDate(new Date(hoje.getTime() - dias * 86400000));
  switch (p) {
    case '30d':
      return { dt_inicio: menos(29), dt_fim: fim };
    case '90d':
      return { dt_inicio: menos(89), dt_fim: fim };
    case '12m': {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1);
      return { dt_inicio: isoDate(d), dt_fim: fim };
    }
    case 'ano':
      return { dt_inicio: `${hoje.getFullYear()}-01-01`, dt_fim: fim };
    default:
      return {};
  }
};

interface FiltroPeriodoProps {
  preset: Preset;
  filtro: FiltroResumo;
  onChange: (preset: Preset, filtro: FiltroResumo) => void;
  children?: ReactNode;
}

export const FiltroPeriodo: React.FC<FiltroPeriodoProps> = ({ preset, filtro, onChange, children }) => {
  const [empresas, setEmpresas] = useState<number[]>([]);

  useEffect(() => {
    let ativo = true;
    getEmpresas()
      .then((lista) => ativo && setEmpresas(lista))
      .catch(() => ativo && setEmpresas(filtro.cod_empresa != null ? [filtro.cod_empresa] : []));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
  <section className="bg-surface-container-lowest rounded-xl shadow-sm px-6 py-4 flex flex-wrap items-end gap-4">
    <div className="flex flex-col gap-1">
      <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider">Período</span>
      <div className="flex flex-wrap gap-1 bg-surface-container-low p-1 rounded-lg">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id, filtroDoPreset(p.id))}
            className={`px-3 h-8 rounded font-label-md text-label-md transition-colors ${
              preset === p.id
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-secondary hover:bg-surface-container'
            }`}
          >
            {p.nome}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-end gap-2">
      <label className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider">De</span>
        <input
          type="date"
          value={filtro.dt_inicio ?? ''}
          onChange={(e) => onChange('custom', { ...filtro, dt_inicio: e.target.value || undefined })}
          className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-transparent focus:border-primary-container focus:ring-2 focus:ring-primary-container outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider">Até</span>
        <input
          type="date"
          value={filtro.dt_fim ?? ''}
          onChange={(e) => onChange('custom', { ...filtro, dt_fim: e.target.value || undefined })}
          className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-transparent focus:border-primary-container focus:ring-2 focus:ring-primary-container outline-none"
        />
      </label>
    </div>

    <label className="flex flex-col gap-1">
      <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider">Empresa</span>
      <select
        value={filtro.cod_empresa ?? ''}
        onChange={(e) =>
          onChange(preset, { ...filtro, cod_empresa: e.target.value ? Number(e.target.value) : undefined })
        }
        className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-transparent focus:border-primary-container outline-none"
      >
        <option value="">Todas</option>
        {empresas.map((cod) => (
          <option key={cod} value={cod}>
            Empresa {cod}
          </option>
        ))}
      </select>
    </label>

    {children}
  </section>
  );
};

// ---------------------------------------------------------------------------
// KPI
// ---------------------------------------------------------------------------
interface KpiProps {
  rotulo: string;
  valor: string;
  icone: string;
  detalhe?: ReactNode;
  destaque?: boolean;
}

export const Kpi: React.FC<KpiProps> = ({ rotulo, valor, icone, detalhe, destaque }) => (
  <div
    className={`p-4 rounded-xl shadow-sm flex flex-col gap-1 ${
      destaque ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest'
    }`}
  >
    <div className="flex items-center justify-between">
      <span
        className={`font-label-sm text-label-sm uppercase tracking-wider ${
          destaque ? 'text-on-primary-container' : 'text-secondary'
        }`}
      >
        {rotulo}
      </span>
      <span className={`material-symbols-outlined text-[20px] ${destaque ? 'text-on-primary-container' : 'text-primary'}`}>
        {icone}
      </span>
    </div>
    <span className={`font-headline-md text-headline-md ${destaque ? 'text-on-primary' : 'text-on-surface'}`}>{valor}</span>
    {detalhe && (
      <span className={`font-body-sm text-body-sm ${destaque ? 'text-on-primary-container' : 'text-secondary'}`}>
        {detalhe}
      </span>
    )}
  </div>
);

export const GradeKpis: React.FC<{ children: ReactNode }> = ({ children }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{children}</section>
);

// ---------------------------------------------------------------------------
// Cartão de gráfico
// ---------------------------------------------------------------------------
interface CartaoProps {
  titulo: string;
  subtitulo?: string;
  icone?: string;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const CartaoGrafico: React.FC<CartaoProps> = ({ titulo, subtitulo, icone, extra, className = '', children }) => (
  <section className={`bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden ${className}`}>
    <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low/50 border-b border-surface-container-high">
      <div className="flex items-center gap-2 min-w-0">
        {icone && <span className="material-symbols-outlined text-primary text-[20px]">{icone}</span>}
        <div className="flex flex-col min-w-0">
          <span className="font-title-md text-title-md text-on-surface">{titulo}</span>
          {subtitulo && <span className="font-body-sm text-body-sm text-secondary">{subtitulo}</span>}
        </div>
      </div>
      {extra}
    </div>
    <div className="p-6 flex-1">{children}</div>
  </section>
);

// ---------------------------------------------------------------------------
// Estados
// ---------------------------------------------------------------------------
export const Carregando: React.FC<{ texto?: string }> = ({ texto = 'Carregando...' }) => (
  <div className="p-12 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
      <p className="font-body-md text-secondary">{texto}</p>
    </div>
  </div>
);

export const Erro: React.FC<{ mensagem: string }> = ({ mensagem }) => (
  <div className="bg-error-container border border-error rounded-lg p-4 flex items-center gap-3">
    <span className="material-symbols-outlined text-error">error</span>
    <div className="flex-1">
      <p className="font-title-sm text-on-error-container">{mensagem}</p>
      <p className="font-body-sm text-on-error-container/80 mt-1">
        API de suprimentos esperada em: http://localhost:8000 (proxy /suprimentos)
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Etiqueta de situação (sempre texto + ícone, nunca só cor)
// ---------------------------------------------------------------------------
type Tom = 'ok' | 'alerta' | 'erro' | 'neutro' | 'info';

const TONS: Record<Tom, string> = {
  ok: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  alerta: 'bg-[#ffe9b8] text-[#5c3d00]',
  erro: 'bg-error-container text-on-error-container',
  neutro: 'bg-surface-container text-secondary',
  info: 'bg-primary-fixed text-on-primary-fixed-variant',
};

const ICONES: Record<Tom, string> = {
  ok: 'check_circle',
  alerta: 'schedule',
  erro: 'cancel',
  neutro: 'remove',
  info: 'info',
};

export const Etiqueta: React.FC<{ tom: Tom; children: ReactNode }> = ({ tom, children }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm whitespace-nowrap ${TONS[tom]}`}>
    <span className="material-symbols-outlined text-[14px]">{ICONES[tom]}</span>
    {children}
  </span>
);
