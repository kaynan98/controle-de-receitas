import { useState } from 'react';
import { Patient, Pendencia, Lote } from '@/types';
import { calcularStatus } from '@/utils/calculations';

interface PendenciaFormProps {
  patients: Patient[];
  pendencias: Pendencia[];
  onSave: (pendencia: Pendencia) => void;
  onCancel: () => void;
  editPendencia?: Pendencia | null;
}

export function PendenciaForm({ patients, pendencias, onSave, onCancel, editPendencia }: PendenciaFormProps) {
  const [patientId, setPatientId] = useState(editPendencia?.patientId || '');
  const [medicamento, setMedicamento] = useState(editPendencia?.medicamento || '');
  const [quantidade, setQuantidade] = useState(editPendencia?.quantidade?.toString() || '');
  const [lotes, setLotes] = useState<Lote[]>(editPendencia?.lotes || [{ lote: '', quantidade: 0 }]);
  const [dataRetirada, setDataRetirada] = useState(editPendencia?.dataRetirada || new Date().toISOString().split('T')[0]);
  const [dataPrometida, setDataPrometida] = useState(editPendencia?.dataPrometida || '');
  const [retiradoPor, setRetiradoPor] = useState(editPendencia?.retiradoPor || '');
  const [observacao, setObservacao] = useState(editPendencia?.observacao || '');

  const handleAddLote = () => {
    setLotes([...lotes, { lote: '', quantidade: 0 }]);
  };

  const handleLoteChange = (index: number, field: keyof Lote, value: string | number) => {
    const newLotes = [...lotes];
    newLotes[index] = { ...newLotes[index], [field]: value };
    setLotes(newLotes);
  };

  const handleRemoveLote = (index: number) => {
    setLotes(lotes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !medicamento || !quantidade || !dataPrometida || !retiradoPor) return;

    const now = new Date().toISOString();
    const pendencia: Pendencia = {
      id: editPendencia?.id || crypto.randomUUID(),
      patientId,
      medicamento,
      quantidade: Number(quantidade),
      lotes: lotes.filter(l => l.lote.trim() !== ''),
      dataRetirada,
      dataPrometida,
      dataEntrega: editPendencia?.dataEntrega || null,
      retiradoPor,
      observacao,
      status: calcularStatus(dataPrometida, null, false),
      diasAtraso: null,
      createdAt: editPendencia?.createdAt || now,
    };

    onSave(pendencia);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Paciente</label>
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Medicamento</label>
        <input
          type="text"
          value={medicamento}
          onChange={e => setMedicamento(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ex: losartana"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Quantidade</label>
        <input
          type="number"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lotes</label>
        {lotes.map((lote, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={lote.lote}
              onChange={e => handleLoteChange(index, 'lote', e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Número do lote"
            />
            <input
              type="number"
              value={lote.quantidade || ''}
              onChange={e => handleLoteChange(index, 'quantidade', Number(e.target.value))}
              className="w-24 p-2 border rounded"
              placeholder="Qtd"
              min="0"
            />
            {lotes.length > 1 && (
              <button type="button" onClick={() => handleRemoveLote(index)} className="p-2 text-red-500">
                X
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddLote} className="text-sm text-blue-600">
          + Adicionar lote
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Data da retirada</label>
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
          placeholder="Nome de quem retirou"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observação</label>
        <textarea
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="flex-1 p-3 bg-green-600 text-white rounded text-lg font-bold">
          {editPendencia ? 'Atualizar' : 'Registrar'} pendência
        </button>
        <button type="button" onClick={onCancel} className="p-3 bg-gray-300 rounded text-lg">
          Cancelar
        </button>
      </div>
    </form>
  );
}
