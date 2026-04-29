import React from 'react';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  medicamento: string;
  dataPegou: string;
  dataVencimento: string;
}

interface RevenueCardProps {
  item: Cliente;
  onDelete: (id: string) => void;
}

const RevenueCard: React.FC<RevenueCardProps> = ({ item, onDelete }) => {
  const hoje = new Date();
  const vencimento = new Date(item.dataVencimento);
  const diff = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  const vencido = diff < 0;
  const venceHoje = diff === 0;

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${vencido ? 'bg-red-100 border-red-400' : venceHoje ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{item.nome}</h3>
          <p className="text-sm text-gray-600">Medicamento: {item.medicamento}</p>
          <p className="text-sm text-gray-600">Telefone: {item.telefone}</p>
          <p className="text-sm text-gray-600">Data que pegou: {item.dataPegou}</p>
          <p className="text-sm text-gray-600">Vencimento: {item.dataVencimento}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${vencido ? 'bg-red-500 text-white' : venceHoje ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
            {vencido ? '⚠️ Vencido' : venceHoje ? '⏰ Vence hoje' : `✅ ${diff} dias restantes`}
          </span>
        </div>
      </div>
      <button onClick={() => onDelete(item.id)} className="mt-2 text-red-600 hover:text-red-800 text-sm">Excluir</button>
    </div>
  );
};

export default RevenueCard;
