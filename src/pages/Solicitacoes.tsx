import React from 'react';
import { getResumoSolicitacoes } from '../services/suprimentosApi';
import type { Solicitacao } from '../types/suprimentos';
import { fmtCompacto, fmtData, fmtHoras, fmtInt, fmtNum, fmtPct } from '../utils/format';
import { BarraComposicao, BarrasRanking, ColunasMensais, Legenda, SERIE, type Serie } from '../components/dashboard/Charts';
import TabelaRegistros, { type Coluna } from '../components/dashboard/TabelaRegistros';
import { PainelRastreio } from '../components/dashboard/Rastreio';
import {
  CartaoGrafico,
  Carregando,
  Erro,
  Etiqueta,
  FiltroPeriodo,
  GradeKpis,
  Kpi,
  PageHeader,
} from '../components/dashboard/Ui';
import { useFiltroPeriodo, useResumo } from '../components/dashboard/useResumo';

const SERIES_SITUACAO: Serie[] = [
  { chave: 'aprovados', nome: 'Aprovadas', cor: SERIE.azul },
  { chave: 'recusados', nome: 'Recusadas', cor: SERIE.laranja },
  { chave: 'pendentes', nome: 'Pendentes', cor: SERIE.agua },
];

const COR_PRIORIDADE: Record<string, string> = {
  URGENTE: SERIE.laranja,
  ALTA: SERIE.agua,
  NORMAL: SERIE.azul,
};

const tomSituacao = (s: string | null) =>
  s === 'APROVADO' ? 'ok' : s === 'RECUSADO' ? 'erro' : s === 'PENDENTE' ? 'alerta' : 'neutro';

const COLUNAS: Coluna<Solicitacao>[] = [
  {
    cabecalho: 'Nº',
    campo: 'cod_solicitacao',
    render: (s) => <span className="font-mono text-[13px] font-semibold text-primary">{s.cod_solicitacao}</span>,
  },
  { cabecalho: 'Data', campo: 'dt_solicitacao', render: (s) => fmtData(s.dt_solicitacao), className: 'whitespace-nowrap' },
  {
    cabecalho: 'Produto',
    campo: 'produto',
    render: (s) => (
      <div className="flex flex-col max-w-[380px]">
        <span className="font-medium truncate" title={s.produto ?? ''}>{s.produto ?? '—'}</span>
        <span className="font-mono text-[11px] text-outline">{s.cod_interno}</span>
      </div>
    ),
  },
  { cabecalho: 'Qtde', campo: 'qtde', alinhar: 'dir', className: 'whitespace-nowrap', render: (s) => `${fmtNum(s.qtde)} ${s.unidade ?? ''}` },
  { cabecalho: 'Solicitante', campo: 'solicitante', render: (s) => s.solicitante ?? '—' },
  {
    cabecalho: 'Prioridade',
    campo: 'pioridade',
    render: (s) =>
      s.pioridade ? (
        <Etiqueta tom={s.pioridade === 'URGENTE' ? 'erro' : s.pioridade === 'ALTA' ? 'alerta' : 'neutro'}>{s.pioridade}</Etiqueta>
      ) : (
        '—'
      ),
  },
  {
    cabecalho: 'Situação',
    campo: 'situacao',
    render: (s) => (
      <span title={s.motivo_recusado ?? ''}>
        <Etiqueta tom={tomSituacao(s.situacao)}>{s.situacao ?? '—'}</Etiqueta>
      </span>
    ),
  },
  {
    cabecalho: 'Cotação',
    campo: 'gerado_cotacao',
    render: (s) => (s.gerado_cotacao ? <Etiqueta tom="info">Gerada</Etiqueta> : <span className="text-outline">—</span>),
  },
];

