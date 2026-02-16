import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../api/authService";
import { useToast } from "../components/ui/Toast";

export default function RequestDoctorProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [practiceDescription, setPracticeDescription] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.addProfile({
        role: "DOCTOR",
        specialty: specialty.trim() || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        practiceDescription: practiceDescription.trim() || undefined,
      });
      setDone(true);
      toast.success("Doctor profile requested. You will be notified once an admin approves it.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
          <span className="material-icons text-5xl text-emerald-600 mb-4 block">pending_actions</span>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Request submitted</h1>
          <p className="text-slate-600 mb-6">
            Your request to add a doctor profile is pending admin approval. You can continue using the app as a patient.
            We will notify you once your doctor profile is approved.
          </p>
          <button
            type="button"
            onClick={() => navigate("/patient")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Request doctor profile</h1>
      <p className="text-slate-500 mb-8">
        Request to add a doctor profile to your account. An administrator will review and approve your request.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-slate-200 p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. General Practice"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">License number</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Optional"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Practice description</label>
          <textarea
            value={practiceDescription}
            onChange={(e) => setPracticeDescription(e.target.value)}
            rows={3}
            placeholder="Optional"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/patient")}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
