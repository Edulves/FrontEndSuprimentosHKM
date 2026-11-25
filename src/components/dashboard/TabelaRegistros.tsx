import { ReactNode, useEffect, useState } from 'react';
import { listar, type Tabela } from '../../services/suprimentosApi';
import type { FiltroResumo, Pagina } from '../../types/suprimentos';
import { fmtInt } from '../../utils/format';
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
  const [dados, setDados] = useState<Pagina<T> | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setBusca(texto.trim()), 400);
    return () => clearTimeout(t);
  }, [texto]);

  // volta para a página 1 quando qualquer filtro muda
  useEffect(() => setPagina(1), [busca, opcao, filtro]);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    listar<T>(tabela, {
      pagina,
      tamanho_pagina: TAMANHO,
      ordenar_por: campoData,
      ordem: 'desc',
      [`${campoData}__min`]: filtro.dt_inicio,
      [`${campoData}__max`]: filtro.dt_fim ? `${filtro.dt_fim}T23:59:59` : undefined,
      cod_empresa: filtro.cod_empresa,
      [`${campoBusca}__contem`]: busca || undefined,
      ...(opcao >= 0 ? opcoesFiltro[opcao]?.params : {}),
    })
      .then((d) => ativo && setDados(d))
      .catch(() => ativo && setErro('Erro ao carregar os registros.'))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela, pagina, busca, opcao, filtro, campoData, campoBusca]);

  const totalPaginas = dados?.total_paginas ?? 0;

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

      {erro ? (
        <p className="p-8 text-center font-body-md text-error">{erro}</p>
      ) : carregando && !dados ? (
        <Carregando texto="Carregando registros..." />
      ) : (
        <div className={`w-full overflow-x-auto transition-opacity ${carregando ? 'opacity-50' : ''}`}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
              <tr>
                {colunas.map((c) => (
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
                    {colunas.map((c) => (
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
                  <td colSpan={colunas.length} className="py-10 text-center text-secondary">
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
