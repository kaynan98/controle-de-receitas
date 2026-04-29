import React, { useState } from 'react';

interface RevenueFormProps {
  onAdd: (cliente: { nome: string; telefone: string; medicamento: string; dataPegou: string; dataVencimento: string }) => void;
}

const RevenueForm: React.FC<RevenueFormProps> = ({ onAdd }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [dataPegou, setDataPegou] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone || !medicamento || !dataPegou || !dataVencimento) {
      alert('Preencha todos os campos!');
      return;
    }
    onAdd({ nome, telefone, medicamento, dataPegou, dataVencimento });
    setNome('');
    setTelefone('');
    setMedicamento('');
    setDataPegou('');
    setDataVencimento('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Nome do cliente" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="(11) 99999-9999" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Medicamento</label>
          <input type="text" value={medicamento} onChange={e => setMedicamento(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Nome do medicamento" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data que pegou</label>
          <input type="date" value={dataPegou} onChange={e => setDataPegou(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Data de vencimento da receita</label>
          <input type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Cadastrar</button>
    </form>
  );
};

export default RevenueForm;
