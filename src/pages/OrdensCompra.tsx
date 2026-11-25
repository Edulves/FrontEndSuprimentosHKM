import React from 'react';
import { getResumoOrdens } from '../services/suprimentosApi';
import type { OrdemCompra } from '../types/suprimentos';
import { fmtCompacto, fmtData, fmtInt, fmtMoeda, fmtMoedaCompacta, fmtNum, fmtPct } from '../utils/format';
import { AreaMensal, BarraComposicao, BarrasRanking, ColunasMensais, SERIE } from '../components/dashboard/Charts';
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

const COR_SITUACAO: Record<string, string> = {
  'APROVADA E ENVIADA': SERIE.azul,
  'AGUARDANDO APROVAÇÃO': SERIE.laranja,
  'APROVADA, NÃO ENVIADA': SERIE.agua,
};

const situacaoOc = (o: OrdemCompra) => {
  if (!o.aprovado) return <Etiqueta tom="alerta">Aguardando aprovação</Etiqueta>;
  if (!o.enviado_fornecedor) return <Etiqueta tom="info">Aprovada, não enviada</Etiqueta>;
  return <Etiqueta tom="ok">Enviada</Etiqueta>;
};

const COLUNAS: Coluna<OrdemCompra>[] = [
  {
    cabecalho: 'OC',
    campo: 'codigo',
    render: (o) => <span className="font-mono text-[13px] font-semibold text-primary">{o.codigo}</span>,
  },
  { cabecalho: 'Data', campo: 'data', render: (o) => fmtData(o.data), className: 'whitespace-nowrap' },
  {
    cabecalho: 'Fornecedor',
    campo: 'fornecedor',
    render: (o) => (
      <span className="font-medium block max-w-[240px] truncate" title={o.fornecedor ?? ''}>
        {o.fornecedor ?? '—'}
      </span>
    ),
  },
  {
    cabecalho: 'Produto',
    campo: 'descricao',
    render: (o) => (
      <div className="flex flex-col max-w-[320px]">
        <span className="truncate" title={o.descricao ?? ''}>{o.descricao ?? '—'}</span>
        <span className="font-mono text-[11px] text-outline">{o.cod_interno}</span>
      </div>
    ),
  },
  { cabecalho: 'Qtde', campo: 'qtde', alinhar: 'dir', className: 'whitespace-nowrap', render: (o) => `${fmtNum(o.qtde)} ${o.unidade ?? ''}` },
  { cabecalho: 'Total', campo: 'total', alinhar: 'dir', className: 'whitespace-nowrap', render: (o) => <strong>{fmtMoeda(o.total)}</strong> },
  {
    cabecalho: 'Entrega prevista',
    campo: 'dt_prevista_entrega',
    render: (o) => fmtData(o.dt_prevista_entrega),
    className: 'whitespace-nowrap',
  },
  { cabecalho: 'Situação', campo: 'aprovado', render: situacaoOc },
];

