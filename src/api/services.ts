/**
 * Barrel file – re-exports all API services.
 */

export { getStoredToken, setStoredToken, clearStoredToken, fetchApi } from "./client";
export {
  getMe,
  getProfile,
  updateProfile,
  login,
  signup,
  logout,
} from "./authService";
export {
  getPatientAppointments,
  getPatientStats,
  getPatientHealthSnapshot,
  getConsultations,
  getConsultationStats,
  getPrescriptions,
} from "./patientService";
export { getDoctors, getTimeSlots, createAppointment } from "./bookingService";
export {
  getDoctorSchedule,
  updateDoctorSchedule,
  updateAppointmentStatus,
  getDoctorAppointments,
  getAppointmentDetails,
  getDoctorAppointment,
  getDoctorStats,
  getPatientTraffic,
  getDoctorPatients,
  getConsultationForAppointment,
  createConsultation,
  getTestsByConsultation,
  addMedicalTest,
  updateTestStatus,
  createPrescription,
} from "./doctorService";
