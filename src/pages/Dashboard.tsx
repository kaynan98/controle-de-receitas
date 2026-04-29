import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Patient, Pendencia } from '@/types';
import { calcularMetricasPaciente, atualizarStatusPendencias } from '@/utils/calculations';
import { useEffect } from 'react';

export function Dashboard() {
  const [patients] = useLocalStorage<Patient[]>('patients', []);
  const [pendencias] = useLocalStorage<Pendencia[]>('pendencias', []);

  const totalPendentes = pendencias.filter(p => p.status === 'pendente').length;
  const totalAtrasados = pendencias.filter(p => p.status === 'atrasado').length;
  const venceHoje = pendencias.filter(p => {
    const hoje = new Date().toISOString().split('T')[0];
    return p.dataPrometida === hoje && p.status !== 'regularizado' && p.status !== 'cobrado';
  }).length;

  const metricsByPatient = patients.map(patient => {
    const patientPendencias = pendencias.filter(p => p.patientId === patient.id);
    return { patient, metrics: calcularMetricasPaciente(patientPendencias) };
  });

  const ranking = [...metricsByPatient]
    .filter(m => m.metrics.totalRetiradas > 0)
    .sort((a, b) => b.metrics.mediaDiasAtraso - a.metrics.mediaDiasAtraso)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{totalPendentes}</p>
          <p className="text-sm">Pendentes</p>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{totalAtrasados}</p>
          <p className="text-sm">Atrasados</p>
        </div>
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{venceHoje}</p>
          <p className="text-sm">Vence hoje</p>
        </div>
      </div>

      {ranking.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-2">Ranking de pacientes com maior atraso</h3>
          <div className="space-y-2">
            {ranking.map((item, index) => (
              <div key={item.patient.id} className="flex justify-between items-center bg-white border rounded-lg p-3">
                <div>
                  <span className="font-bold mr-2">{index + 1}º</span>
                  <span>{item.patient.nome}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.metrics.totalAtrasos} atrasos · média {item.metrics.mediaDiasAtraso.toFixed(1)} dias
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendencias.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhuma pendência registrada ainda.</p>
          <p className="text-sm mt-2">Clique em "+ Nova pendência" para começar.</p>
        </div>
      )}
    </div>
  );
}
