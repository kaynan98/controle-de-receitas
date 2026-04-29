import React, { useState, useEffect } from 'react';
import RevenueForm from './components/RevenueForm';
import RevenueList from './components/RevenueList';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  medicamento: string;
  dataPegou: string;
  dataVencimento: string;
}

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('clientes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  const adicionarCliente = (cliente: Omit<Cliente, 'id'>) => {
    const novoCliente: Cliente = { ...cliente, id: crypto.randomUUID() };
    setClientes([...clientes, novoCliente]);
  };

  const excluirCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Controle de Receitas</h1>
        <RevenueForm onAdd={adicionarCliente} />
        <RevenueList items={clientes} onDelete={excluirCliente} />
      </div>
    </div>
  );
};

export default App;
