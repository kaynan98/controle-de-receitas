import { Pendencia, PendenciaStatus, PatientMetrics, PatientClassification } from '@/types';

export function calcularDiasAtraso(dataEntrega: string, dataPrometida: string): number {
  const entrega = new Date(dataEntrega);
  const prometida = new Date(dataPrometida);
  const diff = entrega.getTime() - prometida.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calcularStatus(
  dataPrometida: string,
  dataEntrega: string | null,
  cobrado: boolean
): PendenciaStatus {
  if (dataEntrega) return 'regularizado';
  if (cobrado) return 'cobrado';
  const hoje = new Date().toISOString().split('T')[0];
  if (hoje > dataPrometida) return 'atrasado';
  return 'pendente';
}

export function calcularMetricasPaciente(pendencias: Pendencia[]): PatientMetrics {
  const atrasos = pendencias.filter(p => p.diasAtraso !== null && p.diasAtraso > 0);
  const totalAtrasos = atrasos.length;
  const mediaDiasAtraso = totalAtrasos > 0
    ? atrasos.reduce((sum, p) => sum + (p.diasAtraso || 0), 0) / totalAtrasos
    : 0;

  const medicamentoCount: Record<string, number> = {};
  pendencias.forEach(p => {
    medicamentoCount[p.medicamento] = (medicamentoCount[p.medicamento] || 0) + 1;
  });
  const medicamentosFrequentes = Object.entries(medicamentoCount)
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count);

  let classificacao: PatientClassification;
  if (mediaDiasAtraso <= 1) {
    classificacao = 'bom';
  } else if (mediaDiasAtraso <= 5) {
    classificacao = 'medio';
  } else {
    classificacao = 'ruim';
  }

  return {
    patientId: pendencias[0]?.patientId || '',
    totalRetiradas: pendencias.length,
    totalAtrasos,
    mediaDiasAtraso,
    medicamentosFrequentes,
    classificacao,
  };
}

export function gerarMensagemWhatsApp(
  nomePaciente: string,
  medicamento: string,
  dataRetirada: string
): string {
  const dataFormatada = new Date(dataRetirada + 'T12:00:00').toLocaleDateString('pt-BR');
  const mensagem = `Olá ${nomePaciente}, você retirou ${medicamento} no dia ${dataFormatada} e ainda não entregou a receita. Por favor, regularize o mais breve possível. Obrigado!`;
  return encodeURIComponent(mensagem);
}
