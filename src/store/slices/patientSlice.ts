import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as patientService from "../../api/patientService";
import type {
  PatientAppointment,
  PatientStats,
  PatientHealth,
  Consultation,
  ConsultationStats,
  PrescriptionRow,
} from "../../types";

export const fetchPatientAppointments = createAsyncThunk(
  "patient/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getPatientAppointments();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPatientStats = createAsyncThunk(
  "patient/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getPatientStats();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPatientHealth = createAsyncThunk(
  "patient/fetchHealth",
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getPatientHealthSnapshot();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchConsultations = createAsyncThunk(
  "patient/fetchConsultations",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      return await patientService.getConsultations(search ?? "");
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchConsultationStats = createAsyncThunk(
  "patient/fetchConsultationStats",
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getConsultationStats();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPrescriptions = createAsyncThunk(
  "patient/fetchPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      return await patientService.getPrescriptions();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPatientDashboard = createAsyncThunk(
  "patient/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [appointments, stats, health] = await Promise.all([
        patientService.getPatientAppointments(),
        patientService.getPatientStats(),
        patientService.getPatientHealthSnapshot(),
      ]);
      return { appointments, stats, health };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

interface PatientState {
  appointments: PatientAppointment[];
  stats: PatientStats | null;
  health: PatientHealth | null;
  consultations: Consultation[];
  consultationStats: ConsultationStats | null;
  prescriptions: PrescriptionRow[];
  loading: boolean;
  error: string | null;
}

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    appointments: [],
    stats: null,
    health: null,
    consultations: [],
    consultationStats: null,
    prescriptions: [],
    loading: false,
    error: null,
  } as PatientState,
  reducers: {
    clearPatientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload ?? [];
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.stats = action.payload ?? null;
      })
      .addCase(fetchPatientHealth.fulfilled, (state, action) => {
        state.health = action.payload ?? null;
      })
      .addCase(fetchPatientDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { appointments, stats, health } = action.payload ?? {};
        state.appointments = appointments ?? state.appointments;
        state.stats = stats ?? state.stats;
        state.health = health ?? state.health;
      })
      .addCase(fetchPatientDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.consultations = action.payload ?? [];
        state.loading = false;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConsultationStats.fulfilled, (state, action) => {
        state.consultationStats = action.payload ?? null;
      })
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.prescriptions = action.payload ?? [];
        state.loading = false;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPatientError } = patientSlice.actions;
export default patientSlice.reducer;
