import axios from 'axios';
import type { Material, Fornecedor } from '../types/api';

// Configuração base do axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço para buscar lista de materiais/produtos
export const getMateriais = async (): Promise<Material[]> => {
  try {
    const response = await api.get<Material[]>('/FornecedoresXMateriais');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    throw error;
  }
};

// Serviço para buscar fornecedores de um material específico
export const getFornecedoresDeUmMaterial = async (codInternoProduto?: string): Promise<Fornecedor[]> => {
  try {
    const response = await api.get<Fornecedor[]>('/FornecedoresXMateriais/FornecedoresDeUmMaterial', {
      params: codInternoProduto ? { CodInternoProduto: codInternoProduto } : undefined
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    throw error;
  }
};

export default api;
