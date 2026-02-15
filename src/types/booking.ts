import type { Doctor } from "./doctor";

export interface TimeSlot {
  scheduleId: string | number;
  id?: string | number;
  start: string;
  end: string;
  slotIndex?: number;
}

export interface CreateAppointmentData {
  patientId?: string;
  doctorId?: string | number;
  doctor?: Doctor;
  date?: Date | string;
  slot?: TimeSlot;
  scheduleId?: string | number;
  appointmentDate?: string;
  reasonForVisit?: string;
}
