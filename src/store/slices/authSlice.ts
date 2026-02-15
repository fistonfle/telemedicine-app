import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../api/authService";
import { getStoredToken } from "../../api/client";
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

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.login(email, password);
      const me = await authService.getMe();
      return me;
    } catch (err) {
      return rejectWithValue((err as Error).message || "Login failed");
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
        state.user = action.payload ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
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
