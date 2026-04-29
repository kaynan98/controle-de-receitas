import { useState, useEffect } from 'react';
import { Patient, Pendencia } from '@/types';

interface PendenciaFormProps {
  patients: Patient[];
  pendencias: Pendencia[];
  onSave: (pendencia: Pendencia) => void;
  onCancel: () => void;
  editPendencia: Pendencia | null;
}

export function PendenciaForm({ patients, pendencias, onSave, onCancel, editPendencia }: PendenciaFormProps) {
  const [patientId, setPatientId] = useState(editPendencia?.patientId || '');
  const [descricao, setDescricao] = useState(editPendencia?.descricao || '');
  const [dataPrometida, setDataPrometida] = useState(editPendencia?.dataPrometida || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !descricao.trim() || !dataPrometida) return;

    const pendencia: Pendencia = {
      id: editPendencia?.id || crypto.randomUUID(),
      patientId,
      descricao: descricao.trim(),
      dataPrometida,
      dataEntrega: editPendencia?.dataEntrega || null,
      status: editPendencia?.status || 'pendente',
      diasAtraso: editPendencia?.diasAtraso || null,
      createdAt: editPendencia?.createdAt || new Date().toISOString(),
    };
    onSave(pendencia);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Selecione um paciente</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      <input
        type="text"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
        placeholder="Descrição da pendência"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        value={dataPrometida}
        onChange={e => setDataPrometida(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded font-bold">
          {editPendencia ? 'Atualizar' : 'Salvar'}
        </button>
        <button type="button" onClick={onCancel} className="p-2 bg-gray-300 rounded">Cancelar</button>
      </div>
    </form>
  );
}
