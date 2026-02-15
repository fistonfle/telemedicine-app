import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as doctorService from "../../api/doctorService";
import type {
  DoctorAppointment,
  DoctorPatient,
  DoctorStats,
  TrafficDay,
} from "../../types";

export const fetchDoctorAppointments = createAsyncThunk(
  "doctor/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctorAppointments();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDoctorStats = createAsyncThunk(
  "doctor/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctorStats();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPatientTraffic = createAsyncThunk(
  "doctor/fetchTraffic",
  async (_, { rejectWithValue }) => {
    try {
      return await doctorService.getPatientTraffic();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDoctorPatients = createAsyncThunk(
  "doctor/fetchPatients",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctorPatients(search ?? "");
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateAppointmentStatusThunk = createAsyncThunk(
  "doctor/updateAppointmentStatus",
  async (
    { appointmentId, status }: { appointmentId: string | number; status: string },
    { rejectWithValue }
  ) => {
    try {
      return await doctorService.updateAppointmentStatus(appointmentId, status);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDoctorSchedule = createAsyncThunk(
  "doctor/fetchSchedule",
  async (_, { rejectWithValue }) => {
    try {
      return await doctorService.getDoctorSchedule();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateDoctorScheduleThunk = createAsyncThunk(
  "doctor/updateSchedule",
  async (days: unknown[], { rejectWithValue }) => {
    try {
      return await doctorService.updateDoctorSchedule(days);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDoctorDashboard = createAsyncThunk(
  "doctor/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [appointments, stats, traffic] = await Promise.all([
        doctorService.getDoctorAppointments(),
        doctorService.getDoctorStats(),
        doctorService.getPatientTraffic(),
      ]);
      return { appointments, stats, traffic };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

interface DoctorState {
  appointments: DoctorAppointment[];
  stats: DoctorStats | null;
  traffic: TrafficDay[];
  patients: DoctorPatient[];
  schedule: unknown;
  loading: boolean;
  error: string | null;
}

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    appointments: [],
    stats: null,
    traffic: [],
    patients: [],
    schedule: null,
    loading: false,
    error: null,
  } as DoctorState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload ?? [];
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.stats = action.payload ?? null;
      })
      .addCase(fetchPatientTraffic.fulfilled, (state, action) => {
        state.traffic = action.payload ?? [];
      })
      .addCase(fetchDoctorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { appointments, stats, traffic } = action.payload ?? {};
        state.appointments = appointments ?? state.appointments;
        state.stats = stats ?? state.stats;
        state.traffic = traffic ?? state.traffic;
      })
      .addCase(fetchDoctorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDoctorPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.patients = action.payload ?? [];
        state.loading = false;
      })
      .addCase(fetchDoctorPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppointmentStatusThunk.fulfilled, (state, action) => {
        const payload = action.payload as { id?: string | number; status?: string } | undefined;
        const apt = state.appointments.find((a) => a.id === payload?.id);
        if (apt && payload?.status) {
          apt.status = payload.status.toLowerCase();
        }
      })
      .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
      })
      .addCase(updateDoctorScheduleThunk.fulfilled, (state, action) => {
        state.schedule = action.payload ?? state.schedule;
      });
  },
});

export const { clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
