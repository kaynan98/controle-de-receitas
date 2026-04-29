import { Pendencia, MetricasPaciente } from '@/types';

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
): 'pendente' | 'atrasado' | 'cobrado' | 'regularizado' {
  if (dataEntrega) return 'regularizado';
  if (cobrado) return 'cobrado';
  const hoje = new Date().toISOString().split('T')[0];
  if (dataPrometida < hoje) return 'atrasado';
  return 'pendente';
}

export function calcularMetricasPaciente(pendencias: Pendencia[]): MetricasPaciente {
  const totalRetiradas = pendencias.length;
  const atrasadas = pendencias.filter(p => p.diasAtraso !== null && p.diasAtraso > 0);
  const totalAtrasos = atrasadas.length;
  const somaDias = atrasadas.reduce((acc, p) => acc + (p.diasAtraso ?? 0), 0);
  const mediaDiasAtraso = totalAtrasos > 0 ? somaDias / totalAtrasos : 0;

  let classificacao: 'bom' | 'medio' | 'ruim';
  if (totalAtrasos === 0) {
    classificacao = 'bom';
  } else if (mediaDiasAtraso <= 3) {
    classificacao = 'medio';
  } else {
    classificacao = 'ruim';
  }

  return { totalRetiradas, totalAtrasos, mediaDiasAtraso, classificacao };
}
