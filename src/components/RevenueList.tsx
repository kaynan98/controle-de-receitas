import React from 'react';
import RevenueCard from './RevenueCard';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  medicamento: string;
  dataPegou: string;
  dataVencimento: string;
}

interface RevenueListProps {
  items: Cliente[];
  onDelete: (id: string) => void;
}

const RevenueList: React.FC<RevenueListProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Nenhum cliente cadastrado ainda.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Clientes Cadastrados ({items.length})</h2>
      <div className="space-y-4">
        {items.map(item => (
          <RevenueCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default RevenueList;
