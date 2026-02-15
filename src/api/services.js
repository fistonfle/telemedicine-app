import { USE_MOCK_API, API_URL } from "./config.js";
import {
  mockAppointments,
  mockDoctorAppointments,
  mockTrafficData,
  mockPatients,
  mockConsultations,
  mockPrescriptions,
} from "./mockData.js";

const MOCK_DELAY_MS = 400;
const AUTH_TOKEN_KEY = "telemedicine_access_token";

const delay = (ms = MOCK_DELAY_MS) => new Promise((r) => setTimeout(r, ms));

export function getStoredToken() {
  return typeof localStorage !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
}

export function setStoredToken(token) {
  if (typeof localStorage !== "undefined" && token != null) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearStoredToken() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
}

const fetchApi = async (path, options = {}) => {
  const url = `${API_URL}${path}`;
  const token = options.token ?? getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    if (token) {
      clearStoredToken();
      window.location.href = "/login";
      return;
    }
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || res.statusText);
  }
  return res.json();
};

export async function getMe() {
  if (USE_MOCK_API) return null;
  return fetchApi("/api/me");
}

export async function getProfile() {
  if (USE_MOCK_API) return null;
  return fetchApi("/api/me/profile");
}

export async function updateProfile(data) {
  if (USE_MOCK_API) {
    await delay();
    return data;
  }
  return fetchApi("/api/me/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getDoctorSchedule() {
  if (USE_MOCK_API) return null;
  return fetchApi("/api/doctor/schedule");
}

export async function updateDoctorSchedule(days) {
  if (USE_MOCK_API) {
    await delay();
    return { days };
  }
  return fetchApi("/api/doctor/schedule", {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.message || err.error || (res.status === 401 ? "Email or password is incorrect. Please try again." : res.statusText);
    throw new Error(msg);
  }
  const data = await res.json();
  if (data.accessToken) setStoredToken(data.accessToken);
  return data;
}

export async function signup(data) {
  const body = {
    email: data.email?.trim(),
    password: data.password,
    firstName: data.firstName?.trim() || data.fullName?.split(" ")[0] || "",
    lastName: data.lastName?.trim() || data.fullName?.split(" ").slice(1).join(" ") || "",
    address: data.address || null,
    phone: data.phone || null,
    idNumber: data.idNumber || null,
    role: data.role === "doctor" ? "DOCTOR" : "PATIENT",
    specialty: data.specialty || null,
    licenseNumber: data.licenseNumber || null,
    practiceDescription: data.practiceDescription || null,
    hospitalAffiliation: data.hospitalAffiliation || null,
    yearsExperience: data.yearsExperience != null ? Number(data.yearsExperience) : null,
    consultationType: data.consultationType || null,
  };
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.detail || res.statusText);
  }
  return res.json();
}

export function logout() {
  clearStoredToken();
}

// ─── Patient APIs ───────────────────────────────────────────────────────────

function formatAppointmentDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function getPatientAppointments() {
  if (USE_MOCK_API) {
    await delay();
    return mockAppointments;
  }
  const list = await fetchApi("/api/patient/appointments");
  return (list ?? []).map((a) => ({
    id: a.id,
    doctor: a.doctorName ?? "—",
    email: "",
    specialty: a.specialty ?? "—",
    appointmentDate: a.appointmentDate ?? a.appointment_date,
    date: formatAppointmentDate(a.appointmentDate),
    slot: a.appointmentNumber ?? a.assignedNumber ?? "—",
    status: (a.status || "PENDING").toLowerCase(),
  }));
}

export async function getPatientStats() {
  if (USE_MOCK_API) {
    await delay();
    return {
      nextAppointment: { doctor: "Dr. Jean Paul Habimana", slot: 2, status: "confirmed" },
      pastConsultations: 24,
      lastVisit: "28 Sept 2024",
    };
  }
  const r = await fetchApi("/api/patient/stats");
  return {
    nextAppointment: r.nextAppointment ?? null,
    pastConsultations: r.pastConsultations ?? 0,
    lastVisit: r.lastVisit ?? "—",
  };
}

export async function getPatientHealthSnapshot() {
  if (USE_MOCK_API) {
    await delay();
    return {
      lastUpdated: "10 Oct 2024",
      metrics: [
        { label: "Blood Pressure", value: "120/80" },
        { label: "Heart Rate", value: "72 bpm" },
        { label: "Weight", value: "76 kg" },
        { label: "Glucose", value: "95 mg/dL" },
      ],
    };
  }
  const r = await fetchApi("/api/patient/health");
  return {
    lastUpdated: r.lastUpdated ?? "—",
    metrics: r.metrics ?? [],
  };
}

