import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../api/bookingService";
import type { CreateAppointmentData, Doctor, TimeSlot } from "../../types";

export const fetchDoctors = createAsyncThunk(
  "booking/fetchDoctors",
  async (specialty: string | undefined, { rejectWithValue }) => {
    try {
      return await bookingService.getDoctors(specialty ?? "all");
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  "booking/fetchTimeSlots",
  async (
    { doctorId, date }: { doctorId: string | number; date: Date | string },
    { rejectWithValue }
  ) => {
    try {
      return await bookingService.getTimeSlots(doctorId, date);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const createAppointmentThunk = createAsyncThunk(
  "booking/createAppointment",
  async (data: CreateAppointmentData, { rejectWithValue }) => {
    try {
      return await bookingService.createAppointment(data);
    } catch (err) {
      console.log("Big error "+JSON.stringify(err))
      return rejectWithValue(
        (err as Error).message || "Failed to book appointment"
      );
    }
  }
);

interface BookingState {
  doctors: Doctor[];
  slots: TimeSlot[];
  dayStart: string | null;
  dayEnd: string | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    doctors: [],
    slots: [],
    dayStart: null,
    dayEnd: null,
    loading: false,
    submitting: false,
    error: null,
  } as BookingState,
  reducers: {
    clearSlots: (state) => {
      state.slots = [];
      state.dayStart = null;
      state.dayEnd = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload ?? [];
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload ?? {};
        state.slots = payload.slots ?? [];
        state.dayStart = payload.dayStart ?? null;
        state.dayEnd = payload.dayEnd ?? null;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAppointmentThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createAppointmentThunk.fulfilled, (state) => {
        state.submitting = false;
        state.error = null;
      })
      .addCase(createAppointmentThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSlots, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