const OrdensCompra: React.FC = () => {
  const { preset, filtro, alterar } = useFiltroPeriodo('12m');
  const { dados, carregando, erro } = useResumo(getResumoOrdens, filtro);
  const k = dados?.kpis;
  // Um único item respondendo por mais da metade do valor do período costuma ser erro de digitação
  const discrepante =
    k && dados.maiores_itens[0] && k.valor_total > 0 && dados.maiores_itens[0].total / k.valor_total > 0.5
      ? dados.maiores_itens[0]
      : null;

  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeader
        icone="shopping_cart_checkout"
        etiqueta="Etapa 3 · Ordens de Compra"
        titulo="Acompanhamento de Ordens de Compra"
        descricao="Valor comprometido em ordens de compra, aprovação e envio aos fornecedores, e concentração por fornecedor e forma de pagamento."
        endpoint="GET /resumos/ordens_de_compras"
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
                rotulo="Valor em OCs"
                icone="payments"
                valor={fmtMoedaCompacta(k.valor_total)}
                detalhe={`${fmtInt(k.ordens)} ordens · ${fmtInt(k.itens)} itens`}
              />
              <Kpi
                rotulo="Ticket médio por OC"
                icone="receipt_long"
                valor={fmtMoedaCompacta(k.ticket_medio_oc)}
                detalhe={`${fmtInt(k.fornecedores)} fornecedores no período`}
              />
              <Kpi
                rotulo="Aguardando aprovação"
                icone="pending_actions"
                valor={fmtInt(k.aguardando_aprovacao)}
                detalhe={`${fmtPct(k.itens ? k.aguardando_aprovacao / k.itens : 0)} dos itens`}
              />
              <Kpi
                rotulo="Enviadas ao fornecedor"
                icone="outgoing_mail"
                valor={fmtPct(k.itens ? k.enviados_fornecedor / k.itens : 0)}
                detalhe={`${fmtInt(k.enviados_fornecedor)} itens enviados`}
              />
            </GradeKpis>

            {discrepante && (
              <div className="bg-[#fff4dc] border border-[#eda100] rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8a5a00]">warning</span>
                <div className="flex-1 font-body-sm text-body-sm text-[#5c3d00]">
                  <p className="font-title-sm text-title-sm">
                    Possível valor discrepante: um único item responde por{' '}
                    {fmtPct(discrepante.total / k.valor_total)} do valor do período
                  </p>
                  <p className="mt-1">
                    OC <strong className="font-mono">{discrepante.codigo}</strong> (empresa {discrepante.cod_empresa},{' '}
                    {fmtData(discrepante.data)}) · {discrepante.fornecedor} · {discrepante.descricao} ·{' '}
                    <strong>
                      {fmtNum(discrepante.qtde)} {discrepante.unidade}
                    </strong>{' '}
                    × {fmtMoeda(discrepante.preco_unitario)} = <strong>{fmtMoeda(discrepante.total)}</strong>. Verifique
                    a quantidade no ERP; os gráficos de valor abaixo incluem esse item.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CartaoGrafico icone="bar_chart" titulo="Valor em ordens de compra por mês" subtitulo="Soma do total dos itens (R$)">
                <ColunasMensais
                  dados={dados.por_mes}
                  series={[{ chave: 'valor', nome: 'Valor', cor: SERIE.azul }]}
                  formatarEixo={fmtMoedaCompacta}
                  formatarValor={fmtMoeda}
                />
              </CartaoGrafico>
              <CartaoGrafico icone="show_chart" titulo="Itens em ordens de compra por mês" subtitulo="Quantidade de linhas de OC">
                <AreaMensal
                  dados={dados.por_mes}
                  serie={{ chave: 'itens', nome: 'Itens', cor: SERIE.azul }}
                  formatarEixo={fmtCompacto}
                  formatarValor={fmtInt}
                />
              </CartaoGrafico>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <CartaoGrafico icone="verified" titulo="Aprovação e envio" subtitulo="Situação dos itens de OC">
                <BarraComposicao
                  formatar={fmtInt}
                  partes={dados.por_situacao.map((s) => ({
                    nome: s.nome,
                    valor: s.total,
                    cor: COR_SITUACAO[s.nome] ?? '#c3c5d9',
                  }))}
                />
              </CartaoGrafico>
              <CartaoGrafico icone="storefront" titulo="Maiores fornecedores" subtitulo="Por valor em OC">
                <BarrasRanking
                  formatar={fmtMoedaCompacta}
                  itens={dados.top_fornecedores.map((f) => ({
                    nome: f.nome,
                    valor: f.valor,
                    detalhe: `${fmtInt(f.itens)} itens`,
                  }))}
                />
              </CartaoGrafico>
              <CartaoGrafico icone="credit_card" titulo="Formas de pagamento" subtitulo="Por valor em OC">
                <BarrasRanking
                  formatar={fmtMoedaCompacta}
                  itens={dados.formas_pagamento.map((f) => ({
                    nome: f.nome,
                    valor: f.valor,
                    detalhe: `${fmtInt(f.itens)} itens`,
                  }))}
                />
              </CartaoGrafico>
            </div>
          </div>
        )
      )}

      <TabelaRegistros<OrdemCompra>
        tabela="ordens_de_compras"
        titulo="Ordens de compra"
        icone="list_alt"
        colunas={COLUNAS}
        chave={(o) => o.guid_linha}
        filtro={filtro}
        campoData="data"
        campoBusca="fornecedor"
        placeholderBusca="Buscar fornecedor..."
        opcoesFiltro={[
          { rotulo: 'Aguardando aprovação', params: { aprovado: false } },
          { rotulo: 'Aprovadas, não enviadas', params: { aprovado: true, enviado_fornecedor: false } },
          { rotulo: 'Enviadas ao fornecedor', params: { enviado_fornecedor: true } },
        ]}
      />
    </div>
  );
};

export default OrdensCompra;
