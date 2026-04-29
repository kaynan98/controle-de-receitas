import { Pendencia, Patient } from '@/types';
import { gerarMensagemWhatsApp } from '@/utils/calculations';

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
    const matchNome = !filterNome || (patient?.nome || '').toLowerCase().includes(filterNome.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchNome && matchStatus;
  });

  const getPatientName = (patientId: string) => patients.find(p => p.id === patientId)?.nome || 'Desconhecido';
  const getPatientPhone = (patientId: string) => patients.find(p => p.id === patientId)?.telefone || '';

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 border-yellow-300',
    atrasado: 'bg-red-100 border-red-300',
    cobrado: 'bg-orange-100 border-orange-300',
    regularizado: 'bg-green-100 border-green-300',
  };

  return (
    <div className="space-y-2">
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">Nenhuma pendência encontrada</p>
      )}
      {filtered.map(p => {
        const patientName = getPatientName(p.patientId);
        const phone = getPatientPhone(p.patientId);
        const whatsappLink = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${gerarMensagemWhatsApp(patientName, p.medicamento, p.dataRetirada)}`;

        return (
          <div key={p.id} className={`border-2 rounded-lg p-4 ${statusColors[p.status]}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{patientName}</h3>
                <p className="text-sm text-gray-600">{p.medicamento} - {p.quantidade} unidades</p>
                <p className="text-sm">Retirado por: {p.retiradoPor}</p>
                <p className="text-sm">Retirada: {new Date(p.dataRetirada).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm">Prometida: {new Date(p.dataPrometida).toLocaleDateString('pt-BR')}</p>
                {p.dataEntrega && (
                  <p className="text-sm">Entregue: {new Date(p.dataEntrega).toLocaleDateString('pt-BR')}</p>
                )}
                {p.diasAtraso !== null && p.diasAtraso > 0 && (
                  <p className="text-sm font-bold text-red-600">{p.diasAtraso} dia(s) de atraso</p>
                )}
                {p.observacao && <p className="text-sm italic mt-1">Obs: {p.observacao}</p>}
              </div>
              <div className="flex flex-col gap-2">
                {p.status !== 'regularizado' && (
                  <>
                    <button
                      onClick={() => onRegularizar(p.id)}
                      className="p-2 bg-green-500 text-white rounded text-sm font-bold"
                    >
                      Receita entregue
                    </button>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-600 text-white rounded text-sm text-center font-bold"
                    >
                      WhatsApp
                    </a>
                  </>
                )}
                <button
                  onClick={() => onEdit(p)}
                  className="p-2 bg-blue-500 text-white rounded text-sm"
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