const Solicitacoes: React.FC = () => {
  const { preset, filtro, alterar } = useFiltroPeriodo('12m');
  const { dados, carregando, erro } = useResumo(getResumoSolicitacoes, filtro);
  const k = dados?.kpis;

  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeader
        icone="assignment"
        etiqueta="Etapa 1 · Solicitações"
        titulo="Acompanhamento de Solicitações"
        descricao="Volume de requisições de compra, situação de aprovação, prioridades e quanto do que foi solicitado já virou cotação."
        endpoint="GET /resumos/solicitacoes"
      />

      <FiltroPeriodo preset={preset} filtro={filtro} onChange={alterar} />

      {erro && <Erro mensagem={erro} />}

      {carregando && !dados ? (
        <Carregando texto="Calculando indicadores..." />
      ) : (
        k && (
          <div className={`flex flex-col gap-6 transition-opacity ${carregando ? 'opacity-60' : ''}`}>
            <GradeKpis>
              <Kpi
                destaque
                rotulo="Itens solicitados"
                icone="assignment"
                valor={fmtInt(k.itens)}
                detalhe={`${fmtInt(k.solicitacoes)} solicitações · ${fmtInt(k.urgentes)} urgentes`}
              />
              <Kpi
                rotulo="Taxa de aprovação"
                icone="task_alt"
                valor={fmtPct(k.itens ? k.aprovados / k.itens : 0)}
                detalhe={`${fmtInt(k.aprovados)} aprovados · ${fmtInt(k.recusados)} recusados`}
              />
              <Kpi
                rotulo="Pendentes de aprovação"
                icone="pending_actions"
                valor={fmtInt(k.pendentes)}
                detalhe={`Tempo médio até aprovar: ${fmtHoras(k.horas_medias_aprovacao)}`}
              />
              <Kpi
                rotulo="Convertidos em cotação"
                icone="request_quote"
                valor={fmtPct(k.taxa_conversao_cotacao)}
                detalhe={`${fmtInt(k.geraram_cotacao)} itens com cotação gerada`}
              />
            </GradeKpis>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <CartaoGrafico
                className="xl:col-span-2"
                icone="bar_chart"
                titulo="Itens solicitados por mês"
                subtitulo="Quantidade de itens por situação"
                extra={<Legenda series={SERIES_SITUACAO} />}
              >
                <ColunasMensais
                  dados={dados.por_mes}
                  series={SERIES_SITUACAO}
                  formatarEixo={fmtCompacto}
                  formatarValor={fmtInt}
                />
              </CartaoGrafico>

              <CartaoGrafico icone="priority_high" titulo="Prioridade" subtitulo="Distribuição dos itens solicitados">
                <BarraComposicao
                  formatar={fmtInt}
                  partes={dados.por_prioridade.map((p) => ({
                    nome: p.nome,
                    valor: p.total,
                    cor: COR_PRIORIDADE[p.nome] ?? '#c3c5d9',
                  }))}
                />
              </CartaoGrafico>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <CartaoGrafico icone="fact_check" titulo="Situação" subtitulo="Itens por situação de aprovação">
              <BarraComposicao
                formatar={fmtInt}
                partes={[
                  { nome: 'Aprovadas', valor: k.aprovados, cor: SERIE.azul },
                  { nome: 'Recusadas', valor: k.recusados, cor: SERIE.laranja },
                  { nome: 'Pendentes', valor: k.pendentes, cor: SERIE.agua },
                ]}
              />
            </CartaoGrafico>
            <CartaoGrafico className="xl:col-span-2" icone="groups" titulo="Maiores solicitantes" subtitulo="Itens solicitados no período">
              <BarrasRanking
                formatar={fmtInt}
                itens={dados.top_solicitantes.map((s) => ({ nome: s.nome, valor: s.total }))}
              />
            </CartaoGrafico>
            </div>
          </div>
        )
      )}

      <PainelRastreio etapaAtual="solicitacoes" />

      <TabelaRegistros<Solicitacao>
        tabela="solicitacoes"
        titulo="Solicitações"
        icone="list_alt"
        colunas={COLUNAS}
        chave={(s) => s.guid_linha}
        filtro={filtro}
        campoData="dt_solicitacao"
        campoBusca="produto"
        placeholderBusca="Buscar produto..."
        opcoesFiltro={[
          { rotulo: 'Aprovadas', params: { situacao: 'APROVADO' } },
          { rotulo: 'Recusadas', params: { situacao: 'RECUSADO' } },
          { rotulo: 'Pendentes', params: { situacao: 'PENDENTE' } },
          { rotulo: 'Aprovadas sem cotação', params: { situacao: 'APROVADO', gerado_cotacao: false } },
          { rotulo: 'Urgentes', params: { pioridade: 'URGENTE' } },
        ]}
      />
    </div>
  );
};

export default Solicitacoes;
