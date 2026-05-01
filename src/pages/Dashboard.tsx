import React from 'react';
import RevenueCard from '../components/RevenueCard';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  medicamento: string;
  dataPegou: string;
  dataVencimento: string;
}

const Dashboard: React.FC = () => {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);

  const handleDelete = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="revenue-container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        {clientes.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum cliente cadastrado.</p>
        ) : (
          clientes.map(item => (
            <RevenueCard key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
