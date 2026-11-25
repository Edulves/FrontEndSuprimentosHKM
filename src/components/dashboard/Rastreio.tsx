import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEmpresas, getRastreio } from '../../services/suprimentosApi';
import type { Etapa, NumeroEtapa, Rastreio } from '../../types/suprimentos';
import { fmtInt } from '../../utils/format';
import { ETAPAS, META_ETAPA, chaveOrigem, urlRastreio, useOrigemRastreio } from './rastreioUtils';

// ---------------------------------------------------------------------------
// Chip de número que navega para outra etapa
// ---------------------------------------------------------------------------
export const ChipEtapa: React.FC<{ etapa: Etapa; numero: number; para: string; seta?: 'antes' | 'depois'; titulo?: string }> = ({
  etapa,
  numero,
  para,
  seta,
  titulo,
}) => (
  <Link
    to={para}
    title={titulo ?? `Ver ${META_ETAPA[etapa].nome} nº ${numero}`}
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary hover:text-on-primary font-label-sm text-label-sm whitespace-nowrap transition-colors"
  >
    {seta === 'antes' && <span className="material-symbols-outlined text-[14px]">arrow_back</span>}
    {META_ETAPA[etapa].curto} <span className="font-mono">{numero}</span>
    {seta === 'depois' && <span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
  </Link>
);

// ---------------------------------------------------------------------------
// Painel: busca por número + trilha da cadeia
// ---------------------------------------------------------------------------
const MAX_CHIPS = 12;

const inputCls =
  'h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-transparent focus:border-primary-container focus:ring-2 focus:ring-primary-container outline-none';

export const PainelRastreio: React.FC<{ etapaAtual: Etapa }> = ({ etapaAtual }) => {
  const origem = useOrigemRastreio();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const chave = chaveOrigem(origem);

  const [etapaBusca, setEtapaBusca] = useState<Etapa>(origem?.etapa ?? etapaAtual);
  const [numeroBusca, setNumeroBusca] = useState(origem ? String(origem.numero) : '');
  const [empresaBusca, setEmpresaBusca] = useState(origem?.empresa != null ? String(origem.empresa) : '');
  const [empresas, setEmpresas] = useState<number[]>([]);
  const [dados, setDados] = useState<Rastreio | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    getEmpresas().then(setEmpresas).catch(() => setEmpresas([]));
  }, []);

  // sincroniza o formulário e carrega a cadeia quando a URL muda
  useEffect(() => {
    if (!origem) {
      setDados(null);
      return;
    }
    setEtapaBusca(origem.etapa);
    setNumeroBusca(String(origem.numero));
    setEmpresaBusca(origem.empresa != null ? String(origem.empresa) : '');
    let ativo = true;
    setCarregando(true);
    setErro(null);
    getRastreio(origem.etapa, origem.numero, origem.empresa)
      .then((d) => ativo && setDados(d))
      .catch(() => ativo && setErro('Erro ao rastrear o número informado.'))
      .finally(() => ativo && setCarregando(false));
    // espera os gráficos acima renderizarem para o painel não "fugir" depois do scroll
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 700);
    return () => {
      ativo = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const rastrear = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(numeroBusca);
    if (!numeroBusca.trim() || !Number.isFinite(n)) return;
    navigate(urlRastreio(etapaAtual, { etapa: etapaBusca, numero: n, empresa: empresaBusca ? Number(empresaBusca) : undefined }));
  };

  const limpar = () => navigate(META_ETAPA[etapaAtual].rota);

  return (
    <section ref={ref} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden scroll-mt-4">
      <form
        onSubmit={rastrear}
        className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/50 border-b border-surface-container-high"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">route</span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-on-surface font-semibold">Rastrear pelo número</span>
            <span className="font-body-sm text-body-sm text-secondary">
              Acompanhe uma solicitação até a compra (ou qualquer etapa para frente e para trás)
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={etapaBusca} onChange={(e) => setEtapaBusca(e.target.value as Etapa)} className={inputCls} aria-label="Etapa">
            {ETAPAS.map((et) => (
              <option key={et} value={et}>
                {META_ETAPA[et].nome}
              </option>
            ))}
          </select>
          <input
            value={numeroBusca}
            onChange={(e) => setNumeroBusca(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Nº"
            aria-label="Número"
            className={`${inputCls} w-28 font-mono`}
          />
          <select value={empresaBusca} onChange={(e) => setEmpresaBusca(e.target.value)} className={inputCls} aria-label="Empresa">
            <option value="">Todas as empresas</option>
            {empresas.map((cod) => (
              <option key={cod} value={cod}>
                Empresa {cod}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!numeroBusca}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Rastrear
          </button>
          {origem && (
            <button
              type="button"
              onClick={limpar}
              className="h-9 px-3 rounded-lg text-secondary hover:bg-surface-container font-label-md text-label-md flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Limpar
            </button>
          )}
        </div>
      </form>

      {origem && (
        <div className={`p-6 transition-opacity ${carregando ? 'opacity-50' : ''}`}>
          {erro ? (
            <p className="font-body-md text-error">{erro}</p>
          ) : dados && !dados.encontrado ? (
            <p className="font-body-md text-secondary">
              Nenhuma {META_ETAPA[origem.etapa].nome.toLowerCase()} nº <strong>{origem.numero}</strong>
              {origem.empresa != null && <> na empresa {origem.empresa}</>} foi encontrada.
            </p>
          ) : dados ? (
            <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {ETAPAS.map((et, i) => {
                const info = dados.etapas[et];
                const atual = et === etapaAtual;
                const ehOrigem = et === origem.etapa;
                const vazio = info.itens === 0;
                return (
                  <li key={et} className="relative">
                    <Link
                      to={urlRastreio(et, origem)}
                      className={`h-full flex flex-col gap-2 p-4 rounded-lg border transition-colors ${
                        atual
                          ? 'border-primary bg-primary/5'
                          : vazio
                            ? 'border-dashed border-surface-container-high bg-surface-container-low/40'
                            : 'border-surface-container-high hover:border-primary-container hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wide text-secondary">
                          <span className={`material-symbols-outlined text-[18px] ${vazio ? 'text-outline' : 'text-primary'}`}>
                            {META_ETAPA[et].icone}
                          </span>
                          {i + 1}. {META_ETAPA[et].nome}
                        </span>
                        {ehOrigem && (
                          <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase">origem</span>
                        )}
                        {atual && !ehOrigem && (
                          <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[10px] uppercase">
                            nesta página
                          </span>
                        )}
                      </div>
                      {vazio ? (
                        <span className="font-body-sm text-body-sm text-outline">
                          {i > ETAPAS.indexOf(origem.etapa) ? 'Ainda não gerada' : 'Sem vínculo'}
                        </span>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-1">
                            {info.numeros.slice(0, MAX_CHIPS).map((n: NumeroEtapa) => (
                              <span
                                key={`${n.cod_empresa}-${n.numero}`}
                                title={`Empresa ${n.cod_empresa} · ${n.itens} item(ns)`}
                                className="px-2 py-0.5 rounded bg-surface-container font-mono text-[12px] text-on-surface"
                              >
                                {n.numero}
                              </span>
                            ))}
                            {info.numeros.length > MAX_CHIPS && (
                              <span className="px-2 py-0.5 font-label-sm text-label-sm text-secondary">
                                +{info.numeros.length - MAX_CHIPS}
                              </span>
                            )}
                          </div>
                          <span className="font-body-sm text-body-sm text-secondary mt-auto">
                            {fmtInt(info.numeros.length)} nº · {fmtInt(info.itens)} {info.itens === 1 ? 'item' : 'itens'}
                            {!atual && ' · ver →'}
                          </span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
      )}
    </section>
  );
};
