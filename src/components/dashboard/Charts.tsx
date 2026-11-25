import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { fmtMes } from '../../utils/format';

/**
 * Paleta categórica (ordem fixa, validada para daltonismo nas séries adjacentes).
 * As cores seguem a entidade, nunca a posição: use sempre a mesma série -> mesma cor.
 */
export const SERIE = {
  azul: '#2a78d6',
  laranja: '#eb6834',
  agua: '#1baf7a',
  amarelo: '#eda100',
} as const;

const GRID = '#e5eeff'; // surface-container
const EIXO = '#737688'; // outline
const TINTA = '#0e1c2d'; // on-surface
const TINTA_2 = '#515f7a'; // secondary

export interface Serie {
  chave: string;
  nome: string;
  cor: string;
}

type Formatador = (v: number) => string;

// ---------------------------------------------------------------------------
// Legenda (sempre presente com 2+ séries)
// ---------------------------------------------------------------------------
export const Legenda: React.FC<{ series: Serie[] }> = ({ series }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
    {series.map((s) => (
      <span key={s.chave} className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.cor }} />
        {s.nome}
      </span>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
const TooltipConteudo: React.FC<
  TooltipProps<number, string> & { series: Serie[]; formatar: Formatador; mostrarTotal?: boolean }
> = ({ active, payload, label, series, formatar, mostrarTotal }) => {
  if (!active || !payload?.length) return null;
  const porChave = new Map(payload.map((p) => [String(p.dataKey), Number(p.value ?? 0)]));
  const total = series.reduce((acc, s) => acc + (porChave.get(s.chave) ?? 0), 0);
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.12)] border border-surface-container-high px-3 py-2 min-w-[160px]">
      <div className="font-title-sm text-title-sm text-on-surface mb-1">{fmtMes(String(label))}</div>
      {[...series].reverse().map((s) => (
        <div key={s.chave} className="flex items-center justify-between gap-4 font-body-sm text-body-sm">
          <span className="inline-flex items-center gap-1.5 text-secondary">
            <span className="h-2 w-2 rounded-sm" style={{ background: s.cor }} />
            {s.nome}
          </span>
          <span className="font-tabular-nums text-on-surface font-semibold">
            {formatar(porChave.get(s.chave) ?? 0)}
          </span>
        </div>
      ))}
      {mostrarTotal && series.length > 1 && (
        <div className="flex items-center justify-between gap-4 font-body-sm text-body-sm border-t border-surface-container-high mt-1 pt-1">
          <span className="text-secondary">Total</span>
          <span className="font-tabular-nums text-on-surface font-semibold">{formatar(total)}</span>
        </div>
      )}
    </div>
  );
};

const eixoX = {
  dataKey: 'mes',
  tickFormatter: fmtMes,
  tick: { fill: EIXO, fontSize: 11 },
  axisLine: { stroke: '#c3c5d9' },
  tickLine: false,
  interval: 'preserveStartEnd' as const,
  minTickGap: 8,
};

const eixoY = (formatar: Formatador) => ({
  tickFormatter: formatar,
  tick: { fill: EIXO, fontSize: 11 },
  axisLine: false,
  tickLine: false,
  width: 64,
});

// ---------------------------------------------------------------------------
// Colunas mensais (uma série ou empilhadas)
// ---------------------------------------------------------------------------
interface ColunasMensaisProps {
  dados: Record<string, string | number>[];
  series: Serie[];
  formatarEixo: Formatador;
  formatarValor: Formatador;
  altura?: number;
}

