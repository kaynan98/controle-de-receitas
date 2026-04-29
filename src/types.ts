export interface Patient {
  id: string;
  nome: string;
  telefone: string;
  createdAt: string;
}

export interface Pendencia {
  id: string;
  patientId: string;
  descricao: string;
  dataPrometida: string;
  dataEntrega: string | null;
  status: 'pendente' | 'atrasado' | 'cobrado' | 'regularizado';
  diasAtraso: number | null;
  createdAt: string;
}

export interface MetricasPaciente {
  totalRetiradas: number;
  totalAtrasos: number;
  mediaDiasAtraso: number;
  classificacao: 'bom' | 'medio' | 'ruim';
}
