export interface Doctor {
  id: string | number;
  name: string;
  names?: string;
  specialty: string;
  email?: string;
  phone?: string;
  description?: string;
  avatar: string;
  experience?: string;
}

export interface DoctorAppointment {
  id: string | number;
  patient: string;
  patientId?: string;
  slot: string;
  status: string;
  appointmentDate?: string | null;
  nextStep?: string;
}

export interface DoctorStats {
  appointmentsToday: number;
  appointmentsChange: string;
  pendingRequests: number;
  totalPatients: number;
  patientsChange: string;
}

export interface TrafficDay {
  day: string;
  patients: number;
}

export interface DoctorPatient {
  id: string;
  name: string;
  lastAppointment: string;
  lastDiagnosis: string;
  phone: string;
  email: string;
}

export interface CreateConsultationData {
  appointmentId: string;
  diagnosis?: string;
  notes?: string;
  temperatureCelsius?: number | string;
  weightKg?: number | string;
  bloodPressureSystolic?: number | string;
  bloodPressureDiastolic?: number | string;
  heartRateBpm?: number | string;
  respiratoryRatePerMin?: number | string;
  oxygenSaturation?: number | string;
  heightCm?: number | string;
  requiresLabTest?: boolean;
  labResultsSameDay?: string | null;
  labRequiresFollowUp?: string | null;
}

export interface CreatePrescriptionData {
  appointmentId?: string;
  consultationId?: string;
  patientId?: string;
  note?: string;
  diagnosis?: string;
  instructions?: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  expiresIn?: number;
  refills?: number;
}