export async function getDoctors(specialty) {
  // Booking always uses real API
  const q = specialty && specialty !== "all" ? `?specialty=${encodeURIComponent(specialty)}` : "";
  const list = await fetchApi(`/api/doctors${q}`);
  return (list ?? []).map((d) => ({
    id: d.id,
    name: d.names ?? d.name ?? "—",
    names: d.names,
    specialty: d.specialty ?? "—",
    email: d.email,
    phone: d.phone,
    description: d.practiceDescription ?? "",
    avatar: (d.names || d.name || "D")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));
}

export async function getTimeSlots(doctorId, date) {
  // Booking always uses real API - returns { slots, dayStart, dayEnd }
  const dateStr = typeof date === "string" ? date : date?.toISOString?.()?.slice(0, 10) || date;
  const res = await fetchApi(`/api/doctors/${doctorId}/slots?date=${dateStr}`);
  const list = res?.slots ?? [];
  const mapped = list.map((s, idx) => ({
    ...s,
    scheduleId: s.scheduleId ?? s.id,
    start: s.start,
    end: s.end,
    slotIndex: s.slotIndex ?? idx,
  }));
  // Deduplicate by (scheduleId, start) in case of backend duplicates
  const seen = new Set();
  const slots = mapped.filter((s) => {
    const key = `${s.scheduleId}-${s.start}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    slots,
    dayStart: res?.dayStart ?? null,
    dayEnd: res?.dayEnd ?? null,
  };
}

export async function createAppointment(data) {
  // Booking always uses real API
  const patientId = data.patientId ?? (await getMe())?.profileId;
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

export async function getConsultations(search) {
  if (USE_MOCK_API) {
    await delay();
    if (search) {
      return mockConsultations.filter(
        (c) =>
          c.doctor.toLowerCase().includes(search.toLowerCase()) ||
          c.diagnosis.toLowerCase().includes(search.toLowerCase())
      );
    }
    return mockConsultations;
  }
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const list = await fetchApi(`/api/patient/consultations${q}`);
  return (list ?? []).map((c) => {
    const d = c.consultationDate ? new Date(c.consultationDate) : null;
    return {
      id: c.id,
      doctor: c.doctorName ? `Dr. ${c.doctorName}` : "—",
      specialty: "",
      date: d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—",
      time: d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—",
      diagnosis: c.diagnosis || c.notes || "—",
      status: "completed",
    };
  });
}

export async function getConsultationStats() {
  if (USE_MOCK_API) {
    await delay();
    return { total: 24, recent: 3, avgRating: "4.9/5.0" };
  }
  const r = await fetchApi("/api/patient/consultations/stats");
  return { total: r.total ?? 0, recent: r.recent ?? 0, avgRating: r.avgRating ?? "—" };
}

export async function getPrescriptions() {
  if (USE_MOCK_API) {
    await delay();
    return mockPrescriptions;
  }
  const list = await fetchApi("/api/patient/prescriptions");
  // Flatten: each prescription note can contain multiple medications (one per line)
  const rows = [];
  for (const p of list ?? []) {
    const note = (p.note || "Prescription").trim();
    const doctor = p.doctorName ? (p.doctorName.startsWith("Dr.") ? p.doctorName : `Dr. ${p.doctorName}`) : "—";
    const lines = note.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      rows.push({ id: p.id, medication: "Prescription", dosage: "—", frequency: "—", doctor, expires: "—", status: "ready" });
    } else {
      // Parse "Medication — dosage — frequency" format when possible
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split("—").map((s) => s.trim()).filter(Boolean);
        const medication = parts[0] ?? lines[i];
        const dosage = parts[1] ?? "—";
        const frequency = parts[2] ?? "—";
        rows.push({
          id: `${p.id}-${i}`,
          medication,
          dosage,
          frequency,
          doctor,
          expires: "—",
          status: "ready",
        });
      }
    }
  }
  return rows;
}

// ─── Doctor APIs ────────────────────────────────────────────────────────────

export async function updateAppointmentStatus(appointmentId, status) {
  if (USE_MOCK_API) {
    await delay();
    return { id: appointmentId, status };
  }
  return fetchApi(`/api/doctor/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getDoctorAppointments() {
  if (USE_MOCK_API) {
    await delay();
    return mockDoctorAppointments;
  }
  const list = await fetchApi("/api/doctor/appointments");
  return (list ?? []).map((a) => {
    const hasConsultation = a.hasConsultation === true;
    const testCount = a.testCount ?? 0;
    let nextStep;
    if (!hasConsultation) nextStep = "Consultation";
    else if (testCount < 1) nextStep = "Tests";
    else nextStep = "Prescription";
    return {
      id: a.id,
      patient: a.patientName ?? "—",
      patientId: a.patientId ?? "",
      description: "",
      slot: a.appointmentNumber ?? a.assignedNumber ?? "—",
      status: (a.status || "PENDING").toLowerCase(),
      appointmentDate: a.appointmentDate ?? null,
      nextStep,
    };
  });
}

export async function getAppointmentDetails(appointmentId) {
  if (USE_MOCK_API) return null;
  const d = await fetchApi(`/api/doctor/appointments/${appointmentId}/details`);
  if (!d) return null;
  const a = d.appointment;
  return {
    appointment: a ? {
      id: a.id,
      patient: a.patientName ?? "—",
      patientId: a.patientId,
      slot: a.appointmentNumber ?? a.assignedNumber ?? "—",
      status: (a.status || "PENDING").toLowerCase(),
      appointmentDate: a.appointmentDate,
    } : null,
    consultation: d.consultation ?? null,
    tests: d.tests ?? [],
    prescription: d.prescription ?? null,
  };
}

export async function getDoctorAppointment(id) {
  if (USE_MOCK_API) {
    await delay();
    const apt = mockDoctorAppointments.find((a) => String(a.id) === String(id));
    if (!apt) throw new Error("Appointment not found");
    return apt;
  }
  const a = await fetchApi(`/api/doctor/appointments/${id}`);
  return {
    id: a.id,
    patient: a.patientName ?? "—",
    patientId: a.patientId,
    description: "",
    slot: a.appointmentNumber ?? a.assignedNumber ?? "—",
    status: (a.status || "PENDING").toLowerCase(),
  };
}

export async function getDoctorStats() {
  if (USE_MOCK_API) {
    await delay();
    return {
      appointmentsToday: 12,
      appointmentsChange: "+10%",
      pendingRequests: 4,
      totalPatients: 1240,
      patientsChange: "+2%",
    };
  }
  const r = await fetchApi("/api/doctor/stats");
  return {
    appointmentsToday: r.appointmentsToday ?? 0,
    appointmentsChange: r.appointmentsChange ?? "",
    pendingRequests: r.pendingRequests ?? 0,
    totalPatients: r.totalPatients ?? 0,
    patientsChange: r.patientsChange ?? "",
  };
}

export async function getPatientTraffic() {
  if (USE_MOCK_API) {
    await delay();
    return mockTrafficData;
  }
  const r = await fetchApi("/api/doctor/traffic");
  return r?.days ?? r ?? [];
}

export async function getDoctorPatients(search) {
  if (USE_MOCK_API) {
    await delay();
    if (search) {
      return mockPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    return mockPatients;
  }
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const list = await fetchApi(`/api/doctor/patients${q}`);
  return (list ?? []).map((p) => ({
    id: p.idNumber ?? p.id,
    name: p.names ?? "—",
    lastAppointment: p.lastAppointmentDate ?? "—",
    lastDiagnosis: p.lastDiagnosis ?? "—",
    phone: p.phone ?? "—",
    email: p.email ?? "—",
  }));
}

export async function getConsultationForAppointment(appointmentId) {
  if (USE_MOCK_API) return null;
  return fetchApi(`/api/doctor/appointments/${appointmentId}/consultation`);
}

export async function createConsultation(data) {
  if (USE_MOCK_API) {
    await delay();
    return { id: "mock-consultation", ...data };
  }
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
  return fetchApi("/api/doctor/consultations", { method: "POST", body: JSON.stringify(body) });
}
function toNum(v) { return v != null && v !== "" ? Number(v) : null; }
function toInt(v) { const n = toNum(v); return n != null && !isNaN(n) ? Math.round(n) : null; }

export async function getTestsByConsultation(consultationId) {
  if (USE_MOCK_API) {
    await delay();
    return [];
  }
  const list = await fetchApi(`/api/doctor/consultations/${consultationId}/tests`);
  return list ?? [];
}

export async function addMedicalTest(consultationId, name, description) {
  if (USE_MOCK_API) {
    await delay();
    return { id: "mock-test-" + Date.now(), name, description, status: "ORDERED" };
  }
  return fetchApi(`/api/doctor/consultations/${consultationId}/tests`, {
    method: "POST",
    body: JSON.stringify({ consultationId, name, description: description || "" }),
  });
}

export async function updateTestStatus(testId, status) {
  if (USE_MOCK_API) {
    await delay();
    return { id: testId, status };
  }
  return fetchApi(`/api/doctor/tests/${testId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function createPrescription(data) {
  if (USE_MOCK_API) {
    await delay();
    const patient = mockPatients.find((p) => p.id === data.patientId);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + (data.expiresIn || 90));
    const expiresStr = expiresDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return {
      id: Date.now(),
      patientId: data.patientId,
      patientName: patient?.name ?? "Unknown",
      medication: data.medication,
      dosage: data.dosage,
      frequency: data.frequency,
      instructions: data.instructions || "",
      refills: data.refills ?? 0,
      expires: expiresStr,
      doctor: "Dr. Anne Mutoni",
      status: "ready",
    };
  }
  if (data.appointmentId) {
    const note = data.note ?? "Prescription";
    const diagnosis = data.diagnosis ?? "Prescription";
    return fetchApi("/api/doctor/prescriptions/from-appointment", {
      method: "POST",
      body: JSON.stringify({ appointmentId: data.appointmentId, diagnosis, note }),
    });
  }
  const body = { consultationId: data.consultationId, note: data.note ?? data.instructions ?? "" };
  return fetchApi("/api/doctor/prescriptions", { method: "POST", body: JSON.stringify(body) });
}
