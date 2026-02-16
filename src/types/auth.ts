export interface ProfileSummary {
  id: string;
  role: "DOCTOR" | "PATIENT" | "ADMIN";
  names?: string;
  specialty?: string;
  /** For doctor profiles: false until admin approves. */
  approved?: boolean | null;
  /** When true, admin has disabled this profile; user cannot use it for operations. */
  disabled?: boolean | null;
}

export interface User {
  id?: string;
  role?: "DOCTOR" | "PATIENT";
  profileId?: string;
  names?: string;
  email?: string;
  /** All profiles (doctor/patient) for this user; when length > 1, user picks which to use. */
  profiles?: ProfileSummary[];
}

export interface Profile {
  names?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SignupData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: "patient" | "doctor";
  specialty?: string | null;
  licenseNumber?: string | null;
  practiceDescription?: string | null;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  names?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
