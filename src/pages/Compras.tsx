import React from 'react';
import { getResumoCompras } from '../services/suprimentosApi';
import type { Compra } from '../types/suprimentos';
import { fmtCompacto, fmtData, fmtDec1, fmtInt, fmtMoeda, fmtMoedaCompacta, fmtNum } from '../utils/format';
import { AreaMensal, BarrasRanking, ColunasMensais, SERIE } from '../components/dashboard/Charts';
import TabelaRegistros, { type Coluna } from '../components/dashboard/TabelaRegistros';
import {
  CartaoGrafico,
  Carregando,
  Erro,
  FiltroPeriodo,
  GradeKpis,
  Kpi,
  PageHeader,
} from '../components/dashboard/Ui';
import { useFiltroPeriodo, useResumo } from '../components/dashboard/useResumo';

const COLUNAS: Coluna<Compra>[] = [
  {
    cabecalho: 'Compra',
    campo: 'codigo',
    render: (c) => <span className="font-mono text-[13px] font-semibold text-primary">{c.codigo}</span>,
  },
  { cabecalho: 'Lançamento', campo: 'dt_lancamento', render: (c) => fmtData(c.dt_lancamento), className: 'whitespace-nowrap' },
  {
    cabecalho: 'NF',
    campo: 'n_nf',
    render: (c) => (
      <div className="flex flex-col">
        <span className="font-mono text-[12px]">{c.n_nf ?? '—'}</span>
        <span className="text-[11px] text-outline">{fmtData(c.dt_nf)}</span>
      </div>
    ),
  },
  {
    cabecalho: 'Produto',
    campo: 'produto',
    render: (c) => (
      <div className="flex flex-col max-w-[380px]">
        <span className="font-medium truncate" title={c.produto ?? ''}>{c.produto ?? '—'}</span>
        <span className="font-mono text-[11px] text-outline">{c.cod_interno}</span>
      </div>
    ),
  },
  { cabecalho: 'Qtde', campo: 'qtde', alinhar: 'dir', className: 'whitespace-nowrap', render: (c) => `${fmtNum(c.qtde)} ${c.unidade ?? ''}` },
  { cabecalho: 'Vl. unitário', campo: 'vl_unitario', alinhar: 'dir', className: 'whitespace-nowrap', render: (c) => fmtMoeda(c.vl_unitario) },
  { cabecalho: 'Total', campo: 'total', alinhar: 'dir', className: 'whitespace-nowrap', render: (c) => <strong>{fmtMoeda(c.total)}</strong> },
  { cabecalho: 'Recebimento', campo: 'dt_recebimento', render: (c) => fmtData(c.dt_recebimento), className: 'whitespace-nowrap' },
  { cabecalho: 'Usuário', campo: 'usuario', render: (c) => c.usuario ?? '—' },
];

const Compras: React.FC = () => {
  const { preset, filtro, alterar } = useFiltroPeriodo('12m');
  const { dados, carregando, erro } = useResumo(getResumoCompras, filtro);
  const k = dados?.kpis;

  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeader
        icone="inventory"
        etiqueta="Etapa 4 · Compras"
        titulo="Acompanhamento de Compras"
        descricao="Compras lançadas a partir das notas fiscais recebidas: valor gasto, volume de itens, prazo entre emissão da NF e recebimento e maiores gastos por produto."
        endpoint="GET /resumos/compras"
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
                rotulo="Valor comprado"
                icone="payments"
                valor={fmtMoedaCompacta(k.valor_total)}
                detalhe={`${fmtInt(k.compras)} compras · ${fmtInt(k.itens)} itens`}
              />
              <Kpi
                rotulo="Notas fiscais"
                icone="receipt_long"
                valor={fmtInt(k.notas_fiscais)}
                detalhe={`${fmtInt(k.produtos_distintos)} produtos distintos`}
              />
              <Kpi
                rotulo="Ticket médio por item"
                icone="sell"
                valor={fmtMoedaCompacta(k.ticket_medio_item)}
                detalhe="Valor total ÷ itens lançados"
              />
              <Kpi
                rotulo="NF → recebimento"
                icone="local_shipping"
                valor={`${fmtDec1(k.dias_medios_nf_recebimento)} dias`}
                detalhe="Prazo médio entre emissão da NF e recebimento"
              />
            </GradeKpis>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CartaoGrafico icone="bar_chart" titulo="Valor comprado por mês" subtitulo="Pela data de lançamento (R$)">
                <ColunasMensais
                  dados={dados.por_mes}
                  series={[{ chave: 'valor', nome: 'Valor', cor: SERIE.azul }]}
                  formatarEixo={fmtMoedaCompacta}
                  formatarValor={fmtMoeda}
                />
              </CartaoGrafico>
              <CartaoGrafico icone="show_chart" titulo="Itens lançados por mês" subtitulo="Quantidade de linhas de compra">
                <AreaMensal
                  dados={dados.por_mes}
                  serie={{ chave: 'itens', nome: 'Itens', cor: SERIE.azul }}
                  formatarEixo={fmtCompacto}
                  formatarValor={fmtInt}
                />
              </CartaoGrafico>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CartaoGrafico icone="inventory_2" titulo="Maiores gastos por produto" subtitulo="Por valor comprado">
                <BarrasRanking
                  formatar={fmtMoedaCompacta}
                  itens={dados.top_produtos.map((p) => ({
                    nome: p.nome,
                    valor: p.valor,
                    detalhe: `${fmtInt(p.itens)} itens`,
                  }))}
                />
              </CartaoGrafico>
              <CartaoGrafico icone="badge" titulo="Lançamentos por usuário" subtitulo="Itens lançados no período">
                <BarrasRanking
                  formatar={fmtInt}
                  itens={dados.por_usuario.map((u) => ({
                    nome: u.nome,
                    valor: u.itens,
                    detalhe: fmtMoedaCompacta(u.valor),
                  }))}
                />
              </CartaoGrafico>
            </div>
          </div>
        )
      )}

      <TabelaRegistros<Compra>
        tabela="compras"
        titulo="Compras"
        icone="list_alt"
        colunas={COLUNAS}
        chave={(c) => c.guid_linha}
        filtro={filtro}
        campoData="dt_lancamento"
        campoBusca="produto"
        placeholderBusca="Buscar produto..."
        opcoesFiltro={[
          { rotulo: 'Recebidas', params: { dt_recebimento__nulo: false } },
          { rotulo: 'Sem data de recebimento', params: { dt_recebimento__nulo: true } },
        ]}
      />
    </div>
  );
};

export default Compras;
