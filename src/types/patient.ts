export interface PatientAppointment {
  id: string | number;
  doctor: string;
  email: string;
  specialty: string;
  appointmentDate?: string;
  date: string;
  slot: string;
  status: string;
  /** True when this appointment was scheduled as a follow-up of a previous visit. */
  isFollowUp?: boolean;
  /** Prescription note (medications) for this appointment's visit, if any. Only present when fetching single appointment details. */
  prescriptionNote?: string | null;
  /** Consultation summary for this appointment (diagnosis, notes, vitals, lab flags). Only present when fetching single appointment details and a consultation exists. */
  consultationSummary?: ConsultationSummary | null;
}

/** Summary of a consultation shown on the patient appointment detail page. */
export interface ConsultationSummary {
  diagnosis?: string | null;
  notes?: string | null;
  temperatureCelsius?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRateBpm?: number | null;
  respiratoryRatePerMin?: number | null;
  oxygenSaturation?: number | null;
  requiresLabTest?: boolean | null;
  labResultsSameDay?: boolean | null;
  labRequiresFollowUp?: boolean | null;
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
  appointmentId?: string | number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  diagnosis: string;
  notes?: string | null;
  status: string;
  /** When true, patient or doctor can create a follow-up appointment. */
  labRequiresFollowUp?: boolean;
  requiresLabTest?: boolean;
  labResultsSameDay?: boolean;
  /** Prescription note (medications) for this visit, if any. */
  prescriptionNote?: string | null;
  /** Vitals (show when present) */
  temperatureCelsius?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRateBpm?: number | null;
  respiratoryRatePerMin?: number | null;
  oxygenSaturation?: number | null;
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
  /** Appointment this prescription was added in; link to view that visit. */
  appointmentId?: string | null;
}
