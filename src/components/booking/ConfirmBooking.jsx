function ConfirmBooking({
  doctor,
  date,
  slot,
  reasonForVisit,
  onReasonChange,
  onConfirm,
  onBack,
  submitting = false,
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Review & Confirm Appointment
      </h1>
      <p className="text-slate-500 mb-8">
        Please check the details below before proceeding to confirm your video
        consultation.
      </p>

      {/* Doctor Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {doctor.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
            <p className="text-slate-500 text-sm uppercase tracking-wide">
              {doctor.specialty}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {doctor.rating} ({doctor.reviews} reviews) • St. Mary's Clinic
            </p>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="material-icons text-primary">event</span>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Date & Slot</p>
            <p className="font-medium text-slate-900">
              {date}, Slot {slot}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="material-icons text-primary">videocam</span>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Consultation</p>
            <p className="font-medium text-slate-900">Video Consultation</p>
            <p className="text-sm text-slate-500">Telemed Secure Link</p>
          </div>
        </div>
      </div>

      {/* Reason for Visit */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Reason for Visit (Optional)
        </label>
        <textarea
          value={reasonForVisit}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Please describe briefly any symptoms or specific health concerns"
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
        />
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-8">
        <span className="material-icons text-primary shrink-0">info</span>
        <p className="text-sm text-slate-700">
          A secure meeting link will be sent to your email and phone number 15
          minutes before the appointment. You can cancel or reschedule up to 24
          hours in advance.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-icons">check_circle</span>
          )}
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
        <button
          onClick={onBack}
          className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium"
        >
          Cancel and go back
        </button>
      </div>

      <div className="flex justify-center gap-6 mt-8 text-sm text-slate-400">
        <a href="#" className="hover:text-primary">Help</a>
        <a href="#" className="hover:text-primary">Terms</a>
        <a href="#" className="hover:text-primary">Privacy</a>
        <a href="#" className="hover:text-primary">Support</a>
      </div>
    </div>
  );
}

export default ConfirmBooking;
