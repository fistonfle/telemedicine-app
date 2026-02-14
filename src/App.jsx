import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./SignUp.jsx";
import Login from "./pages/Login.jsx";
import DoctorRegistration from "./DoctorRegistration.jsx";
import PatientLayout from "./components/PatientLayout.jsx";
import DoctorLayout from "./components/DoctorLayout.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import ConsultationHistory from "./pages/ConsultationHistory.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";
import Prescriptions from "./pages/Prescriptions.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import DoctorSchedule from "./pages/DoctorSchedule.jsx";
import DoctorPatients from "./pages/DoctorPatients.jsx";
import CreatePrescription from "./pages/CreatePrescription.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import { getStoredToken } from "./api/services.js";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/doctor" element={<DoctorRegistration />} />
      <Route path="/patient" element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="history" element={<ConsultationHistory />} />
        <Route path="records" element={<PlaceholderPage title="Medical Records" />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      <Route path="/doctor" element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="prescriptions/new" element={<CreatePrescription />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
