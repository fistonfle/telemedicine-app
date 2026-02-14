import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./SignUp.jsx";
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
import PlaceholderPage from "./pages/PlaceholderPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/register/doctor" element={<DoctorRegistration />} />
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="history" element={<ConsultationHistory />} />
        <Route path="messages" element={<PlaceholderPage title="Messages" />} />
        <Route path="records" element={<PlaceholderPage title="Medical Records" />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
