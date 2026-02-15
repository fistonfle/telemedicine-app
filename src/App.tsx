import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import DoctorRegistration from "./pages/DoctorRegistration";
import PatientLayout from "./components/layout/PatientLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import BookAppointment from "./pages/BookAppointment";
import ConsultationHistory from "./pages/ConsultationHistory";
import ProfileSettings from "./pages/ProfileSettings";
import Prescriptions from "./pages/Prescriptions";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorSchedule from "./pages/DoctorSchedule";
import DoctorPatients from "./pages/DoctorPatients";
import CreatePrescription from "./pages/CreatePrescription";
import { getStoredToken } from "./api/services";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register/doctor" element={<DoctorRegistration />} />
      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="history" element={<ConsultationHistory />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      <Route
        path="/doctor"
        element={
          <ProtectedRoute>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="visit" element={<CreatePrescription />} />
        <Route path="prescriptions/new" element={<CreatePrescription />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
