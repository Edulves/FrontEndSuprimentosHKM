import { useSearchParams } from 'react-router-dom';
import type { Etapa } from '../../types/suprimentos';

// ---------------------------------------------------------------------------
// Metadados das etapas
// ---------------------------------------------------------------------------
export const ETAPAS: Etapa[] = ['solicitacoes', 'cotacoes', 'ordens_de_compras', 'compras'];

export const META_ETAPA: Record<Etapa, { nome: string; curto: string; rota: string; icone: string; campoNumero: string }> = {
  solicitacoes: { nome: 'Solicitação', curto: 'Sol.', rota: '/solicitacoes', icone: 'assignment', campoNumero: 'cod_solicitacao' },
  cotacoes: { nome: 'Cotação', curto: 'Cot.', rota: '/cotacoes', icone: 'request_quote', campoNumero: 'codigo' },
  ordens_de_compras: { nome: 'Ordem de compra', curto: 'OC', rota: '/ordens-de-compra', icone: 'receipt_long', campoNumero: 'codigo' },
  compras: { nome: 'Compra', curto: 'Compra', rota: '/compras', icone: 'shopping_cart', campoNumero: 'codigo' },
};

export interface OrigemRastreio {
  etapa: Etapa;
  numero: number;
  empresa?: number;
}

// ---------------------------------------------------------------------------
// Estado do rastreio na URL: ?rastrear=<etapa>&numero=<n>&empresa=<e>
// ---------------------------------------------------------------------------
export const useOrigemRastreio = (): OrigemRastreio | null => {
  const [params] = useSearchParams();
  const etapa = params.get('rastrear') as Etapa | null;
  const numero = Number(params.get('numero'));
  const empresa = params.get('empresa');
  if (!etapa || !ETAPAS.includes(etapa) || !params.get('numero') || !Number.isFinite(numero)) return null;
  return { etapa, numero, empresa: empresa ? Number(empresa) : undefined };
};

/** Link para a página de `destino` mostrando só as linhas ligadas à origem. */
export const urlRastreio = (destino: Etapa, origem: OrigemRastreio) => {
  const q = new URLSearchParams({ rastrear: origem.etapa, numero: String(origem.numero) });
  if (origem.empresa != null) q.set('empresa', String(origem.empresa));
  return `${META_ETAPA[destino].rota}?${q.toString()}`;
};

export const chaveOrigem = (o: OrigemRastreio | null) => (o ? `${o.etapa}:${o.numero}:${o.empresa ?? ''}` : '');
