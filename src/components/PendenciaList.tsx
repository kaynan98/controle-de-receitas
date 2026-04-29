import { Patient, Pendencia } from '@/types';

interface Props {
  pendencias: Pendencia[];
  patients: Patient[];
  onRegularizar: (id: string) => void;
  onEdit: (pendencia: Pendencia) => void;
  filterNome: string;
  filterStatus: string;
}

export function PendenciaList({ pendencias, patients, onRegularizar, onEdit, filterNome, filterStatus }: Props) {
  const filtered = pendencias.filter(p => {
    const patient = patients.find(pat => pat.id === p.patientId);
    const nomeMatch = patient?.nome.toLowerCase().includes(filterNome.toLowerCase()) ?? false;
    const statusMatch = filterStatus === '' || p.status === filterStatus;
    return nomeMatch && statusMatch;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Nenhuma pendência encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map(p => {
        const patient = patients.find(pat => pat.id === p.patientId);
        const isAtrasado = p.status === 'atrasado';
        return (
          <div
            key={p.id}
            className={`border rounded-lg p-4 ${isAtrasado ? 'bg-red-50 border-red-300' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{patient?.nome ?? 'Desconhecido'}</p>
                <p className="text-sm text-gray-600">{p.medicamento} - {p.quantidade} unidade(s)</p>
                <p className="text-sm text-gray-600">Retirado por: {p.retiradoPor}</p>
                <p className="text-sm text-gray-600">Retirada: {p.dataRetirada} | Prometida: {p.dataPrometida}</p>
                {p.dataEntrega && <p className="text-sm text-green-600">Entregue em: {p.dataEntrega}</p>}
                {p.observacao && <p className="text-sm text-gray-500 italic">Obs: {p.observacao}</p>}
                {p.lotes.length > 0 && (
                  <p className="text-sm text-gray-500">Lotes: {p.lotes.map(l => l.lote).join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {p.status !== 'regularizado' && (
                  <button
                    onClick={() => onRegularizar(p.id)}
                    className="p-2 bg-green-600 text-white rounded text-sm font-bold"
                  >
                    Regularizar
                  </button>
                )}
                <button
                  onClick={() => onEdit(p)}
                  className="p-2 bg-blue-600 text-white rounded text-sm font-bold"
                >
                  Editar
                </button>
                {p.status === 'atrasado' && patient && (
                  <a
                    href={`https://wa.me/55${patient.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${patient.nome}, você retirou ${p.medicamento} em ${p.dataRetirada} e ainda não entregou a receita. Por favor, regularize o mais breve possível.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 text-white rounded text-sm font-bold text-center"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                p.status === 'regularizado' ? 'bg-green-100 text-green-800' :
                p.status === 'atrasado' ? 'bg-red-100 text-red-800' :
                p.status === 'cobrado' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {p.status}
              </span>
              {p.diasAtraso !== null && p.diasAtraso > 0 && (
                <span className="ml-2 text-sm text-red-600 font-bold">{p.diasAtraso} dia(s) de atraso</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
