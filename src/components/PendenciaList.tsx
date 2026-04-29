import { Patient, Pendencia } from '@/types';

interface PendenciaListProps {
  pendencias: Pendencia[];
  patients: Patient[];
  onRegularizar: (id: string) => void;
  onEdit: (pendencia: Pendencia) => void;
  filterNome: string;
  filterStatus: string;
}

export function PendenciaList({ pendencias, patients, onRegularizar, onEdit, filterNome, filterStatus }: PendenciaListProps) {
  const filtered = pendencias.filter(p => {
    const patient = patients.find(pat => pat.id === p.patientId);
    const nomeMatch = patient?.nome.toLowerCase().includes(filterNome.toLowerCase());
    const statusMatch = filterStatus ? p.status === filterStatus : true;
    return nomeMatch && statusMatch;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma pendência encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map(p => {
        const patient = patients.find(pat => pat.id === p.patientId);
        return (
          <div key={p.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{patient?.nome || 'Desconhecido'}</p>
                <p className="text-sm text-gray-600">{p.descricao}</p>
                <p className="text-xs text-gray-400">
                  Prometida: {new Date(p.dataPrometida).toLocaleDateString('pt-BR')}
                  {p.dataEntrega && ` · Entregue: ${new Date(p.dataEntrega).toLocaleDateString('pt-BR')}`}
                </p>
                {p.diasAtraso !== null && p.diasAtraso > 0 && (
                  <p className="text-xs text-red-500">{p.diasAtraso} dias de atraso</p>
                )}
              </div>
              <div className="flex gap-1 items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  p.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                  p.status === 'atrasado' ? 'bg-red-100 text-red-800' :
                  p.status === 'cobrado' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {p.status}
                </span>
                {p.status !== 'regularizado' && (
                  <button
                    onClick={() => onRegularizar(p.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold"
                  >
                    Regularizar
                  </button>
                )}
                <button
                  onClick={() => onEdit(p)}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-bold"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
