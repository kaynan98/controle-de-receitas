import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RevenueFormPage from './pages/RevenueFormPage';
import RevenueListPage from './pages/RevenueListPage';
import './styles/Revenue.css';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  medicamento: string;
  dataPegou: string;
  dataVencimento: string;
}

function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const handleAddCliente = (cliente: { nome: string; telefone: string; medicamento: string; dataPegou: string; dataVencimento: string }) => {
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      ...cliente,
    };
    setClientes(prev => [...prev, novoCliente]);
  };

  const handleDeleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/cadastrar" className="hover:underline">Cadastrar</Link>
            <Link to="/lista" className="hover:underline">Lista</Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastrar" element={<RevenueFormPage onAdd={handleAddCliente} />} />
            <Route path="/lista" element={<RevenueListPage items={clientes} onDelete={handleDeleteCliente} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
