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

interface RevenueListPageProps {
  items: Cliente[];
  onDelete: (id: string) => void;
}

const RevenueListPage: React.FC<RevenueListPageProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Nenhum cliente cadastrado ainda.</p>;
  }

  return (
    <div className="revenue-container">
      <h1 className="text-2xl font-bold mb-6">Clientes Cadastrados ({items.length})</h1>
      <div className="space-y-4">
        {items.map(item => (
          <RevenueCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default RevenueListPage;
