import { fetchApi } from "./client";

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  approvedDoctors: number;
  pendingDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalConsultations: number;
}

export interface UserProfileSummary {
  profileId: string;
  role: string;
  names: string | null;
  approved: boolean | null;
  disabled: boolean | null;
  specialty: string | null;
}

export interface UserListItem {
  userId: string;
  email: string;
  isEnabled: boolean;
  createdAt: string;
  profiles: UserProfileSummary[];
}

export interface PendingDoctor {
  profileId: string;
  userId: string;
  email: string;
  names: string;
  specialty: string | null;
  licenseNumber: string | null;
}

export interface DoctorListItem {
  profileId: string;
  userId: string;
  email: string;
  names: string;
  specialty: string | null;
  licenseNumber: string | null;
  approved: boolean;
  disabled: boolean;
}

export interface PatientListItem {
  profileId: string;
  userId: string;
  email: string;
  names: string | null;
  phone: string | null;
  disabled: boolean;
}

function unwrap<T>(raw: unknown): T {
  if (raw != null && typeof raw === "object" && "data" in (raw as object)) return (raw as { data: T }).data as T;
  return raw as T;
}

function normalizeList<T>(raw: unknown, map: (o: Record<string, unknown>) => T): T[] {
  const data = unwrap(raw);
  if (Array.isArray(data)) return data.map((p) => map((p ?? {}) as Record<string, unknown>));
  return [];
}

export async function getAdminStats(): Promise<AdminStats> {
  const raw = await fetchApi<unknown>("/api/admin/stats");
  const d = unwrap(raw) as Record<string, unknown>;
  return {
    totalUsers: Number(d?.totalUsers ?? 0),
    totalDoctors: Number(d?.totalDoctors ?? 0),
    approvedDoctors: Number(d?.approvedDoctors ?? 0),
    pendingDoctors: Number(d?.pendingDoctors ?? 0),
    totalPatients: Number(d?.totalPatients ?? 0),
    totalAppointments: Number(d?.totalAppointments ?? 0),
    totalConsultations: Number(d?.totalConsultations ?? 0),
  };
}

export async function getAdminUsers(): Promise<UserListItem[]> {
  const raw = await fetchApi<unknown>("/api/admin/users");
  return normalizeList(raw, (o) => ({
    userId: String(o.userId ?? o.user_id ?? ""),
    email: String(o.email ?? ""),
    isEnabled: o.isEnabled === true,
    createdAt: String(o.createdAt ?? ""),
    profiles: (Array.isArray(o.profiles) ? o.profiles : []).map((p: Record<string, unknown>) => ({
      profileId: String(p.profileId ?? p.profile_id ?? ""),
      role: String(p.role ?? ""),
      names: p.names != null ? String(p.names) : null,
      approved: p.approved === true ? true : p.approved === false ? false : null,
      disabled: p.disabled === true ? true : p.disabled === false ? false : null,
      specialty: p.specialty != null ? String(p.specialty) : null,
    })),
  }));
}

export async function getAdminDoctors(): Promise<DoctorListItem[]> {
  const raw = await fetchApi<unknown>("/api/admin/doctors");
  return normalizeList(raw, (o) => ({
    profileId: String(o.profileId ?? o.profile_id ?? ""),
    userId: String(o.userId ?? o.user_id ?? ""),
    email: String(o.email ?? ""),
    names: String(o.names ?? ""),
    specialty: o.specialty != null ? String(o.specialty) : null,
    licenseNumber: o.licenseNumber != null ? String(o.licenseNumber) : null,
    approved: o.approved === true,
    disabled: o.disabled === true,
  }));
}

export async function getPendingDoctors(): Promise<PendingDoctor[]> {
  const raw = await fetchApi<unknown>("/api/admin/doctors/pending");
  return normalizeList(raw, (o) => ({
    profileId: String(o.profileId ?? o.profile_id ?? ""),
    userId: String(o.userId ?? o.user_id ?? ""),
    email: String(o.email ?? ""),
    names: String(o.names ?? ""),
    specialty: o.specialty != null ? String(o.specialty) : null,
    licenseNumber: o.licenseNumber != null ? String(o.licenseNumber) : null,
  }));
}

export async function getAdminPatients(): Promise<PatientListItem[]> {
  const raw = await fetchApi<unknown>("/api/admin/patients");
  return normalizeList(raw, (o) => ({
    profileId: String(o.profileId ?? o.profile_id ?? ""),
    userId: String(o.userId ?? o.user_id ?? ""),
    email: String(o.email ?? ""),
    names: o.names != null ? String(o.names) : null,
    phone: o.phone != null ? String(o.phone) : null,
    disabled: o.disabled === true,
  }));
}

export async function approveDoctor(profileId: string): Promise<void> {
  await fetchApi(`/api/admin/doctors/${profileId}/approve`, { method: "POST" });
}

/** Set profile disabled (true) or enabled (false). Disabled profiles cannot be used for operations. */
export async function setProfileDisabled(profileId: string, disabled: boolean): Promise<void> {
  await fetchApi(`/api/admin/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify({ disabled }),
  });
}

/** Set user account enabled (true) or disabled (false). Disabled users cannot sign in. */
export async function setUserEnabled(userId: string, enabled: boolean): Promise<void> {
  await fetchApi(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}
