import axios from 'axios';

const CHAVE_TOKEN = 'hkm_token';
const CHAVE_USUARIO = 'hkm_usuario';

const ler = (chave: string): string | null => {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
};

export const getToken = () => ler(CHAVE_TOKEN);
export const getUsuario = () => ler(CHAVE_USUARIO);

export const sair = () => {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new Event('hkm-auth'));
};

export const entrar = async (usuario: string, senha: string): Promise<void> => {
  const { data } = await axios.post<{ token: string; usuario: string }>('/suprimentos/auth/login', {
    usuario,
    senha,
  });
  localStorage.setItem(CHAVE_TOKEN, data.token);
  localStorage.setItem(CHAVE_USUARIO, data.usuario);
  window.dispatchEvent(new Event('hkm-auth'));
};
