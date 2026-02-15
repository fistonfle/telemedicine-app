import { API_URL } from "./config";
import { fetchApi } from "./client";
import type { User, Profile, SignupData, UpdateProfileData } from "../types";
import { clearStoredAuth, getStoredRefreshToken, setStoredRefreshToken, setStoredToken } from "../store/authStorage";

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function getMe(): Promise<User | null> {
  return fetchApi<User | null>("/api/me");
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

export async function login(email: string, password: string): Promise<{ accessToken?: string,refreshToken?: string }> {
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
  const data = (await res.json()) as { accessToken?: string , refreshToken?: string};
  if (data.accessToken) setStoredToken(data.accessToken);
  if (data.refreshToken) setStoredRefreshToken(data.refreshToken);
  return data;
}

export async function refreshTokenRequest(): Promise<string> {
  const rt = getStoredRefreshToken();
  if (!rt) throw new Error("NO_REFRESH_TOKEN");

  const res = await fetch(`${API_URL}/auth/refresh`, {
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

export function logout(): void {
  clearStoredAuth();
}
