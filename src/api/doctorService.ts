import { fetchApi } from "./client";
import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorStats,
  TrafficDay,
  CreateConsultationData,
  CreatePrescriptionData,
} from "../types";

function toNum(v: unknown): number | null {
  return v != null && v !== "" ? Number(v) : null;
}
function toInt(v: unknown): number | null {
  const n = toNum(v);
  return n != null && !isNaN(n) ? Math.round(n) : null;
}

export async function getDoctorSchedule(): Promise<unknown> {
  return fetchApi("/api/doctor/schedule");
}

export async function updateDoctorSchedule(days: unknown[]): Promise<unknown> {
  return fetchApi("/api/doctor/schedule", {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
}

export async function updateAppointmentStatus(
  appointmentId: string | number,
  status: string
): Promise<unknown> {
  return fetchApi(`/api/doctor/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getDoctorAppointments(): Promise<DoctorAppointment[]> {
  const list = await fetchApi<Record<string, unknown>[]>("/api/doctor/appointments");
  return (list ?? []).map((a) => {
    const hasConsultation = a.hasConsultation === true;
    const testCount = (a.testCount as number) ?? 0;
    let nextStep: string;
    if (!hasConsultation) nextStep = "Consultation";
    else if (testCount < 1) nextStep = "Tests";
    else nextStep = "Prescription";
    return {
      id: a.id,
      patient: (a.patientName as string) ?? "—",
      patientId: (a.patientId as string) ?? "",
      description: "",
      slot: String((a.appointmentNumber as string) ?? (a.assignedNumber as string) ?? "—"),
      status: ((a.status as string) || "PENDING").toLowerCase(),
      appointmentDate: (a.appointmentDate as string) ?? null,
      nextStep,
    };
  });
}

export interface ConsultationDetails {
  id?: string;
  temperatureCelsius?: number | string;
  weightKg?: number | string;
  heightCm?: number | string;
  bloodPressureSystolic?: number | string;
  bloodPressureDiastolic?: number | string;
  heartRateBpm?: number | string;
  respiratoryRatePerMin?: number | string;
  oxygenSaturation?: number | string;
  diagnosis?: string;
  notes?: string;
  requiresLabTest?: boolean;
  labResultsSameDay?: boolean | string;
  labRequiresFollowUp?: boolean | string;
}

export interface AppointmentDetails {
  appointment: {
    id: string | number;
    patient: string;
    patientId?: string;
    slot: string;
    status: string;
    appointmentDate?: string;
  } | null;
  consultation: ConsultationDetails | null;
  tests: { id?: string; name?: string; description?: string; status?: string }[];
  prescription: { note?: string } | null;
}

export async function getAppointmentDetails(
  appointmentId: string | number
): Promise<AppointmentDetails | null> {
  const d = await fetchApi<{
    appointment?: Record<string, unknown>;
    consultation?: unknown;
    tests?: unknown[];
    prescription?: unknown;
  }>(`/api/doctor/appointments/${appointmentId}/details`);
  if (!d) return null;
  const a = d.appointment;
  return {
    appointment: a
      ? {
          id: a.id,
          patient: (a.patientName as string) ?? "—",
          patientId: a.patientId as string,
          slot: String((a.appointmentNumber as string) ?? (a.assignedNumber as string) ?? "—"),
          status: ((a.status as string) || "PENDING").toLowerCase(),
          appointmentDate: a.appointmentDate as string,
        }
      : null,
    consultation: (d.consultation as ConsultationDetails) ?? null,
    tests: (d.tests ?? []) as { id?: string; name?: string; description?: string; status?: string }[],
    prescription: (d.prescription as { note?: string }) ?? null,
  };
}

export async function getDoctorAppointment(id: string | number): Promise<DoctorAppointment> {
  const a = await fetchApi<Record<string, unknown>>(`/api/doctor/appointments/${id}`);
  return {
    id: a.id,
    patient: (a.patientName as string) ?? "—",
    patientId: a.patientId as string,
    description: "",
    slot: String((a.appointmentNumber as string) ?? (a.assignedNumber as string) ?? "—"),
    status: ((a.status as string) || "PENDING").toLowerCase(),
    appointmentDate: (a.appointmentDate as string) ?? null,
  };
}

export async function getDoctorStats(): Promise<DoctorStats> {
  const r = await fetchApi<DoctorStats>("/api/doctor/stats");
  return {
    appointmentsToday: r?.appointmentsToday ?? 0,
    appointmentsChange: r?.appointmentsChange ?? "",
    pendingRequests: r?.pendingRequests ?? 0,
    totalPatients: r?.totalPatients ?? 0,
    patientsChange: r?.patientsChange ?? "",
  };
}

export async function getPatientTraffic(): Promise<TrafficDay[]> {
  const r = await fetchApi<{ days?: TrafficDay[] } | TrafficDay[]>("/api/doctor/traffic");
  return (r && typeof r === "object" && "days" in r ? r.days : r) ?? [];
}

export async function getDoctorPatients(search?: string): Promise<DoctorPatient[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const list = await fetchApi<Record<string, unknown>[]>(`/api/doctor/patients${q}`);
  return (list ?? []).map((p) => ({
    id: String(p.idNumber ?? p.id),
    name: (p.names as string) ?? "—",
    lastAppointment: (p.lastAppointmentDate as string) ?? "—",
    lastDiagnosis: (p.lastDiagnosis as string) ?? "—",
    phone: (p.phone as string) ?? "—",
    email: (p.email as string) ?? "—",
  }));
}

export async function getConsultationForAppointment(
  appointmentId: string | number
): Promise<unknown> {
  return fetchApi(`/api/doctor/appointments/${appointmentId}/consultation`);
}

export async function createConsultation(data: CreateConsultationData): Promise<unknown> {
  const body = {
    appointmentId: data.appointmentId,
    diagnosis: data.diagnosis || "Consultation",
    notes: data.notes || "",
    temperatureCelsius: toNum(data.temperatureCelsius),
    weightKg: toNum(data.weightKg),
    bloodPressureSystolic: toInt(data.bloodPressureSystolic),
    bloodPressureDiastolic: toInt(data.bloodPressureDiastolic),
    heartRateBpm: toInt(data.heartRateBpm),
    respiratoryRatePerMin: toInt(data.respiratoryRatePerMin),
    oxygenSaturation: toInt(data.oxygenSaturation),
    heightCm: toNum(data.heightCm),
    requiresLabTest: data.requiresLabTest === true,
    labResultsSameDay: data.labResultsSameDay ?? null,
    labRequiresFollowUp: data.labRequiresFollowUp ?? null,
  };
  return fetchApi("/api/doctor/consultations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getTestsByConsultation(
  consultationId: string | number
): Promise<unknown[]> {
  const list = await fetchApi<unknown[]>(
    `/api/doctor/consultations/${consultationId}/tests`
  );
  return list ?? [];
}

export async function addMedicalTest(
  consultationId: string | number,
  name: string,
  description?: string
): Promise<unknown> {
  return fetchApi(`/api/doctor/consultations/${consultationId}/tests`, {
    method: "POST",
    body: JSON.stringify({
      consultationId,
      name,
      description: description || "",
    }),
  });
}

export async function updateTestStatus(
  testId: string | number,
  status: string
): Promise<unknown> {
  return fetchApi(`/api/doctor/tests/${testId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function createPrescription(data: CreatePrescriptionData): Promise<unknown> {
  if (data.appointmentId) {
    const note = data.note ?? "Prescription";
    const diagnosis = data.diagnosis ?? "Prescription";
    return fetchApi("/api/doctor/prescriptions/from-appointment", {
      method: "POST",
      body: JSON.stringify({
        appointmentId: data.appointmentId,
        diagnosis,
        note,
      }),
    });
  }
  const body = {
    consultationId: data.consultationId,
    note: data.note ?? data.instructions ?? "",
  };
  return fetchApi("/api/doctor/prescriptions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
