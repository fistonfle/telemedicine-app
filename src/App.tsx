import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ChooseProfile from "./pages/ChooseProfile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountCreated from "./pages/AccountCreated";
import DoctorRegistration from "./pages/DoctorRegistration";
import PatientLayout from "./components/layout/PatientLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import PatientAppointmentDetail from "./pages/PatientAppointmentDetail";
import BookAppointment from "./pages/BookAppointment";
import ConsultationHistory from "./pages/ConsultationHistory";
import ProfileSettings from "./pages/ProfileSettings";
import Prescriptions from "./pages/Prescriptions";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorSchedule from "./pages/DoctorSchedule";
import DoctorPatients from "./pages/DoctorPatients";
import CreatePrescription from "./pages/CreatePrescription";
import DoctorPending from "./pages/DoctorPending";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPendingDoctors from "./pages/AdminPendingDoctors";
import AdminUsers from "./pages/AdminUsers";
import AdminDoctors from "./pages/AdminDoctors";
import AdminPatients from "./pages/AdminPatients";
import RequestDoctorProfile from "./pages/RequestDoctorProfile";
import { getStoredToken } from "./store/authStorage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/choose-profile" element={<ProtectedRoute><ChooseProfile /></ProtectedRoute>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account-created" element={<AccountCreated />} />
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
        <Route path="appointments/:id" element={<PatientAppointmentDetail />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="history" element={<ConsultationHistory />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="request-doctor" element={<RequestDoctorProfile />} />
      </Route>
      <Route path="/doctor/pending" element={<ProtectedRoute><DoctorPending /></ProtectedRoute>} />
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
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="pending-doctors" element={<AdminPendingDoctors />} />
        <Route path="patients" element={<AdminPatients />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
