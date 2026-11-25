import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVinculos, listar, type Tabela } from '../../services/suprimentosApi';
import type { FiltroResumo, Pagina, Vinculos } from '../../types/suprimentos';
import { fmtInt } from '../../utils/format';
import { ChipEtapa } from './Rastreio';
import { ETAPAS, META_ETAPA, chaveOrigem, urlRastreio, useOrigemRastreio, type OrigemRastreio } from './rastreioUtils';
import { Carregando } from './Ui';

export interface Coluna<T> {
  cabecalho: string;
  campo?: string; // nome técnico mostrado em cinza (mesmo padrão da tabela de fornecedores)
  render: (linha: T) => ReactNode;
  className?: string;
  alinhar?: 'esq' | 'dir';
}

export interface OpcaoFiltro {
  rotulo: string;
  params: Record<string, string | boolean>;
}

interface TabelaRegistrosProps<T> {
  tabela: Tabela;
  titulo: string;
  icone: string;
  colunas: Coluna<T>[];
  chave: (linha: T) => string;
  filtro: FiltroResumo;
  campoData: string;
  campoBusca: string;
  placeholderBusca: string;
  opcoesFiltro?: OpcaoFiltro[];
}

const TAMANHO = 25;

function TabelaRegistros<T>({
  tabela,
  titulo,
  icone,
  colunas,
  chave,
  filtro,
  campoData,
  campoBusca,
  placeholderBusca,
  opcoesFiltro = [],
}: TabelaRegistrosProps<T>) {
  const [pagina, setPagina] = useState(1);
  const [texto, setTexto] = useState('');
  const [busca, setBusca] = useState('');
  const [opcao, setOpcao] = useState(-1);
  const [numeroTexto, setNumeroTexto] = useState('');
  const [numero, setNumero] = useState('');
  const [vinculos, setVinculos] = useState<Vinculos>({});
  const origem = useOrigemRastreio();
  const chaveRastreio = chaveOrigem(origem);
  const campoNumero = META_ETAPA[tabela].campoNumero;
  const idx = ETAPAS.indexOf(tabela);
  const anterior = idx > 0 ? ETAPAS[idx - 1] : null;
  const proxima = idx < ETAPAS.length - 1 ? ETAPAS[idx + 1] : null;
  const [dados, setDados] = useState<Pagina<T> | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => {
      setBusca(texto.trim());
      setNumero(numeroTexto.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [texto, numeroTexto]);

  // volta para a página 1 quando qualquer filtro muda
  useEffect(() => setPagina(1), [busca, numero, opcao, filtro, chaveRastreio]);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    listar<T>(tabela, {
      pagina,
      tamanho_pagina: TAMANHO,
      ordenar_por: campoData,
      ordem: 'desc',
      // no rastreio o período/empresa do painel não se aplicam: a cadeia manda
      ...(origem
        ? { rastreio_etapa: origem.etapa, rastreio_numero: origem.numero, rastreio_empresa: origem.empresa }
        : {
            [`${campoData}__min`]: filtro.dt_inicio,
            [`${campoData}__max`]: filtro.dt_fim ? `${filtro.dt_fim}T23:59:59` : undefined,
            cod_empresa: filtro.cod_empresa,
          }),
      [campoNumero]: numero || undefined,
      [`${campoBusca}__contem`]: busca || undefined,
      ...(opcao >= 0 ? opcoesFiltro[opcao]?.params : {}),
    })
      .then((d) => {
        if (!ativo) return;
        setDados(d);
        setVinculos({});
        getVinculos(tabela, d.itens.map(chave))
          .then((v) => ativo && setVinculos(v))
          .catch(() => ativo && setVinculos({}));
      })
      .catch(() => ativo && setErro('Erro ao carregar os registros.'))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela, pagina, busca, numero, opcao, filtro, campoData, campoBusca, chaveRastreio]);

  const totalPaginas = dados?.total_paginas ?? 0;

  // origem usada pelos links da linha: mantém o rastreio ativo ou começa um novo a partir da linha
  const origemDaLinha = (linha: T): OrigemRastreio => {
    if (origem) return origem;
    const r = linha as unknown as Record<string, number>;
    return { etapa: tabela, numero: r[campoNumero], empresa: r.cod_empresa };
  };

  const colunaFluxo: Coluna<T> = {
    cabecalho: 'Fluxo',
    render: (linha) => {
      const v = vinculos[chave(linha)];
      const o = origemDaLinha(linha);
      const r = linha as unknown as Record<string, number>;
      const proprio: OrigemRastreio = { etapa: tabela, numero: r[campoNumero], empresa: r.cod_empresa };
      return (
        <div className="flex flex-wrap items-center gap-1 min-w-[150px]">
          {anterior &&
            v?.anterior.map((n) => (
              <ChipEtapa key={`a-${n.cod_empresa}-${n.numero}`} etapa={anterior} numero={n.numero} seta="antes" para={urlRastreio(anterior, o)} />
            ))}
          {proxima &&
            (v ? (
              v.proxima.length ? (
                v.proxima.map((n) => (
                  <ChipEtapa key={`p-${n.cod_empresa}-${n.numero}`} etapa={proxima} numero={n.numero} seta="depois" para={urlRastreio(proxima, o)} />
                ))
              ) : (
                <span className="font-label-sm text-label-sm text-outline whitespace-nowrap">sem {META_ETAPA[proxima].curto.toLowerCase()}</span>
              )
            ) : (
              <span className="font-label-sm text-label-sm text-outline">…</span>
            ))}
          {!origem && (
            <Link
              to={urlRastreio(tabela, proprio)}
              title={`Rastrear ${META_ETAPA[tabela].nome.toLowerCase()} nº ${proprio.numero} em todas as etapas`}
              className="h-6 w-6 rounded flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">route</span>
            </Link>
          )}
        </div>
      );
    },
  };
  // Fluxo logo depois da coluna do número, para ficar sempre visível
  const todasColunas = [...colunas.slice(0, 1), colunaFluxo, ...colunas.slice(1)];

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/50 border-b border-surface-container-high">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">{icone}</span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">{titulo}</span>
          {dados && (
            <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm">
              {fmtInt(dados.total)} registros
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {opcoesFiltro.length > 0 && (
            <select
              value={opcao}
              onChange={(e) => setOpcao(Number(e.target.value))}
              className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-surface-container-high focus:border-primary-container outline-none"
            >
              <option value={-1}>Todas as situações</option>
              {opcoesFiltro.map((o, i) => (
                <option key={o.rotulo} value={i}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          )}
          <input
            value={numeroTexto}
            onChange={(e) => setNumeroTexto(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Nº"
            title={`Filtrar pelo número (${campoNumero})`}
            className="h-9 w-24 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-body-sm border border-surface-container-high focus:border-primary-container focus:ring-2 focus:ring-primary-container outline-none"
          />
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={placeholderBusca}
              className="h-9 w-64 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border border-surface-container-high focus:border-primary-container focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
        </div>
      </div>

      {origem && (
        <div className="px-6 py-2 flex flex-wrap items-center gap-2 bg-primary/5 border-b border-surface-container-high font-body-sm text-body-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-[18px]">route</span>
          Mostrando só as linhas ligadas à {META_ETAPA[origem.etapa].nome.toLowerCase()} nº{' '}
          <strong className="font-mono">{origem.numero}</strong>
          {origem.empresa != null && <> (empresa {origem.empresa})</>} — período e empresa do filtro acima não se aplicam.
          <Link to={META_ETAPA[tabela].rota} className="ml-auto text-primary font-label-md text-label-md hover:underline">
            Remover rastreio
          </Link>
        </div>
      )}

      {erro ? (
        <p className="p-8 text-center font-body-md text-error">{erro}</p>
      ) : carregando && !dados ? (
        <Carregando texto="Carregando registros..." />
      ) : (
        <div className={`w-full overflow-x-auto transition-opacity ${carregando ? 'opacity-50' : ''}`}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
              <tr>
                {todasColunas.map((c) => (
                  <th
                    key={c.cabecalho}
                    className={`py-3 px-4 whitespace-nowrap ${c.alinhar === 'dir' ? 'text-right' : ''} ${c.className ?? ''}`}
                  >
                    {c.cabecalho}
                    {c.campo && (
                      <span className="block font-mono text-[10px] text-outline lowercase font-normal tracking-normal">
                        {c.campo}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60 font-body-sm text-body-sm">
              {dados?.itens.length ? (
                dados.itens.map((linha) => (
                  <tr key={chave(linha)} className="hover:bg-surface-container-low/60 transition-colors">
                    {todasColunas.map((c) => (
                      <td
                        key={c.cabecalho}
                        className={`py-3 px-4 text-on-surface ${c.alinhar === 'dir' ? 'text-right font-tabular-nums' : ''} ${c.className ?? ''}`}
                      >
                        {c.render(linha)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={todasColunas.length} className="py-10 text-center text-secondary">
                    <span className="material-symbols-outlined text-[36px] text-outline block mb-2">search_off</span>
                    Nenhum registro encontrado para os filtros selecionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/30 border-t border-surface-container-high">
        <span className="font-label-md text-label-md text-secondary">
          Página <strong className="text-on-surface">{dados ? dados.pagina : '—'}</strong> de{' '}
          <strong className="text-on-surface">{fmtInt(totalPaginas)}</strong>
        </span>
        <div className="flex items-center gap-1">
          {[
            { icone: 'first_page', destino: 1, ativo: pagina > 1 },
            { icone: 'chevron_left', destino: pagina - 1, ativo: pagina > 1 },
            { icone: 'chevron_right', destino: pagina + 1, ativo: pagina < totalPaginas },
            { icone: 'last_page', destino: totalPaginas, ativo: pagina < totalPaginas },
          ].map((b) => (
            <button
              key={b.icone}
              type="button"
              disabled={!b.ativo || carregando}
              onClick={() => setPagina(b.destino)}
              className="h-8 w-8 rounded flex items-center justify-center text-secondary hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={b.icone}
            >
              <span className="material-symbols-outlined text-[20px]">{b.icone}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TabelaRegistros;