export const ColunasMensais: React.FC<ColunasMensaisProps> = ({
  dados,
  series,
  formatarEixo,
  formatarValor,
  altura = 260,
}) => (
  <ResponsiveContainer width="100%" height={altura}>
    <BarChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
      <CartesianGrid vertical={false} stroke={GRID} />
      <XAxis {...eixoX} />
      <YAxis {...eixoY(formatarEixo)} />
      <Tooltip
        cursor={{ fill: 'rgba(13,91,255,0.06)' }}
        content={<TooltipConteudo series={series} formatar={formatarValor} mostrarTotal />}
      />
      {series.map((s, i) => (
        <Bar
          key={s.chave}
          dataKey={s.chave}
          name={s.nome}
          stackId="a"
          fill={s.cor}
          maxBarSize={24}
          // separação de 2px entre segmentos empilhados
          stroke="#ffffff"
          strokeWidth={series.length > 1 ? 1 : 0}
          radius={i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          isAnimationActive={false}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

// ---------------------------------------------------------------------------
// Linha/área mensal (uma série)
// ---------------------------------------------------------------------------
interface AreaMensalProps {
  dados: Record<string, string | number>[];
  serie: Serie;
  formatarEixo: Formatador;
  formatarValor: Formatador;
  altura?: number;
}

export const AreaMensal: React.FC<AreaMensalProps> = ({ dados, serie, formatarEixo, formatarValor, altura = 260 }) => {
  const id = `grad-${serie.chave}`;
  return (
    <ResponsiveContainer width="100%" height={altura}>
      <AreaChart data={dados} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={serie.cor} stopOpacity={0.16} />
            <stop offset="100%" stopColor={serie.cor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis {...eixoX} />
        <YAxis {...eixoY(formatarEixo)} />
        <Tooltip
          cursor={{ stroke: EIXO, strokeWidth: 1 }}
          content={<TooltipConteudo series={[serie]} formatar={formatarValor} />}
        />
        <Area
          type="monotone"
          dataKey={serie.chave}
          name={serie.nome}
          stroke={serie.cor}
          strokeWidth={2}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: serie.cor }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ---------------------------------------------------------------------------
// Barras horizontais em HTML (ranking com rótulos longos)
// ---------------------------------------------------------------------------
interface BarrasRankingProps {
  itens: { nome: string; valor: number; detalhe?: string }[];
  formatar: Formatador;
  cor?: string;
  vazio?: string;
}

export const BarrasRanking: React.FC<BarrasRankingProps> = ({
  itens,
  formatar,
  cor = SERIE.azul,
  vazio = 'Sem dados no período',
}) => {
  if (!itens.length) {
    return <p className="font-body-sm text-body-sm text-outline py-8 text-center">{vazio}</p>;
  }
  const max = Math.max(...itens.map((i) => i.valor), 0) || 1;
  return (
    <ul className="flex flex-col gap-2.5">
      {itens.map((item) => (
        <li key={item.nome} className="group" title={`${item.nome}: ${formatar(item.valor)}${item.detalhe ? ` · ${item.detalhe}` : ''}`}>
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <span className="font-body-sm text-body-sm text-on-surface truncate">{item.nome}</span>
            <span className="font-tabular-nums text-[12px] font-semibold whitespace-nowrap" style={{ color: TINTA }}>
              {formatar(item.valor)}
              {item.detalhe && (
                <span className="font-normal ml-1.5" style={{ color: TINTA_2 }}>
                  {item.detalhe}
                </span>
              )}
            </span>
          </div>
          <div className="h-2 rounded-sm bg-surface-container-low overflow-hidden">
            <div
              className="h-full rounded-r transition-opacity group-hover:opacity-80"
              style={{ width: `${Math.max((item.valor / max) * 100, 1)}%`, background: cor }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------------
// Barra de composição (partes de um todo, com rótulos e percentuais)
// ---------------------------------------------------------------------------
interface ComposicaoProps {
  partes: { nome: string; valor: number; cor: string }[];
  formatar: Formatador;
}

export const BarraComposicao: React.FC<ComposicaoProps> = ({ partes, formatar }) => {
  const total = partes.reduce((a, p) => a + p.valor, 0);
  if (!total) {
    return <p className="font-body-sm text-body-sm text-outline py-8 text-center">Sem dados no período</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-6 w-full gap-[2px] rounded overflow-hidden">
        {partes
          .filter((p) => p.valor > 0)
          .map((p) => (
            <div
              key={p.nome}
              className="h-full hover:opacity-80 transition-opacity"
              style={{ width: `${(p.valor / total) * 100}%`, background: p.cor, minWidth: 3 }}
              title={`${p.nome}: ${formatar(p.valor)} (${((p.valor / total) * 100).toFixed(1)}%)`}
            />
          ))}
      </div>
      <ul className="grid grid-cols-1 gap-2">
        {partes.map((p) => (
          <li key={p.nome} className="flex items-center justify-between gap-3 font-body-sm text-body-sm">
            <span className="inline-flex items-center gap-2 text-on-surface min-w-0">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: p.cor }} />
              <span className="truncate">{p.nome}</span>
            </span>
            <span className="font-tabular-nums whitespace-nowrap">
              <strong className="text-on-surface">{formatar(p.valor)}</strong>
              <span className="text-secondary ml-2">{((p.valor / total) * 100).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
