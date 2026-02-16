import { API_URL } from "./config";
import { fetchApi } from "./client";
import type { User, Profile, ProfileSummary, SignupData, UpdateProfileData } from "../types";
import { clearStoredAuth, getStoredRefreshToken, setStoredRefreshToken, setStoredToken } from "../store/authStorage";

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function getMe(): Promise<User | null> {
  const raw = await fetchApi<Record<string, unknown> | null>("/api/me");
  if (!raw) return null;
  const profiles = raw.profiles as Array<{ id?: string; role?: string; names?: string; specialty?: string }> | undefined;
  const list: ProfileSummary[] = Array.isArray(profiles)
    ? profiles.map((p) => ({
        id: String(p?.id ?? ""),
        role: (p?.role ?? "PATIENT") as "DOCTOR" | "PATIENT" | "ADMIN",
        names: p?.names,
        specialty: p?.specialty,
        approved: p?.approved ?? null,
        disabled: p?.disabled ?? null,
      }))
    : undefined;
  return {
    id: raw.userId != null ? String(raw.userId) : undefined,
    profileId: raw.profileId != null ? String(raw.profileId) : undefined,
    role: (raw.role as User["role"]) ?? undefined,
    names: (raw.names as string) ?? undefined,
    email: (raw.email as string) ?? undefined,
    profiles: list,
  };
}

export async function getProfile(): Promise<Profile | null> {
  return fetchApi<Profile | null>("/api/me/profile");
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  return fetchApi<Profile>("/api/me/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export type LoginResponse = {
  requiresOtp: boolean;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
};

/** Step 1: submit email/password. Returns requiresOtp + email; OTP is sent by email. Then call verifyLoginOtp(email, code). */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    const msg =
      err.message ||
      err.error ||
      (res.status === 401 ? "Email or password is incorrect. Please try again." : res.statusText);
    throw new Error(msg);
  }
  const data = (await res.json()) as LoginResponse;
  if (data.accessToken) setStoredToken(data.accessToken);
  if (data.refreshToken) setStoredRefreshToken(data.refreshToken);
  return data;
}

/** Resend login OTP (after step 1 when requiresOtp). */
export async function resendLoginOtp(email: string): Promise<MessageResponse> {
  const res = await fetch(`${API_URL}/api/auth/login/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || "Could not resend code.");
  }
  return res.json() as Promise<MessageResponse>;
}

/** Step 2: submit OTP received by email to complete login and get tokens. */
export async function verifyLoginOtp(email: string, code: string): Promise<{ accessToken: string; refreshToken?: string }> {
  const res = await fetch(`${API_URL}/api/auth/login/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || "Invalid or expired code.");
  }
  const data = (await res.json()) as { accessToken: string; refreshToken?: string };
  setStoredToken(data.accessToken);
  if (data.refreshToken) setStoredRefreshToken(data.refreshToken);
  return data;
}

export async function refreshTokenRequest(): Promise<string> {
  const rt = getStoredRefreshToken();
  if (!rt) throw new Error("NO_REFRESH_TOKEN");

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });

  if (!res.ok) {
    clearStoredAuth();
    throw new Error("REFRESH_FAILED");
  }

  const data = (await res.json()) as RefreshResponse;

  setStoredToken(data.accessToken);
  if (data.refreshToken) setStoredRefreshToken(data.refreshToken);

  return data.accessToken;
}

export async function signup(data: SignupData): Promise<unknown> {
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
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; detail?: string };
    throw new Error(err.message || err.detail || res.statusText);
  }
  return res.json();
}

export type MessageResponse = { message: string };

/** Verify email by token (from link in email). Use when user lands on /verify-email?token=xxx */
export async function verifyEmailByToken(token: string): Promise<MessageResponse> {
  const url = `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { method: "GET" });
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  if (!res.ok) {
    const err = isJson
      ? ((await res.json().catch(() => ({}))) as { message?: string })
      : {};
    throw new Error(err.message || `Invalid or expired link (${res.status}).`);
  }
  if (isJson) {
    const data = await res.json().catch(() => null);
    return data != null ? (data as MessageResponse) : { message: "Email verified. You can now sign in." };
  }
  return { message: "Email verified. You can now sign in." };
}

/** Resend verification link (after signup). */
export async function resendVerificationLink(email: string): Promise<MessageResponse> {
  const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || "Could not resend link.");
  }
  return res.json() as Promise<MessageResponse>;
}

/** Request password reset; sends reset link to email if account exists. */
export async function forgotPassword(email: string): Promise<MessageResponse> {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || "Request failed.");
  }
  return res.json() as Promise<MessageResponse>;
}

/** Reset password with token from email link. */
export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.trim(), newPassword }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; details?: string[] };
    const msg = err.message || (Array.isArray(err.details) ? err.details[0] : undefined) || "Invalid or expired link.";
    throw new Error(msg);
  }
  return res.json() as Promise<MessageResponse>;
}

export function logout(): void {
  clearStoredAuth();
}

/** Add a second profile (e.g. PATIENT for a doctor, or DOCTOR for a patient - pending approval). Returns the new profile summary. */
export async function addProfile(params: {
  role: "DOCTOR" | "PATIENT";
  names?: string;
  specialty?: string;
  licenseNumber?: string;
  hospitalAffiliation?: string;
  yearsExperience?: number;
  practiceDescription?: string;
}): Promise<ProfileSummary> {
  const res = await fetchApi<ProfileSummary>("/api/me/profiles", {
    method: "POST",
    body: JSON.stringify({
      role: params.role,
      names: params.names ?? null,
      specialty: params.specialty ?? null,
      licenseNumber: params.licenseNumber ?? null,
      hospitalAffiliation: params.hospitalAffiliation ?? null,
      yearsExperience: params.yearsExperience ?? null,
      practiceDescription: params.practiceDescription ?? null,
    }),
  });
  return res;
}
