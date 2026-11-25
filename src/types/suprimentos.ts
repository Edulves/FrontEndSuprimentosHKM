// Tipos da API Python (backendpython) — solicitações, cotações, ordens de compra e compras

export interface Pagina<T> {
  total: number;
  pagina: number;
  tamanho_pagina: number;
  total_paginas: number;
  itens: T[];
}

export interface FiltroResumo {
  dt_inicio?: string; // YYYY-MM-DD
  dt_fim?: string;
  cod_empresa?: number;
}

export interface Contagem {
  nome: string;
  total: number;
}

// ---------- Registros ----------
export interface Solicitacao {
  guid_linha: string;
  cod_empresa: number;
  cod_solicitacao: number;
  cod_interno: string | null;
  produto: string | null;
  unidade: string | null;
  qtde: number | null;
  dt_necessidade: string | null;
  dt_solicitacao: string | null;
  dt_prevista_entrega: string | null;
  pioridade: string | null;
  situacao: string | null;
  solicitante: string | null;
  usuario: string | null;
  nome_usuario_alt_situacao: string | null;
  dt_alt_situacao: string | null;
  gerado_cotacao: boolean | null;
  motivo_recusado: string | null;
  guid_cotacao: string | null;
}

export interface Cotacao {
  guid_linha: string;
  cod_empresa: number;
  codigo: number;
  cod_interno: string | null;
  descricao: string | null;
  unidade: string | null;
  qtde: number | null;
  data: string | null;
  dt_validade: string | null;
  gerado_ordem_compra: boolean | null;
  cod_produto: number | null;
}

export interface OrdemCompra {
  guid_linha: string;
  cod_empresa: number;
  codigo: number;
  cod_interno: string | null;
  descricao: string | null;
  unidade: string | null;
  qtde: number | null;
  preco_unitario: number | null;
  total: number | null;
  data: string | null;
  cod_fornecedor: number | null;
  fornecedor: string | null;
  dt_envio_oc: string | null;
  dt_prevista_entrega: string | null;
  enviado_fornecedor: boolean | null;
  aprovado: boolean | null;
  forma_pgto: string | null;
}

export interface Compra {
  guid_linha: string;
  cod_empresa: number;
  codigo: number;
  cod_interno: string | null;
  produto: string | null;
  unidade: string | null;
  qtde: number | null;
  vl_unitario: number | null;
  total: number | null;
  dt_lancamento: string | null;
  dt_recebimento: string | null;
  dt_nf: string | null;
  n_nf: number | null;
  fabricante: string | null;
  usuario: string | null;
}

// ---------- Resumos ----------
export interface ResumoSolicitacoes {
  kpis: {
    itens: number;
    solicitacoes: number;
    aprovados: number;
    recusados: number;
    pendentes: number;
    geraram_cotacao: number;
    taxa_conversao_cotacao: number;
    horas_medias_aprovacao: number;
    urgentes: number;
  };
  por_mes: { mes: string; total: number; aprovados: number; recusados: number; pendentes: number; geraram_cotacao: number }[];
  por_situacao: Contagem[];
  por_prioridade: Contagem[];
  top_solicitantes: Contagem[];
}

export interface ResumoCotacoes {
  kpis: {
    itens: number;
    cotacoes: number;
    com_oc: number;
    vencidas_sem_oc: number;
    em_aberto: number;
    produtos_distintos: number;
    taxa_conversao_oc: number;
    media_fornecedores_por_cotacao: number;
  };
  por_mes: { mes: string; total: number; com_oc: number }[];
  por_situacao: Contagem[];
  fornecedores_por_cotacao: { faixa: string; total: number }[];
  top_produtos: Contagem[];
}

export interface ResumoOrdens {
  kpis: {
    itens: number;
    ordens: number;
    valor_total: number;
    ticket_medio_oc: number;
    aprovados: number;
    aguardando_aprovacao: number;
    enviados_fornecedor: number;
    fornecedores: number;
  };
  por_mes: { mes: string; itens: number; valor: number }[];
  por_situacao: Contagem[];
  top_fornecedores: { nome: string; valor: number; itens: number }[];
  formas_pagamento: { nome: string; valor: number; itens: number }[];
  maiores_itens: {
    codigo: number;
    cod_empresa: number;
    data: string | null;
    fornecedor: string | null;
    descricao: string | null;
    qtde: number;
    unidade: string | null;
    preco_unitario: number;
    total: number;
  }[];
}

export interface ResumoCompras {
  kpis: {
    itens: number;
    compras: number;
    valor_total: number;
    notas_fiscais: number;
    produtos_distintos: number;
    dias_medios_nf_recebimento: number;
    ticket_medio_item: number;
  };
  por_mes: { mes: string; itens: number; valor: number }[];
  por_status: Contagem[];
  top_produtos: { nome: string; valor: number; itens: number }[];
  por_usuario: { nome: string; itens: number; valor: number }[];
}

// ---------- Rastreio (solicitação → cotação → OC → compra) ----------
export type Etapa = 'solicitacoes' | 'cotacoes' | 'ordens_de_compras' | 'compras';

export interface NumeroEtapa {
  numero: number;
  cod_empresa: number;
  itens?: number;
}

export interface Rastreio {
  origem: { etapa: Etapa; numero: number; cod_empresa: number | null };
  encontrado: boolean;
  etapas: Record<Etapa, { itens: number; numeros: NumeroEtapa[] }>;
}

export type Vinculos = Record<string, { anterior: NumeroEtapa[]; proxima: NumeroEtapa[] }>;
