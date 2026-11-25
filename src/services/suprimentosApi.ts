import axios from 'axios';
import { getToken, sair } from './auth';
import type {
  Etapa,
  FiltroResumo,
  Pagina,
  ResumoCompras,
  ResumoCotacoes,
  ResumoOrdens,
  ResumoSolicitacoes,
  Rastreio,
  Vinculos,
} from '../types/suprimentos';

// API Python (backendpython) — proxy '/suprimentos' configurado no vite.config.ts
const suprimentosApi = axios.create({
  baseURL: '/suprimentos',
  headers: { 'Content-Type': 'application/json' },
});

// Envia o token de login e volta para a tela de login se ele expirar.
suprimentosApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
suprimentosApi.interceptors.response.use(
  (r) => r,
  (erro) => {
    if (erro?.response?.status === 401) sair();
    return Promise.reject(erro);
  }
);

export type Tabela = Etapa;

type Params = Record<string, string | number | boolean | undefined | null>;

const limpar = (params: Params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''));

export const getResumo = async <T>(tabela: Tabela, filtro: FiltroResumo): Promise<T> => {
  const { data } = await suprimentosApi.get<T>(`/resumos/${tabela}`, { params: limpar({ ...filtro }) });
  return data;
};

export const getResumoSolicitacoes = (f: FiltroResumo) => getResumo<ResumoSolicitacoes>('solicitacoes', f);
export const getResumoCotacoes = (f: FiltroResumo) => getResumo<ResumoCotacoes>('cotacoes', f);
export const getResumoOrdens = (f: FiltroResumo) => getResumo<ResumoOrdens>('ordens_de_compras', f);
export const getResumoCompras = (f: FiltroResumo) => getResumo<ResumoCompras>('compras', f);

let empresasCache: Promise<number[]> | null = null;

/** Códigos de empresa existentes no banco (cacheado durante a sessão). */
export const getEmpresas = (): Promise<number[]> => {
  if (!empresasCache) {
    empresasCache = suprimentosApi
      .get<number[]>('/resumos/empresas')
      .then((r) => r.data)
      .catch((e) => {
        empresasCache = null;
        throw e;
      });
  }
  return empresasCache;
};

export const listar = async <T>(tabela: Tabela, params: Params): Promise<Pagina<T>> => {
  const { data } = await suprimentosApi.get<Pagina<T>>(`/${tabela}`, { params: limpar(params) });
  return data;
};

/** Cadeia solicitação → cotação → OC → compra ligada a um número. */
export const getRastreio = async (etapa: Etapa, numero: number, cod_empresa?: number | null): Promise<Rastreio> => {
  const { data } = await suprimentosApi.get<Rastreio>('/rastreio', { params: limpar({ etapa, numero, cod_empresa }) });
  return data;
};

/** Números das etapas anterior e seguinte de cada linha (guid_linha). */
export const getVinculos = async (etapa: Etapa, guids: string[]): Promise<Vinculos> => {
  if (!guids.length) return {};
  const { data } = await suprimentosApi.get<Vinculos>('/rastreio/vinculos', { params: { etapa, guids: guids.join(',') } });
  return data;
};

export default suprimentosApi;
