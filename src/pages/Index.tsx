import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Patient, Pendencia } from '@/types';
import { PendenciaForm } from '@/components/PendenciaForm';
import { PendenciaList } from '@/components/PendenciaList';
import { calcularStatus, calcularDiasAtraso, calcularMetricasPaciente } from '@/utils/calculations';

export function Index() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', []);
  const [pendencias, setPendencias] = useLocalStorage<Pendencia[]>('pendencias', []);
  const [showForm, setShowForm] = useState(false);
  const [editPendencia, setEditPendencia] = useState<Pendencia | null>(null);
  const [filterNome, setFilterNome] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [newPatientNome, setNewPatientNome] = useState('');
  const [newPatientTelefone, setNewPatientTelefone] = useState('');

  const handleSavePendencia = (pendencia: Pendencia) => {
    const diasAtraso = pendencia.dataEntrega
      ? calcularDiasAtraso(pendencia.dataEntrega, pendencia.dataPrometida)
      : null;
    const status = calcularStatus(pendencia.dataPrometida, pendencia.dataEntrega, false);
    const updated = { ...pendencia, diasAtraso, status };

    if (editPendencia) {
      setPendencias(pendencias.map(p => p.id === updated.id ? updated : p));
    } else {
      const patientPendencias = pendencias.filter(p => p.patientId === updated.patientId);
      const metrics = calcularMetricasPaciente([...patientPendencias, updated]);
      if (metrics.classificacao === 'ruim') {
        alert(`Paciente com ${metrics.totalAtrasos} atrasos (média ${metrics.mediaDiasAtraso.toFixed(1)} dias)`);
      }
      setPendencias([...pendencias, updated]);
    }
    setShowForm(false);
    setEditPendencia(null);
  };

  const handleRegularizar = (id: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    setPendencias(pendencias.map(p => {
      if (p.id === id) {
        const diasAtraso = calcularDiasAtraso(hoje, p.dataPrometida);
        return { ...p, dataEntrega: hoje, status: 'regularizado' as const, diasAtraso };
      }
      return p;
    }));
  };

  const handleEdit = (pendencia: Pendencia) => {
    setEditPendencia(pendencia);
    setShowForm(true);
  };

  const handleAddPatient = () => {
    if (!newPatientNome.trim() || !newPatientTelefone.trim()) return;
    const patient: Patient = {
      id: crypto.randomUUID(),
      nome: newPatientNome.trim(),
      telefone: newPatientTelefone.trim(),
      createdAt: new Date().toISOString(),
    };
    setPatients([...patients, patient]);
    setNewPatientNome('');
    setNewPatientTelefone('');
    setShowPatientForm(false);
  };

  const totalPendentes = pendencias.filter(p => p.status === 'pendente').length;
  const totalAtrasados = pendencias.filter(p => p.status === 'atrasado').length;
  const venceHoje = pendencias.filter(p => {
    const hoje = new Date().toISOString().split('T')[0];
    return p.dataPrometida === hoje && p.status !== 'regularizado';
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Controle de Pendências</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{totalPendentes}</p>
          <p className="text-sm">Pendentes</p>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{totalAtrasados}</p>
          <p className="text-sm">Atrasados</p>
        </div>
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{venceHoje}</p>
          <p className="text-sm">Vence hoje</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setShowForm(true); setEditPendencia(null); }}
          className="flex-1 p-4 bg-blue-600 text-white rounded-lg text-lg font-bold"
        >
          + Nova pendência
        </button>
        <button
          onClick={() => setShowPatientForm(true)}
          className="p-4 bg-gray-600 text-white rounded-lg text-lg font-bold"
        >
          + Paciente
        </button>
      </div>

      {/* Cadastro de paciente */}
      {showPatientForm && (
        <div className="bg-white border rounded-lg p-4 mb-4">
          <h2 className="font-bold text-lg mb-2">Novo paciente</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPatientNome}
              onChange={e => setNewPatientNome(e.target.value)}
              placeholder="Nome"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              value={newPatientTelefone}
              onChange={e => setNewPatientTelefone(e.target.value)}
              placeholder="Telefone"
              className="flex-1 p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddPatient} className="p-2 bg-green-600 text-white rounded font-bold">Salvar</button>
            <button onClick={() => setShowPatientForm(false)} className="p-2 bg-gray-300 rounded">Cancelar</button>
          </div>
        </div>
      )}

      {/* Formulário de pendência */}
      {showForm && (
        <div className="bg-white border rounded-lg p-4 mb-4">
          <h2 className="font-bold text-lg mb-2">{editPendencia ? 'Editar' : 'Nova'} pendência</h2>
          <PendenciaForm
            patients={patients}
            pendencias={pendencias}
            onSave={handleSavePendencia}
            onCancel={() => { setShowForm(false); setEditPendencia(null); }}
            editPendencia={editPendencia}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={filterNome}
          onChange={e => setFilterNome(e.target.value)}
          placeholder="Filtrar por nome"
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
          <option value="cobrado">Cobrado</option>
          <option value="regularizado">Regularizado</option>
        </select>
      </div>

      {/* Lista */}
      <PendenciaList
        pendencias={pendencias}
        patients={patients}
        onRegularizar={handleRegularizar}
        onEdit={handleEdit}
        filterNome={filterNome}
        filterStatus={filterStatus}
      />
    </div>
  );
}
