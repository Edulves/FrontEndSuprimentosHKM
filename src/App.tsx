import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LocalizadorFornecedores from './pages/LocalizadorFornecedores';
import Solicitacoes from './pages/Solicitacoes';
import Cotacoes from './pages/Cotacoes';
import OrdensCompra from './pages/OrdensCompra';
import Compras from './pages/Compras';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { getToken } from './services/auth';

function App() {
  const [logado, setLogado] = useState(() => !!getToken());

  useEffect(() => {
    const atualizar = () => setLogado(!!getToken());
    window.addEventListener('hkm-auth', atualizar);
    window.addEventListener('storage', atualizar);
    return () => {
      window.removeEventListener('hkm-auth', atualizar);
      window.removeEventListener('storage', atualizar);
    };
  }, []);

  if (!logado) return <Login />;

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LocalizadorFornecedores />} />
          <Route path="/solicitacoes" element={<Solicitacoes />} />
          <Route path="/cotacoes" element={<Cotacoes />} />
          <Route path="/ordens-de-compra" element={<OrdensCompra />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
