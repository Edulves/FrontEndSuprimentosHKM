const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaCompacta = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const compacto = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

export const fmtInt = (v: number | null | undefined) => (v == null ? '—' : nf0.format(v));
export const fmtNum = (v: number | null | undefined) => (v == null ? '—' : nf2.format(v));
export const fmtDec1 = (v: number | null | undefined) => (v == null ? '—' : nf1.format(v));
export const fmtMoeda = (v: number | null | undefined) => (v == null ? '—' : moeda.format(v));
export const fmtMoedaCompacta = (v: number | null | undefined) => (v == null ? '—' : moedaCompacta.format(v));
export const fmtCompacto = (v: number | null | undefined) => (v == null ? '—' : compacto.format(v));
export const fmtPct = (v: number | null | undefined) =>
  v == null ? '—' : `${nf1.format(v * 100)}%`;

export const fmtData = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "2026-03" -> "mar/26" */
export const fmtMes = (mes: string) => {
  const [a, m] = mes.split('-');
  return `${MESES[Number(m) - 1] ?? m}/${a.slice(2)}`;
};

/** Duração em horas -> "1d 8h" / "5h" */
export const fmtHoras = (h: number | null | undefined) => {
  if (h == null) return '—';
  if (h < 24) return `${nf1.format(h)} h`;
  const d = Math.floor(h / 24);
  const r = Math.round(h - d * 24);
  return r ? `${d}d ${r}h` : `${d}d`;
};

export const isoDate = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
