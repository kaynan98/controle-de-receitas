export interface Patient {
  id: string;
  nome: string;
  telefone: string;
  createdAt: string;
}

ex interface Lote {
  id: string;
  lote: string;
}

export interface Pendencia {
  id: string;
  patientId: string;
  medicamento: string;
  quantidade: number;
  lotes: Lote[];
  dataRetirada: string;
  dataPrometida: string;
  dataEntrega: string | null;
  retiradoPor: string;
  observacao: string;
  status: 'pendente' | 'atrasado' | 'cobrado' | 'regularizado';
  diasAtraso: number | null;
  createdAt: string;
}

export interface MetricasPaciente {
  mediaDiasAtraso: number;
  totalRetiradas: number;
  totalAtrasos: number;
  classificacao: 'bom' | 'medio' | 'ruim';
}
