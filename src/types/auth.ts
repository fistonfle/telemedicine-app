export interface User {
  id?: string;
  role?: "DOCTOR" | "PATIENT";
  profileId?: string;
  names?: string;
  email?: string;
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
