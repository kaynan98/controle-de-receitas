import { Pendencia, MetricasPaciente } from '@/types';

export function calcularDiasAtraso(dataEntrega: string, dataPrometida: string): number {
  const entrega = new Date(dataEntrega);
  const prometida = new Date(dataPrometida);
  const diff = entrega.getTime() - prometida.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function calcularStatus(
  dataPrometida: string,
  dataEntrega: string | null,
  cobrado: boolean
): Pendencia['status'] {
  if (dataEntrega) return 'regularizado';
  if (cobrado) return 'cobrado';
  const hoje = new Date().toISOString().split('T')[0];
  if (hoje > dataPrometida) return 'atrasado';
  return 'pendente';
}

export function calcularMetricasPaciente(pendencias: Pendencia[]): MetricasPaciente {
  const totalRetiradas = pendencias.length;
  const pendenciasComAtraso = pendencias.filter(p => p.diasAtraso !== null && p.diasAtraso > 0);
  const totalAtrasos = pendenciasComAtraso.length;
  const somaDias = pendenciasComAtraso.reduce((acc, p) => acc + (p.diasAtraso ?? 0), 0);
  const mediaDiasAtraso = totalAtrasos > 0 ? somaDias / totalAtrasos : 0;

  let classificacao: MetricasPaciente['classificacao'] = 'bom';
  if (mediaDiasAtraso > 5 || totalAtrasos >= 5) {
    classificacao = 'ruim';
  } else if (mediaDiasAtraso >= 2) {
    classificacao = 'medio';
  }

  return { mediaDiasAtraso, totalRetiradas, totalAtrasos, classificacao };
}
