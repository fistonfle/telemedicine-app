import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../api/authService";
import { getStoredToken, getStoredActiveProfileId, setStoredActiveProfileId } from "../authStorage";
import type { User, Profile, UpdateProfileData, SignupData } from "../../types";

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/** Step 1: email/password. Returns User if no OTP, or { requiresOtp: true, email } if OTP required. */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.login(email, password);
      if (res.requiresOtp && res.email) {
        return { requiresOtp: true as const, email: res.email };
      }
      const me = await authService.getMe();
      return me;
    } catch (err) {
      return rejectWithValue((err as Error).message || "Login failed");
    }
  }
);

/** Step 2: verify OTP and complete login. Call after loginUser returns requiresOtp. */
export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.verifyLoginOtp(email, code);
      const me = await authService.getMe();
      return me;
    } catch (err) {
      return rejectWithValue((err as Error).message || "Invalid or expired code.");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      return await authService.signup(data);
    } catch (err) {
      return rejectWithValue((err as Error).message || "Signup failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(data);
    } catch (err) {
      return rejectWithValue((err as Error).message || "Failed to update profile");
    }
  }
);

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    profile: null,
    isAuthenticated: !!getStoredToken(),
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload || !!getStoredToken();
        const user = action.payload as { profiles?: { id: string }[] } | null;
        const profiles = user?.profiles ?? [];
        if (profiles.length === 0) return;
        const storedId = getStoredActiveProfileId();
        const validStored = storedId && profiles.some((p) => p.id === storedId);
        if (!validStored) {
          setStoredActiveProfileId(profiles[0].id);
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload as { requiresOtp?: boolean; email?: string } | User | null;
        if (p && "requiresOtp" in p && p.requiresOtp) {
          state.user = null;
          state.isAuthenticated = false;
        } else {
          state.user = (p as User) ?? null;
          state.isAuthenticated = !!state.user;
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload ?? state.profile;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
