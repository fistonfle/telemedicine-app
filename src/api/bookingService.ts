import { fetchApi } from "./client";
import { getMe } from "./authService";
import type { CreateAppointmentData, Doctor, TimeSlot } from "../types";

export interface TimeSlotsResponse {
  slots: TimeSlot[];
  dayStart: string | null;
  dayEnd: string | null;
}

export async function getDoctors(specialty?: string): Promise<Doctor[]> {
  const q = specialty && specialty !== "all" ? `?specialty=${encodeURIComponent(specialty)}` : "";
  const list = await fetchApi<Record<string, unknown>[]>(`/api/doctors${q}`);
  return (list ?? []).map((d) => ({
    id: d.id,
    name: (d.names as string) ?? (d.name as string) ?? "—",
    names: d.names as string,
    specialty: (d.specialty as string) ?? "—",
    email: d.email as string,
    phone: d.phone as string,
    description: (d.practiceDescription as string) ?? "",
    avatar: ((d.names as string) || (d.name as string) || "D")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));
}

export async function getTimeSlots(
  doctorId: string | number,
  date: Date | string
): Promise<TimeSlotsResponse> {
  const dateStr =
    typeof date === "string" ? date : (date as Date)?.toISOString?.()?.slice(0, 10) ?? String(date);
  const res = await fetchApi<{
    slots?: Record<string, unknown>[];
    dayStart?: string;
    dayEnd?: string;
  }>(`/api/doctors/${doctorId}/slots?date=${dateStr}`);
  const list = res?.slots ?? [];
  const mapped = list.map((s, idx) => ({
    ...s,
    scheduleId: (s.scheduleId as string) ?? s.id,
    start: s.start,
    end: s.end,
    slotIndex: (s.slotIndex as number) ?? idx,
  }));
  const seen = new Set<string>();
  const slots = mapped.filter((s) => {
    const key = `${s.scheduleId}-${s.start}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    slots: slots as TimeSlot[],
    dayStart: res?.dayStart ?? null,
    dayEnd: res?.dayEnd ?? null,
  };
}

export async function createAppointment(
  data: CreateAppointmentData
): Promise<unknown> {
  const me = await getMe();
  const patientId = data.patientId ?? (me as { profileId?: string })?.profileId;
  const scheduleId = data.slot?.scheduleId ?? data.scheduleId;
  const appointmentDate = data.slot?.start ?? data.appointmentDate;
  if (!patientId || !scheduleId || !appointmentDate) {
    throw new Error("Missing patientId, scheduleId, or appointmentDate (or slot with scheduleId/start)");
  }
  return fetchApi("/api/appointments", {
    method: "POST",
    body: JSON.stringify({ patientId, scheduleId, appointmentDate }),
  });
}
