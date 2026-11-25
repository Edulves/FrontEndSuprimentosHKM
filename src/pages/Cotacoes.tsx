import React from 'react';
import { getResumoCotacoes } from '../services/suprimentosApi';
import type { Cotacao } from '../types/suprimentos';
import { fmtCompacto, fmtData, fmtDec1, fmtInt, fmtNum, fmtPct } from '../utils/format';
import { BarraComposicao, BarrasRanking, ColunasMensais, Legenda, SERIE, type Serie } from '../components/dashboard/Charts';
import TabelaRegistros, { type Coluna } from '../components/dashboard/TabelaRegistros';
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

const SERIES_MES: Serie[] = [
  { chave: 'com_oc', nome: 'Com OC', cor: SERIE.azul },
  { chave: 'sem_oc', nome: 'Sem OC', cor: SERIE.laranja },
];

const COR_SITUACAO: Record<string, string> = {
  'COM OC': SERIE.azul,
  'VENCIDA SEM OC': SERIE.laranja,
  'EM ABERTO': SERIE.agua,
};

const situacaoCotacao = (c: Cotacao) => {
  if (c.gerado_ordem_compra) return <Etiqueta tom="ok">Com OC</Etiqueta>;
  if (c.dt_validade && new Date(c.dt_validade) < new Date()) return <Etiqueta tom="erro">Vencida sem OC</Etiqueta>;
  return <Etiqueta tom="alerta">Em aberto</Etiqueta>;
};

const hojeIso = () => new Date().toISOString().slice(0, 19);

const COLUNAS: Coluna<Cotacao>[] = [
  {
    cabecalho: 'Nº',
    campo: 'codigo',
    render: (c) => <span className="font-mono text-[13px] font-semibold text-primary">{c.codigo}</span>,
  },
  { cabecalho: 'Data', campo: 'data', render: (c) => fmtData(c.data), className: 'whitespace-nowrap' },
  {
    cabecalho: 'Produto',
    campo: 'descricao',
    render: (c) => (
      <div className="flex flex-col max-w-[420px]">
        <span className="font-medium truncate" title={c.descricao ?? ''}>{c.descricao ?? '—'}</span>
        <span className="font-mono text-[11px] text-outline">{c.cod_interno}</span>
      </div>
    ),
  },
  { cabecalho: 'Qtde', campo: 'qtde', alinhar: 'dir', className: 'whitespace-nowrap', render: (c) => `${fmtNum(c.qtde)} ${c.unidade ?? ''}` },
  { cabecalho: 'Validade', campo: 'dt_validade', render: (c) => fmtData(c.dt_validade), className: 'whitespace-nowrap' },
  { cabecalho: 'Situação', campo: 'gerado_ordem_compra', render: situacaoCotacao },
  { cabecalho: 'Empresa', campo: 'cod_empresa', render: (c) => c.cod_empresa },
];

const Cotacoes: React.FC = () => {
  const { preset, filtro, alterar } = useFiltroPeriodo('12m');
  const { dados, carregando, erro } = useResumo(getResumoCotacoes, filtro);
  const k = dados?.kpis;
  const porMes = dados?.por_mes.map((m) => ({ ...m, sem_oc: m.total - m.com_oc })) ?? [];
  const totalFaixas = dados?.fornecedores_por_cotacao.reduce((a, f) => a + f.total, 0) ?? 0;

  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeader
        icone="request_quote"
        etiqueta="Etapa 2 · Cotações"
        titulo="Acompanhamento de Cotações"
        descricao="Cotações abertas, quantos fornecedores foram consultados por cotação e quanto já foi convertido em ordem de compra."
        endpoint="GET /resumos/cotacoes"
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
                rotulo="Cotações"
                icone="request_quote"
                valor={fmtInt(k.cotacoes)}
                detalhe={`${fmtInt(k.itens)} itens · ${fmtInt(k.produtos_distintos)} produtos distintos`}
              />
              <Kpi
                rotulo="Convertidos em OC"
                icone="shopping_cart_checkout"
                valor={fmtPct(k.taxa_conversao_oc)}
                detalhe={`${fmtInt(k.com_oc)} itens com ordem de compra`}
              />
              <Kpi
                rotulo="Em aberto"
                icone="hourglass_top"
                valor={fmtInt(k.em_aberto)}
                detalhe={`${fmtInt(k.vencidas_sem_oc)} vencidas sem OC`}
              />
              <Kpi
                rotulo="Fornecedores por cotação"
                icone="storefront"
                valor={fmtDec1(k.media_fornecedores_por_cotacao)}
                detalhe="Média de fornecedores consultados"
              />
            </GradeKpis>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <CartaoGrafico
                className="xl:col-span-2"
                icone="bar_chart"
                titulo="Itens cotados por mês"
                subtitulo="Itens que já geraram OC × ainda sem OC"
                extra={<Legenda series={SERIES_MES} />}
              >
                <ColunasMensais dados={porMes} series={SERIES_MES} formatarEixo={fmtCompacto} formatarValor={fmtInt} />
              </CartaoGrafico>

              <CartaoGrafico icone="donut_large" titulo="Situação dos itens" subtitulo="Conversão em ordem de compra">
                <BarraComposicao
                  formatar={fmtInt}
                  partes={dados.por_situacao.map((s) => ({
                    nome: s.nome,
                    valor: s.total,
                    cor: COR_SITUACAO[s.nome] ?? '#c3c5d9',
                  }))}
                />
              </CartaoGrafico>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CartaoGrafico
                icone="storefront"
                titulo="Fornecedores consultados por cotação"
                subtitulo="Quantas cotações tiveram 1, 2, 3 ou 4+ fornecedores negociados"
              >
                <BarrasRanking
                  formatar={fmtInt}
                  itens={dados.fornecedores_por_cotacao.map((f) => ({
                    nome: `${f.faixa} fornecedor${f.faixa === '1' ? '' : 'es'}`,
                    valor: f.total,
                    detalhe: totalFaixas ? fmtPct(f.total / totalFaixas) : undefined,
                  }))}
                />
              </CartaoGrafico>

              <CartaoGrafico icone="inventory_2" titulo="Produtos mais cotados" subtitulo="Itens de cotação no período">
                <BarrasRanking
                  formatar={fmtInt}
                  itens={dados.top_produtos.map((p) => ({ nome: p.nome, valor: p.total }))}
                />
              </CartaoGrafico>
            </div>
          </div>
        )
      )}

      <TabelaRegistros<Cotacao>
        tabela="cotacoes"
        titulo="Cotações"
        icone="list_alt"
        colunas={COLUNAS}
        chave={(c) => c.guid_linha}
        filtro={filtro}
        campoData="data"
        campoBusca="descricao"
        placeholderBusca="Buscar produto..."
        opcoesFiltro={[
          { rotulo: 'Com OC', params: { gerado_ordem_compra: true } },
          { rotulo: 'Sem OC', params: { gerado_ordem_compra: false } },
          { rotulo: 'Vencidas sem OC', params: { gerado_ordem_compra: false, dt_validade__max: hojeIso() } },
        ]}
      />
    </div>
  );
};

export default Cotacoes;
