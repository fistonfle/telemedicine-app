export interface PatientAppointment {
  id: string | number;
  doctor: string;
  email: string;
  specialty: string;
  appointmentDate?: string;
  date: string;
  slot: string;
  status: string;
}

export interface PatientStats {
  nextAppointment: {
    doctor?: string;
    slot?: number;
    status?: string;
  } | null;
  pastConsultations: number;
  lastVisit: string;
}

export interface HealthMetric {
  label: string;
  value: string;
}

export interface PatientHealth {
  lastUpdated: string;
  metrics: HealthMetric[];
}

export interface Consultation {
  id: string | number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  diagnosis: string;
  status: string;
}

export interface ConsultationStats {
  total: number;
  recent: number;
  avgRating: string;
}

export interface PrescriptionRow {
  id: string | number;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  expires: string;
  status: string;
}
