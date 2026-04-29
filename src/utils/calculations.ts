import { Pendencia, PendenciaStatus, PatientMetrics, PatientClassification } from '@/types';

export function calcularDiasAtraso(dataEntrega: string, dataPrometida: string): number {
  const entrega = new Date(dataEntrega);
  const prometida = new Date(dataPrometida);
  const diff = entrega.getTime() - prometida.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calcularStatus(dataPrometida: string, dataEntrega: string | null, cobrado: boolean): PendenciaStatus {
  if (dataEntrega) return 'regularizado';
  if (cobrado) return 'cobrado';
  const hoje = new Date();
  const prometida = new Date(dataPrometida);
  if (hoje > prometida) return 'atrasado';
  return 'pendente';
}

export function calcularMetricasPaciente(pendencias: Pendencia[]): PatientMetrics {
  const atrasos = pendencias.filter(p => p.diasAtraso !== null && p.diasAtraso > 0);
  const totalAtrasos = atrasos.length;
  const mediaDiasAtraso = totalAtrasos > 0
    ? atrasos.reduce((acc, p) => acc + (p.diasAtraso || 0), 0) / totalAtrasos
    : 0;

  const medicamentoCount: Record<string, number> = {};
  pendencias.forEach(p => {
    medicamentoCount[p.medicamento] = (medicamentoCount[p.medicamento] || 0) + 1;
  });
  const medicamentosFrequentes = Object.entries(medicamentoCount)
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let classificacao: PatientClassification = 'bom';
  if (mediaDiasAtraso > 5 || totalAtrasos > 5) {
    classificacao = 'ruim';
  } else if (mediaDiasAtraso >= 2) {
    classificacao = 'medio';
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

export function gerarMensagemWhatsApp(nome: string, medicamento: string, dataRetirada: string): string {
  const mensagem = `Olá ${nome}, tudo bem?\n\nPassando para lembrar que você retirou ${medicamento} no dia ${new Date(dataRetirada).toLocaleDateString('pt-BR')} e ainda não entregou a receita.\n\nPor favor, traga o mais breve possível.\n\nAtenciosamente, Farmácia.`;
  return encodeURIComponent(mensagem);
}
