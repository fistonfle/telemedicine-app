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

  const inputClass =
    "w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none border-slate-200 dark:border-slate-700";
  const selectClass =
    "w-full appearance-none rounded-lg border bg-slate-50 dark:bg-slate-800/50 p-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white";

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request doctor profile</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Request to add a doctor profile to your account. An administrator will review and approve your request.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Medical details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="specialty">
                Specialty
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className={selectClass}
              >
                <option value="">Select specialty</option>
                <optgroup label="Primary Care">
                  <option value="General Practice">General Practice</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                </optgroup>
                <optgroup label="Specialists">
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                </optgroup>
                <optgroup label="Surgery">
                  <option value="General Surgery">General Surgery</option>
                  <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                  <option value="Plastic Surgery">Plastic Surgery</option>
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="license">
                License number
              </label>
              <input
                id="license"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. RMDC-12345 (optional)"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="practice">
                Practice description
              </label>
              <textarea
                id="practice"
                value={practiceDescription}
                onChange={(e) => setPracticeDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe your practice and services (optional)"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/patient")}
            className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
