import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { getDoctorAppointment, createPrescription } from "../api/services";

function CreatePrescription() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientIdParam = searchParams.get("patientId");
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    patientId: patientIdParam || "",
    medication: "",
    dosage: "",
    frequency: "",
    instructions: "",
    refills: 0,
    expiresIn: 90,
  });

  useEffect(() => {
    if (!appointmentId || !patientIdParam) {
      setError("Invalid link. Prescriptions are created from an appointment.");
      setLoading(false);
      return;
    }
    setForm((prev) => ({ ...prev, patientId: patientIdParam }));
    getDoctorAppointment(appointmentId)
      .then(setAppointment)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [appointmentId, patientIdParam]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createPrescription({ ...form, appointmentId, patientId: patientIdParam });
      navigate("/doctor");
    } catch (err) {
      setError(err.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (!appointmentId || !patientIdParam || error) {
    return (
      <div className="p-8 max-w-2xl">
        <Link
          to="/doctor"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-4"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Cannot create prescription</p>
          <p className="text-sm mt-1">{error || "Prescriptions are created from an appointment. Go to your dashboard and use Write Prescription on an appointment."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          to="/doctor"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-4"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create Prescription</h1>
        <p className="text-slate-500 mt-1">
          For <span className="font-medium text-slate-700">{appointment?.patient}</span>
          {appointment && (
            <span className="text-slate-500"> — {appointment.description} (Slot {appointment.slot})</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Patient (read-only) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Patient</label>
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            {appointment?.patient} (ID: {form.patientId})
          </div>
        </div>

        {/* Medication */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Medication <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.medication}
            onChange={(e) => handleChange("medication", e.target.value)}
            placeholder="e.g. Amoxicillin, Lisinopril"
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Dosage <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.dosage}
            onChange={(e) => handleChange("dosage", e.target.value)}
            placeholder="e.g. 500 mg, 10 mg"
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Frequency <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.frequency}
            onChange={(e) => handleChange("frequency", e.target.value)}
            placeholder="e.g. Twice daily with food, Once daily in the morning"
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Instructions (optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Special instructions <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            value={form.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            placeholder="Take with food. Avoid alcohol. Store in a cool, dry place."
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
          />
        </div>

        {/* Refills & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Number of refills
            </label>
            <input
              type="number"
              min={0}
              value={form.refills}
              onChange={(e) => handleChange("refills", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Valid for (days)
            </label>
            <input
              type="number"
              min={1}
              value={form.expiresIn}
              onChange={(e) => handleChange("expiresIn", parseInt(e.target.value) || 90)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            to="/doctor"
            className="px-6 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <span className="material-icons text-lg">add</span>
                Create Prescription
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePrescription;
