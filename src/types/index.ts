export interface Patient {
  id: string;
  nome: string;
  telefone: string;
  createdAt: string;
}

export interface Lote {
  lote: string;
  quantidade: number;
}

export type PendenciaStatus = 'pendente' | 'atrasado' | 'cobrado' | 'regularizado';

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
  status: PendenciaStatus;
  diasAtraso: number | null;
  createdAt: string;
}

export type PatientClassification = 'bom' | 'medio' | 'ruim';

export interface PatientMetrics {
  patientId: string;
  totalRetiradas: number;
  totalAtrasos: number;
  mediaDiasAtraso: number;
  medicamentosFrequentes: { nome: string; count: number }[];
  classificacao: PatientClassification;
}
