import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Patient } from '@/types';
import { useState } from 'react';

export function Pacientes() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', []);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) return;
    if (editId) {
      setPatients(prev => prev.map(p => p.id === editId ? { ...p, nome: nome.trim(), telefone: telefone.trim() } : p));
      setEditId(null);
    } else {
      const novo: Patient = { id: crypto.randomUUID(), nome: nome.trim(), telefone: telefone.trim(), createdAt: new Date().toISOString() };
      setPatients(prev => [...prev, novo]);
    }
    setNome('');
    setTelefone('');
  };

  const handleEdit = (p: Patient) => {
    setNome(p.nome);
    setTelefone(p.telefone);
    setEditId(p.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pacientes</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do paciente"
          className="flex-1 p-2 border rounded"
          required
        />
        <input
          type="text"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
          placeholder="Telefone"
          className="w-40 p-2 border rounded"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold">
          {editId ? 'Atualizar' : 'Adicionar'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setNome(''); setTelefone(''); }} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
        )}
      </form>

      {patients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum paciente cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {patients.map(p => (
            <div key={p.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.nome}</p>
                <p className="text-sm text-gray-600">{p.telefone}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-gray-600 text-white rounded text-xs font-bold">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
