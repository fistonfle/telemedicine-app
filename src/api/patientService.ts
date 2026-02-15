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

export async function getPatientAppointments(): Promise<PatientAppointment[]> {
  const list = await fetchApi<Record<string, unknown>[]>("/api/patient/appointments");
  return (list ?? []).map((a) => ({
    id: a.id,
    doctor: (a.doctorName as string) ?? "—",
    email: "",
    specialty: (a.specialty as string) ?? "—",
    appointmentDate: (a.appointmentDate as string) ?? (a.appointment_date as string),
    date: formatAppointmentDate((a.appointmentDate as string) ?? (a.appointment_date as string)),
    slot: String((a.appointmentNumber as string) ?? (a.assignedNumber as string) ?? "—"),
    status: ((a.status as string) || "PENDING").toLowerCase(),
  }));
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

export async function getConsultations(search?: string): Promise<Consultation[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const list = await fetchApi<Record<string, unknown>[]>(`/api/patient/consultations${q}`);
  return (list ?? []).map((c) => {
    const d = c.consultationDate ? new Date(c.consultationDate as string) : null;
    return {
      id: c.id,
      doctor: c.doctorName ? `Dr. ${c.doctorName}` : "—",
      specialty: "",
      date: d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—",
      time: d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—",
      diagnosis: (c.diagnosis as string) || (c.notes as string) || "—",
      status: "completed",
    };
  });
}

export async function getConsultationStats(): Promise<ConsultationStats> {
  const r = await fetchApi<ConsultationStats>("/api/patient/consultations/stats");
  return { total: r?.total ?? 0, recent: r?.recent ?? 0, avgRating: r?.avgRating ?? "—" };
}

export async function getPrescriptions(): Promise<PrescriptionRow[]> {
  const list = await fetchApi<Record<string, unknown>[]>("/api/patient/prescriptions");
  const rows: PrescriptionRow[] = [];
  for (const p of list ?? []) {
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
