/**
 * Barrel file – re-exports all API services.
 */


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
  scheduleFollowUp,
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
  getMedicationsByConsultation,
  addPrescriptionMedication,
  deletePrescriptionMedication,
  updateTestStatus,
  createPrescription,
} from "./doctorService";
