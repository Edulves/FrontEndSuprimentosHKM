import { useEffect, useState } from 'react';
import type { FiltroResumo } from '../../types/suprimentos';
import { filtroDoPreset, type Preset } from './Ui';

/** Estado do filtro de período compartilhado entre resumo e tabela. */
export const useFiltroPeriodo = (inicial: Exclude<Preset, 'custom'> = '12m') => {
  const [preset, setPreset] = useState<Preset>(inicial);
  const [filtro, setFiltro] = useState<FiltroResumo>(() => filtroDoPreset(inicial));
  const alterar = (p: Preset, f: FiltroResumo) => {
    setPreset(p);
    setFiltro(f);
  };
  return { preset, filtro, alterar };
};

/** Carrega um resumo agregado sempre que o filtro muda. */
export function useResumo<T>(buscar: (f: FiltroResumo) => Promise<T>, filtro: FiltroResumo) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    buscar(filtro)
      .then((d) => ativo && setDados(d))
      .catch((e) => {
        console.error('Erro ao carregar resumo:', e);
        if (ativo) setErro('Erro ao carregar o resumo. Verifique se a API de suprimentos está rodando.');
      })
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [buscar, filtro]);

  return { dados, carregando, erro };
}
