import { useState, useEffect } from 'react';
import { Patient, Pendencia, Lote } from '@/types';

interface Props {
  patients: Patient[];
  pendencias: Pendencia[];
  onSave: (pendencia: Pendencia) => void;
  onCancel: () => void;
  editPendencia: Pendencia | null;
}

export function PendenciaForm({ patients, pendencias, onSave, onCancel, editPendencia }: Props) {
  const [patientId, setPatientId] = useState(editPendencia?.patientId ?? '');
  const [medicamento, setMedicamento] = useState(editPendencia?.medicamento ?? '');
  const [quantidade, setQuantidade] = useState(editPendencia?.quantidade ?? 1);
  const [lotes, setLotes] = useState<Lote[]>(editPendencia?.lotes ?? [{ id: crypto.randomUUID(), lote: '' }]);
  const [dataRetirada, setDataRetirada] = useState(editPendencia?.dataRetirada ?? new Date().toISOString().split('T')[0]);
  const [dataPrometida, setDataPrometida] = useState(editPendencia?.dataPrometida ?? '');
  const [retiradoPor, setRetiradoPor] = useState(editPendencia?.retiradoPor ?? '');
  const [observacao, setObservacao] = useState(editPendencia?.observacao ?? '');

  const handleAddLote = () => {
    setLotes([...lotes, { id: crypto.randomUUID(), lote: '' }]);
  };

  const handleLoteChange = (id: string, value: string) => {
    setLotes(lotes.map(l => l.id === id ? { ...l, lote: value } : l));
  };

  const handleRemoveLote = (id: string) => {
    if (lotes.length > 1) {
      setLotes(lotes.filter(l => l.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !medicamento || !dataPrometida || !retiradoPor) return;

    const pendencia: Pendencia = {
      id: editPendencia?.id ?? crypto.randomUUID(),
      patientId,
      medicamento,
      quantidade,
      lotes: lotes.filter(l => l.lote.trim() !== ''),
      dataRetirada,
      dataPrometida,
      dataEntrega: editPendencia?.dataEntrega ?? null,
      retiradoPor,
      observacao,
      status: editPendencia?.status ?? 'pendente',
      diasAtraso: editPendencia?.diasAtraso ?? null,
      createdAt: editPendencia?.createdAt ?? new Date().toISOString(),
    };

    onSave(pendencia);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Paciente</label>
        <select
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Selecione...</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Medicamento</label>
          <input
            type="text"
            value={medicamento}
            onChange={e => setMedicamento(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lotes</label>
        {lotes.map((lote, index) => (
          <div key={lote.id} className="flex gap-2 mb-1">
            <input
              type="text"
              value={lote.lote}
              onChange={e => handleLoteChange(lote.id, e.target.value)}
              placeholder={`Lote ${index + 1}`}
              className="flex-1 p-2 border rounded"
            />
            {lotes.length > 1 && (
              <button type="button" onClick={() => handleRemoveLote(lote.id)} className="p-2 text-red-600">X</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddLote} className="text-sm text-blue-600">+ Adicionar lote</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Data retirada</label>
          <input
            type="date"
            value={dataRetirada}
            onChange={e => setDataRetirada(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data prometida</label>
          <input
            type="date"
            value={dataPrometida}
            onChange={e => setDataPrometida(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Retirado por</label>
        <input
          type="text"
          value={retiradoPor}
          onChange={e => setRetiradoPor(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observação</label>
        <textarea
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          className="w-full p-2 border rounded"
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="flex-1 p-3 bg-green-600 text-white rounded-lg font-bold">
          {editPendencia ? 'Atualizar' : 'Salvar'}
        </button>
        <button type="button" onClick={onCancel} className="p-3 bg-gray-300 rounded-lg font-bold">Cancelar</button>
      </div>
    </form>
  );
}
