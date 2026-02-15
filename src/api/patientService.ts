import { fetchApi } from "./client";
import type {
  PatientAppointment,
  PatientStats,
  PatientHealth,
  Consultation,
  ConsultationStats,
  PrescriptionRow,
} from "../types";

function formatAppointmentDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function mapAppointmentToPatient(a: Record<string, unknown>): PatientAppointment {
  return {
    id: a.id,
    doctor: (a.doctorName as string) ?? "—",
    email: "",
    specialty: (a.specialty as string) ?? "—",
    appointmentDate: (a.appointmentDate as string) ?? (a.appointment_date as string),
    date: formatAppointmentDate((a.appointmentDate as string) ?? (a.appointment_date as string)),
    slot: String((a.appointmentNumber as string) ?? (a.assignedNumber as string) ?? "—"),
    status: ((a.status as string) || "PENDING").toLowerCase(),
    isFollowUp: a.isFollowUp === true,
  };
}

export async function getPatientAppointments(options?: { page?: number; size?: number }): Promise<PatientAppointment[]> {
  const params = new URLSearchParams();
  if (options?.page != null) params.set("page", String(options.page));
  if (options?.size != null) params.set("size", String(options.size));
  const q = params.toString() ? `?${params.toString()}` : "";
  const list = await fetchApi<Record<string, unknown>[]>(`/api/patient/appointments${q}`);
  return (list ?? []).map(mapAppointmentToPatient);
}

export async function getPatientAppointment(id: string): Promise<PatientAppointment> {
  const raw = await fetchApi<Record<string, unknown>>(`/api/patient/appointments/${id}`);
  if (!raw) throw new Error("Appointment not found");
  const a = "appointment" in raw && raw.appointment && typeof raw.appointment === "object"
    ? { ...(raw.appointment as Record<string, unknown>), prescriptionNote: (raw as { prescriptionNote?: string | null }).prescriptionNote }
    : (raw as Record<string, unknown>);
  return { ...mapAppointmentToPatient(a), prescriptionNote: (a.prescriptionNote as string) ?? null };
}

export async function getPatientStats(): Promise<PatientStats> {
  const r = await fetchApi<PatientStats>("/api/patient/stats");
  return {
    nextAppointment: r?.nextAppointment ?? null,
    pastConsultations: r?.pastConsultations ?? 0,
    lastVisit: r?.lastVisit ?? "—",
  };
}

export async function getPatientHealthSnapshot(): Promise<PatientHealth> {
  const r = await fetchApi<PatientHealth>("/api/patient/health");
  return {
    lastUpdated: r?.lastUpdated ?? "—",
    metrics: r?.metrics ?? [],
  };
}

export async function getConsultations(search?: string, options?: { page?: number; size?: number }): Promise<Consultation[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (options?.page != null) params.set("page", String(options.page));
  if (options?.size != null) params.set("size", String(options.size));
  const q = params.toString() ? `?${params.toString()}` : "";
  const list = await fetchApi<Record<string, unknown>[]>(`/api/patient/consultations${q}`);
  return (list ?? []).map((c) => {
    const d = c.consultationDate ? new Date(c.consultationDate as string) : null;
    return {
      id: c.id,
      appointmentId: c.appointmentId,
      doctor: c.doctorName ? `Dr. ${c.doctorName}` : "—",
      specialty: "",
      date: d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—",
      time: d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—",
      diagnosis: (c.diagnosis as string) || "—",
      notes: (c.notes as string) ?? null,
      status: "completed",
      labRequiresFollowUp: c.labRequiresFollowUp === true,
      requiresLabTest: c.requiresLabTest === true,
      labResultsSameDay: c.labResultsSameDay === true,
      prescriptionNote: (c.prescriptionNote as string) ?? null,
      temperatureCelsius: c.temperatureCelsius != null ? Number(c.temperatureCelsius) : null,
      weightKg: c.weightKg != null ? Number(c.weightKg) : null,
      heightCm: c.heightCm != null ? Number(c.heightCm) : null,
      bloodPressureSystolic: c.bloodPressureSystolic != null ? Number(c.bloodPressureSystolic) : null,
      bloodPressureDiastolic: c.bloodPressureDiastolic != null ? Number(c.bloodPressureDiastolic) : null,
      heartRateBpm: c.heartRateBpm != null ? Number(c.heartRateBpm) : null,
      respiratoryRatePerMin: c.respiratoryRatePerMin != null ? Number(c.respiratoryRatePerMin) : null,
      oxygenSaturation: c.oxygenSaturation != null ? Number(c.oxygenSaturation) : null,
    };
  });
}

export async function getConsultationStats(): Promise<ConsultationStats> {
  const r = await fetchApi<ConsultationStats>("/api/patient/consultations/stats");
  return { total: r?.total ?? 0, recent: r?.recent ?? 0, avgRating: r?.avgRating ?? "—" };
}

function normalizePrescriptionsList(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if ("data" in raw && Array.isArray((raw as { data: unknown }).data))
      return (raw as { data: Record<string, unknown>[] }).data;
    if ("content" in raw && Array.isArray((raw as { content: unknown }).content))
      return (raw as { content: Record<string, unknown>[] }).content;
  }
  return [];
}

export async function getPrescriptions(options?: { page?: number; size?: number }): Promise<PrescriptionRow[]> {
  const params = new URLSearchParams();
  if (options?.page != null) params.set("page", String(options.page));
  if (options?.size != null) params.set("size", String(options.size));
  const q = params.toString() ? `?${params.toString()}` : "";
  const raw = await fetchApi<unknown>(`/api/patient/prescriptions${q}`);
  const list = normalizePrescriptionsList(raw);
  const rows: PrescriptionRow[] = [];
  for (const p of list) {
    const note = ((p.note as string) || "Prescription").trim();
    const doctor = p.doctorName
      ? ((p.doctorName as string).startsWith("Dr.") ? (p.doctorName as string) : `Dr. ${p.doctorName}`)
      : "—";
    const lines = note
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      rows.push({
        id: p.id,
        medication: "Prescription",
        dosage: "—",
        frequency: "—",
        doctor,
        expires: "—",
        status: "ready",
      });
    } else {
      for (let i = 0; i < lines.length; i++) {
        const parts = (lines[i] as string)
          .split("—")
          .map((s) => s.trim())
          .filter(Boolean);
        rows.push({
          id: `${p.id}-${i}`,
          medication: (parts[0] as string) ?? lines[i],
          dosage: (parts[1] as string) ?? "—",
          frequency: (parts[2] as string) ?? "—",
          doctor,
          expires: "—",
          status: "ready",
        });
      }
    }
  }
  return rows;
}
