import React, { useState } from 'react';
import axios from 'axios';
import { entrar } from '../services/auth';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await entrar(usuario, senha);
    } catch (err) {
      setErro(
        axios.isAxiosError(err) && err.response?.status === 401
          ? 'Usuário ou senha inválidos.'
          : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm bg-surface-container-lowest rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-5"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-title-md text-title-md text-on-surface">Suprimentos HKM</span>
            <span className="font-label-sm text-label-sm text-secondary uppercase">Acesso ao sistema</span>
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Usuário</span>
          <input
            autoFocus
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="border border-outline-variant rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border border-outline-variant rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container"
            required
          />
        </label>

        {erro && (
          <div className="bg-error-container text-on-error-container rounded px-3 py-2 text-sm">{erro}</div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="bg-primary-container text-on-primary rounded py-2 font-title-sm text-title-sm hover:bg-primary transition-colors disabled:opacity-60"
        >
          {carregando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
