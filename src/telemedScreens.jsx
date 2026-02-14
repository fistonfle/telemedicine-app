const patientNav = [
  "Dashboard",
  "Appointments",
  "History",
  "Profile",
  "Messages",
  "Medical Records",
  "Settings",
];

const doctorNav = [
  "Dashboard",
  "Appointments",
  "Schedule",
  "Patients",
  "Messages",
  "Settings",
];

const prescribeNav = [
  "Dashboard",
  "Appointments",
  "Prescriptions",
  "Messages",
  "Medical Records",
];

const consultationNav = [
  "Dashboard",
  "Appointments",
  "History",
  "Documents",
  "Messages",
  "Settings",
];

const authInputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500";

const badgeTone = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-slate-200 text-slate-600",
  info: "bg-sky-100 text-sky-700",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TelemedMark({ compact = false }) {
  return (
    <div className={cx("flex items-center gap-2", compact ? "text-xs" : "text-sm")}>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-sky-500 text-[10px] font-semibold text-white">
        +
      </span>
      <span className="font-semibold text-slate-700">Telemed</span>
    </div>
  );
}

function WorkspaceCard({ children, className = "" }) {
  return (
    <div className={cx("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

function ShellSidebar({
  items,
  activeItem,
  userName = "Alex Johnson",
  userRole = "Patient",
  logoutLabel = "Logout",
}) {
  return (
    <aside className="flex min-h-full flex-col border-r border-slate-200 bg-slate-50 p-4">
      <TelemedMark compact />
      <nav className="mt-6 space-y-1">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={cx(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium",
              item === activeItem
                ? "bg-sky-100 text-sky-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            )}
          >
            <span className="h-3 w-3 rounded-sm border border-current/40" />
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          <span className="h-3 w-3 rounded-sm border border-current/40" />
          {logoutLabel}
        </button>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-semibold text-slate-700">{userName}</p>
          <p className="text-[10px] text-slate-400">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}

function AppShell({
  navItems,
  activeItem,
  userName,
  userRole,
  children,
  className = "",
}) {
  return (
    <WorkspaceCard className={cx("min-h-[700px]", className)}>
      <div className="grid min-h-[700px] grid-cols-1 md:grid-cols-[220px_1fr]">
        <ShellSidebar
          items={navItems}
          activeItem={activeItem}
          userName={userName}
          userRole={userRole}
        />
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </WorkspaceCard>
  );
}

function SummaryMetric({ label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
      {note ? <p className="mt-1 text-[10px] text-slate-500">{note}</p> : null}
    </div>
  );
}

function StatusBadge({ tone = "info", children }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        badgeTone[tone] ?? badgeTone.info,
      )}
    >
      {children}
    </span>
  );
}

function Stepper({ steps, currentStep }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <span
              className={cx(
                "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                index + 1 <= currentStep
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 text-slate-500",
              )}
            >
              {index + 1}
            </span>
            <span className="mt-1 text-[10px] text-slate-500">{step}</span>
          </div>
          {index < steps.length - 1 ? (
            <div
              className={cx(
                "mx-2 h-0.5 flex-1",
                index + 1 < currentStep ? "bg-sky-400" : "bg-slate-200",
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CalendarGrid() {
  const days = Array.from({ length: 35 }, (_, idx) => idx + 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">October 2023</p>
        <p className="text-xs text-slate-400">&lt; &gt;</p>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400">
        {["S", "M", "T", "W", "T", "F", "S"].map((name, index) => (
          <span key={`${name}-${index}`}>{name}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => (
          <span
            key={day}
            className={cx(
              "rounded-md py-1 text-[11px]",
              day === 13
                ? "bg-sky-500 font-semibold text-white"
                : day <= 31
                  ? "text-slate-600"
                  : "text-slate-300",
            )}
          >
            {day <= 31 ? day : day - 31}
          </span>
        ))}
      </div>
    </div>
  );
}

function AuthInput({ label, value }) {
  return (
    <label className="space-y-1 text-xs text-slate-500">
      <span>{label}</span>
      <div className={authInputClass}>{value}</div>
    </label>
  );
}

function PatientSignupScreen() {
  return (
    <WorkspaceCard className="mx-auto max-w-[900px] bg-slate-50 p-8 sm:p-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <TelemedMark />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-center text-2xl font-semibold text-slate-800">
            Create Your Account
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Join our healthcare network and start your journey today.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-lg border border-sky-400 bg-sky-50 px-3 py-3 text-left text-xs font-semibold text-sky-700"
            >
              I am a Patient
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-left text-xs font-semibold text-slate-500"
            >
              I am a Doctor
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <AuthInput label="Full Name" value="John Doe" />
            <AuthInput label="Email Address" value="john@example.com" />
            <div className="grid gap-3 sm:grid-cols-2">
              <AuthInput label="Password" value="********" />
              <AuthInput label="Confirm Password" value="********" />
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            By creating an account, you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create Account
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account? <span className="font-semibold text-sky-600">Login</span>
          </p>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </div>
      </div>
    </WorkspaceCard>
  );
}

function DoctorSignupScreen() {
  return (
    <WorkspaceCard className="mx-auto max-w-[980px] bg-slate-50 p-8 sm:p-10">
      <div className="mb-6 flex items-center justify-between text-xs">
        <TelemedMark />
        <span className="font-medium text-sky-600">Back to Role Selection</span>
      </div>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-center text-2xl font-semibold text-slate-800">
          Create your Doctor Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Join our network of healthcare professionals and start providing remote
          care today.
        </p>

        <div className="mt-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Personal Information
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <AuthInput label="Full Name" value="Dr. Jane Smith" />
            <AuthInput label="Professional Email" value="jane.smith@hospital.com" />
          </div>
          <AuthInput label="Secure Password" value="************" />

          <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
            Medical Credentials
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <AuthInput label="Medical Specialty" value="Select Specialty" />
            <AuthInput label="Medical License Number" value="eg. LIC 12345678" />
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-sky-50 p-2 text-[11px] text-sky-700">
          By registering, you confirm that submitted medical information may be
          verified before your profile is approved.
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Register as Doctor
        </button>
        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account? <span className="font-semibold text-sky-600">Log in</span>
        </p>
      </div>
    </WorkspaceCard>
  );
}

function PatientDashboardScreen() {
  const appointments = [
    {
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      datetime: "Oct 12, 2023 - 02:00 PM",
      type: "Video",
      status: "confirmed",
      action: "Join Call",
    },
    {
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology",
      datetime: "Oct 15, 2023 - 10:30 AM",
      type: "In Person",
      status: "pending",
      action: "Cancel",
    },
    {
      doctor: "Dr. Elena Rodriguez",
      specialty: "General Practice",
      datetime: "Oct 21, 2023 - 01:15 PM",
      type: "Video",
      status: "confirmed",
      action: "Reschedule",
    },
  ];

  return (
    <AppShell
      navItems={patientNav}
      activeItem="Dashboard"
      userName="Alex Johnson"
      userRole="Patient"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Hello, Alex!</h2>
            <p className="text-xs text-slate-500">
              You have an appointment today at 2:00 PM.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-right">
            <p className="text-[11px] font-semibold text-slate-700">Alex Johnson</p>
            <p className="text-[10px] text-slate-400">Patient #1289</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <SummaryMetric label="Next Appointment" value="02:00 PM" note="Dr. Sarah Wilson" />
          <SummaryMetric label="Past Consultations" value="24 Sessions" note="Last visit Sep 28" />
          <SummaryMetric label="New Messages" value="03 Unread" note="Check doctor notes" />
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="flex items-center justify-between border-b border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-700">Upcoming Appointments</h3>
            <button
              type="button"
              className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Book New Appointment
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Doctor</th>
                  <th className="px-3 py-2">Specialty</th>
                  <th className="px-3 py-2">Date &amp; Time</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.doctor} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-700">{appointment.doctor}</td>
                    <td className="px-3 py-3 text-slate-500">{appointment.specialty}</td>
                    <td className="px-3 py-3 text-slate-500">{appointment.datetime}</td>
                    <td className="px-3 py-3 text-slate-500">{appointment.type}</td>
                    <td className="px-3 py-3">
                      <StatusBadge tone={appointment.status}>{appointment.status}</StatusBadge>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="rounded-md border border-sky-200 px-2 py-1 text-[11px] font-semibold text-sky-700"
                      >
                        {appointment.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-3 py-3 text-center text-[11px] font-semibold text-sky-600">
            View all upcoming appointments
          </p>
        </section>

        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-xl border border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Health Snapshot</h3>
              <span className="text-[10px] text-slate-400">Last updated Oct 10, 2023</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <SummaryMetric label="Blood Pressure" value="120/80" />
              <SummaryMetric label="Heart Rate" value="72 bpm" />
              <SummaryMetric label="Weight" value="74 kg" />
              <SummaryMetric label="Glucose" value="95 mg/dL" />
            </div>
          </section>
          <section className="rounded-xl bg-sky-500 p-4 text-white">
            <h3 className="text-lg font-semibold">Need a check-up?</h3>
            <p className="mt-2 text-xs text-sky-100">
              Connect with a specialist in less than 24 hours and book your next
              consultation today.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-sky-700"
            >
              Schedule Now
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function SelectDoctorScreen() {
  const doctors = [
    ["Dr. Sarah Jenkins", "Cardiology Specialist", "4.9 (128 reviews)"],
    ["Dr. Marcus Chen", "General Physician", "4.8 (96 reviews)"],
    ["Dr. Emily Watson", "Dermatology", "5.0 (23 reviews)"],
    ["Dr. Robert Fox", "Pediatrician", "4.7 (64 reviews)"],
    ["Dr. Lisa Park", "Pediatrics", "4.8 (75 reviews)"],
    ["Dr. James Wilson", "Neurology", "4.8 (154 reviews)"],
  ];

  return (
    <AppShell
      navItems={patientNav}
      activeItem="Appointments"
      userName="Jane Cooper"
      userRole="Premium Member"
      className="min-h-[720px]"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Find your Specialist</h2>
            <p className="text-xs text-slate-500">Select a doctor to begin your booking process.</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            Advanced
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-9 min-w-[180px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Search by name
          </div>
          {["All Doctors", "Cardiology", "General Practice", "Dermatology", "Psychiatry"].map(
            (tag, index) => (
              <span
                key={tag}
                className={cx(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  index === 0 ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600",
                )}
              >
                {tag}
              </span>
            ),
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map(([name, specialty, rating]) => (
            <article key={name} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{name}</p>
                  <p className="text-xs text-sky-600">{specialty}</p>
                  <p className="text-[10px] text-slate-400">{rating}</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Board certified physician with experience in teleconsultation.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">$40/session</span>
                <button
                  type="button"
                  className="rounded-md bg-sky-500 px-3 py-1 text-xs font-semibold text-white"
                >
                  Select
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-1 text-center">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600"
          >
            Load More Doctors
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function ScheduleAppointmentScreen() {
  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoon = ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"];

  return (
    <WorkspaceCard className="mx-auto max-w-[1150px]">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <TelemedMark compact />
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-8 w-8 rounded-full bg-orange-100" />
        </div>
      </header>

      <div className="space-y-5 p-5 sm:p-6">
        <Stepper steps={["Select Doctor", "Select Time", "Confirmation"]} currentStep={2} />

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-emerald-100" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Dr. James Wilson</p>
                <p className="text-[11px] text-slate-500">Cardiology · 12 years exp</p>
              </div>
            </div>
            <p className="text-xs font-medium text-sky-600">Monday, Oct 12, 2023 at 10:30 AM</p>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_1.2fr]">
          <CalendarGrid />

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Available Slots</h3>
                <p className="text-[11px] text-slate-400">Monday, October 12</p>
              </div>
              <span className="text-[10px] text-slate-400">Timezone: EAT (UTC+3)</span>
            </div>

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Morning sessions
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={cx(
                    "rounded-md border px-2 py-2 text-xs font-medium",
                    slot === "10:30 AM"
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-500",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Afternoon sessions
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {afternoon.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-2 text-xs font-medium text-slate-500"
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-md bg-sky-500 px-5 py-2 text-xs font-semibold text-white"
              >
                Continue to Confirmation
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-200 px-5 py-3 text-center text-[11px] text-slate-400">
        Terms of Service · Privacy Policy · Support
      </footer>
    </WorkspaceCard>
  );
}

function BookingConfirmationScreen() {
  return (
    <WorkspaceCard className="mx-auto max-w-[1100px]">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <TelemedMark compact />
        <span className="h-8 w-8 rounded-full bg-amber-100" />
      </header>

      <div className="space-y-5 p-5 sm:p-6">
        <Stepper steps={["Select Doctor", "Choose Time", "Confirm Booking"]} currentStep={3} />

        <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-center text-2xl font-semibold text-slate-800">
            Review &amp; Confirm Appointment
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Please check the details below before proceeding.
          </p>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-full bg-teal-100" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Dr. Sarah Jenkins</p>
                <p className="text-[11px] text-sky-600">General Practitioner</p>
                <p className="text-[10px] text-slate-400">4.9 (128 reviews) · St. Mary Clinic</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Date &amp; Time</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">Monday, Oct 24th</p>
              <p className="text-[11px] text-slate-500">10:30 AM - 11:00 AM</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Type</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">Video Consultation</p>
              <p className="text-[11px] text-slate-500">Telemed secure link</p>
            </div>
          </div>

          <div className="mt-4 h-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
            Reason for visit (optional): Please describe any symptoms or specific concerns.
          </div>

          <p className="mt-4 rounded-lg bg-sky-50 p-2 text-[11px] text-sky-700">
            A secure reminder link will be sent to your email and phone 15 minutes
            before your appointment.
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Confirm Booking
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">Cancel and go back</p>
        </section>
      </div>
    </WorkspaceCard>
  );
}

function DoctorDashboardScreen() {
  const todayAppointments = [
    ["John Doe", "09:00 AM", "approved"],
    ["Sarah Connor", "10:30 AM", "pending"],
    ["Mike Peterson", "11:15 AM", "approved"],
    ["Emily Blunt", "01:45 PM", "pending"],
  ];

  return (
    <AppShell
      navItems={doctorNav}
      activeItem="Dashboard"
      userName="Dr. Smith"
      userRole="Cardiologist"
      className="min-h-[730px]"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Hello, Dr. Smith!</h2>
            <p className="text-xs text-slate-500">You have 12 appointments scheduled for today.</p>
          </div>
          <span className="text-xs font-medium text-slate-500">Monday, Oct 23</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric label="Appointments Today" value="12" note="+12%" />
          <SummaryMetric label="Pending Requests" value="4" note="4 New" />
          <SummaryMetric label="Total Patients" value="1,240" note="Total" />
          <SummaryMetric label="Weekly Earnings" value="$4,250" note="+5%" />
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="flex items-center justify-between border-b border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-700">Today&apos;s Appointments</h3>
            <div className="flex gap-2 text-xs">
              <button type="button" className="rounded-md bg-sky-50 px-3 py-1.5 font-medium text-sky-700">
                View All
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-600"
              >
                Filter
              </button>
            </div>
          </header>
          <div className="space-y-2 p-3">
            {todayAppointments.map(([patient, time, status]) => (
              <div
                key={patient}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-2"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-700">{patient}</p>
                  <p className="text-[11px] text-slate-500">Follow-up consultation</p>
                </div>
                <p className="text-xs text-slate-500">{time}</p>
                <StatusBadge tone={status}>{status}</StatusBadge>
                <div className="flex gap-2">
                  {status === "approved" ? (
                    <button
                      type="button"
                      className="rounded-md bg-sky-500 px-3 py-1 text-[11px] font-semibold text-white"
                    >
                      Start Consultation
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="rounded-md bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-[1.9fr_1fr]">
          <section className="rounded-xl border border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Patient Traffic</h3>
              <span className="text-[10px] text-slate-400">Last 7 Days</span>
            </div>
            <div className="h-36 rounded-lg bg-gradient-to-t from-sky-100 via-white to-slate-100" />
          </section>
          <section className="rounded-xl bg-sky-500 p-4 text-white">
            <h3 className="text-lg font-semibold">Telemed Premium</h3>
            <p className="mt-2 text-xs text-sky-100">
              Upgrade to priority scheduling and enhanced patient management tools.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-sky-700"
            >
              Upgrade Plan
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function DoctorScheduleManagementScreen() {
  const rows = [
    ["Monday", "09:00 AM", "05:00 PM", "12", false],
    ["Tuesday", "09:00 AM", "05:00 PM", "12", true],
    ["Wednesday", "08:00 AM", "12:00 PM", "6", true],
    ["Thursday", "09:00 AM", "05:00 PM", "12", true],
    ["Friday", "09:00 AM", "03:00 PM", "10", true],
    ["Saturday", "--", "--", "0", true],
    ["Sunday", "--", "--", "0", true],
  ];

  return (
    <AppShell
      navItems={doctorNav}
      activeItem="Schedule"
      userName="Dr. Julian Thorne"
      userRole="Cardiologist"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Schedule Management</h2>
            <p className="text-xs text-slate-500">
              Configure your weekly availability and patient capacity.
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            Accepting New Patients
          </span>
        </div>

        <section className="rounded-xl border border-slate-200">
          <div className="grid grid-cols-[1.2fr_1.6fr_1fr_1fr] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Day of Week</span>
            <span>Operating Hours</span>
            <span>Max Patients</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map(([day, from, to, maxPatients, active]) => (
              <div key={day} className="grid grid-cols-[1.2fr_1.6fr_1fr_1fr] items-center gap-2 px-3 py-3 text-xs">
                <span className="font-semibold text-slate-700">{day}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
                    {from}
                  </span>
                  <span className="text-slate-300">to</span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
                    {to}
                  </span>
                </div>
                <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                  {maxPatients}
                </span>
                <span className="text-[11px] text-sky-600">{active ? "Unavailable" : "Copy to All"}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Total Weekly Hours</p>
                <p className="font-semibold text-slate-700">38 Hours</p>
              </div>
              <div>
                <p className="text-slate-400">Weekly Capacity</p>
                <p className="font-semibold text-slate-700">52 Patients</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                Preview Public Profile
              </button>
              <button
                type="button"
                className="rounded-md bg-sky-500 px-3 py-2 text-xs font-semibold text-white"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs text-sky-700">
          <p className="font-semibold">Schedule Best Practices</p>
          <p className="mt-1">
            Update your schedule in advance if you have a holiday or conference so
            existing bookings can be rescheduled.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function DoctorPatientListScreen() {
  const patients = [
    ["Sarah Jenkins", "Oct 12, 2023", "Chronic hypertension with mild symptoms", "+1 (555) 234-8901"],
    ["Michael Chen", "Sep 28, 2023", "Post-operative follow-up and recovery process", "+1 (555) 890-4432"],
    ["Elena Alvarez", "Sep 15, 2023", "Allergic rhinitis and seasonal congestion", "+1 (555) 321-7788"],
    ["Robert Wilson", "Aug 30, 2023", "Type 2 diabetes monitoring and blood sugar logs", "+1 (555) 443-0092"],
    ["Maya Thompson", "Aug 22, 2023", "Annual physical exam with stable vitals", "+1 (555) 776-3310"],
  ];

  return (
    <AppShell
      navItems={doctorNav}
      activeItem="Patients"
      userName="Dr. Julian Vance"
      userRole="Cardiologist"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="h-10 min-w-[300px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Search patients by name or ID
          </div>
          <button
            type="button"
            className="rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
          >
            + New Patient
          </button>
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="border-b border-slate-200 p-3">
            <h2 className="text-xl font-semibold text-slate-800">Patient List</h2>
            <p className="text-xs text-slate-500">Manage and view your 124 assigned patients.</p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Patient Name</th>
                  <th className="px-3 py-2">Last Appointment</th>
                  <th className="px-3 py-2">Last Diagnosis Snippet</th>
                  <th className="px-3 py-2">Contact Info</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(([name, date, diagnosis, contact]) => (
                  <tr key={name} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-700">{name}</td>
                    <td className="px-3 py-3 text-slate-500">{date}</td>
                    <td className="px-3 py-3 text-slate-500">{diagnosis}</td>
                    <td className="px-3 py-3 text-slate-500">{contact}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="rounded-md bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Patient Trends</p>
            <p className="mt-1 text-xs text-slate-500">
              Analyze demographics and condition patterns across your roster.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Upload Results</p>
            <p className="mt-1 text-xs text-slate-500">
              Bulk upload test reports and diagnostic images to patient files.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Broadcast Notice</p>
            <p className="mt-1 text-xs text-slate-500">
              Send an update to all your patients regarding office hours.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ConsultationHistoryScreen() {
  const consultations = [
    ["Dr. Sarah Jenkins", "Oct 24, 2023 at 10:30 AM", "Diagnosis: Mild hypertension follow-up", "completed"],
    ["Dr. Marcus Thorne", "Sep 28, 2023 at 03:45 PM", "Diagnosis: Seasonal allergies and sinusitis", "completed"],
    ["Dr. Elena Rodriguez", "Aug 6, 2023 at 09:00 AM", "Nutrition consultation for cholesterol management", "cancelled"],
  ];

  return (
    <AppShell
      navItems={consultationNav}
      activeItem="History"
      userName="Alex Rivera"
      userRole="Patient"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Consultation History</h2>
            <p className="text-xs text-slate-500">Review all previous doctor consultations.</p>
          </div>
          <div className="h-9 min-w-[220px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Search doctor or diagnosis
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryMetric label="Total Consultations" value="24" note="+2 this year" />
          <SummaryMetric label="Recent Check-ups" value="3" note="Last Month" />
          <SummaryMetric label="Average Doctor Rating" value="4.9 / 5.0" />
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="flex items-center justify-between border-b border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-700">Past Appointments</h3>
            <span className="text-[11px] text-slate-400">Showing 1-3 of 24 results</span>
          </header>
          <div className="space-y-2 p-3">
            {consultations.map(([doctor, when, details, status]) => (
              <article
                key={doctor}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-700">{doctor}</p>
                  <p className="text-[11px] text-slate-500">{when}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{details}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={status}>{status}</StatusBadge>
                  <button
                    type="button"
                    className="rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    View Full Report
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-center gap-2 border-t border-slate-100 p-3">
            {[1, 2, 3, 4].map((page) => (
              <span
                key={page}
                className={cx(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md text-xs",
                  page === 1 ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600",
                )}
              >
                {page}
              </span>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function PatientProfileSettingsScreen() {
  return (
    <AppShell
      navItems={patientNav}
      activeItem="Settings"
      userName="James Wilson"
      userRole="Patient #9001"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-800">Profile Settings</h2>
          <StatusBadge tone="info">Setting Saved</StatusBadge>
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="border-b border-slate-200 p-3">
            <h3 className="text-lg font-semibold text-slate-700">Account Settings</h3>
            <p className="text-xs text-slate-500">
              Manage your personal information, security, and account preferences.
            </p>
          </header>
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="h-16 w-16 rounded-full bg-slate-200" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Profile Picture</p>
                <p className="text-[11px] text-slate-500">JPG, GIF or PNG. Max size 800K.</p>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  Upload New
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                Personal Information
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <AuthInput label="Full Name" value="James Wilson" />
                <AuthInput label="Email Address" value="james.wilson@example.com" />
                <AuthInput label="Phone Number" value="+1 (555) 123-4567" />
                <AuthInput label="Date of Birth" value="May 14, 1986" />
              </div>
              <AuthInput label="Residential Address" value="123 HealthCare Way, Apt 4B, San Francisco, CA 94103" />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                Security &amp; Password
              </h4>
              <AuthInput label="Current Password" value="************" />
              <div className="grid gap-3 sm:grid-cols-2">
                <AuthInput label="New Password" value="Min. 8 characters" />
                <AuthInput label="Confirm New Password" value="Re-type new password" />
              </div>
              <p className="rounded-lg bg-sky-50 p-3 text-[11px] text-sky-700">
                Two-Factor Authentication (2FA) is currently disabled. Enable it now
                for an extra layer of account security.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-between gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className="rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
          >
            Save Changes
          </button>
        </div>

        <section className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-700">Delete Account</p>
          <p className="mt-1 text-xs text-rose-600">
            Once you delete your account, there is no going back.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function MedicalRecordsUploadScreen() {
  const files = [
    ["Annual_Checkup_Results.pdf", "LAB REPORT", "Oct 24, 2023", "2.4 MB"],
    ["Chest_XRay_Side.png", "IMAGE", "Oct 18, 2023", "12.8 MB"],
    ["Prescription_Lipitor.pdf", "PRESCRIPTION", "Sep 10, 2023", "0.4 MB"],
  ];

  return (
    <AppShell
      navItems={patientNav}
      activeItem="Medical Records"
      userName="Alex Thompson"
      userRole="Patient #8821"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Medical Records</h2>
            <p className="text-xs text-slate-500">
              Manage and access your healthcare documentation securely.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
          >
            + New Record
          </button>
        </div>

        <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            +
          </span>
          <p className="text-sm font-semibold text-slate-700">Upload Medical Documents</p>
          <p className="mt-1 text-xs text-slate-500">
            Drag and drop your lab results, prescriptions, or x-rays here.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              className="rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Select Files
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              From Cloud
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200">
          <header className="flex items-center justify-between border-b border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-700">Recently Uploaded</h3>
            <span className="text-xs text-slate-400">3 files</span>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Document Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Date Added</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(([fileName, type, date, size]) => (
                  <tr key={fileName} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-700">{fileName}</td>
                    <td className="px-3 py-3 text-slate-500">{type}</td>
                    <td className="px-3 py-3 text-slate-500">{date}</td>
                    <td className="px-3 py-3 text-slate-500">{size}</td>
                    <td className="px-3 py-3 text-sky-600">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-3 md:grid-cols-3">
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Share with Doctor</p>
            <p className="mt-1 text-xs text-slate-500">
              Grant temporary access to records for specialist review.
            </p>
          </section>
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Pending Review</p>
            <p className="mt-1 text-xs text-slate-500">
              Your latest blood work report is waiting to be checked.
            </p>
          </section>
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Data Privacy</p>
            <p className="mt-1 text-xs text-slate-500">
              All records are encrypted and accessible only to your care team.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function PrescriptionsScreen() {
  const meds = [
    ["Amoxicillin", "500 mg", "Twice daily, with meal", "Dr. Sarah Smith", "ready for pickup"],
    ["Lisinopril", "10 mg", "Once daily, morning", "Dr. James Wilson", "processing"],
    ["Metformin", "850 mg", "Twice daily", "Dr. Sarah Smith", "out of refills"],
  ];

  return (
    <AppShell
      navItems={prescribeNav}
      activeItem="Prescriptions"
      userName="Alex Johnson"
      userRole="Patient ID #8923"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-9 min-w-[260px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Search medication, doctor, or pharmacy
          </div>
          <div className="flex rounded-md bg-slate-100 p-1 text-xs">
            <span className="rounded-md bg-sky-500 px-3 py-1 font-semibold text-white">Active</span>
            <span className="px-3 py-1 text-slate-600">History</span>
          </div>
        </div>

        <section className="rounded-xl border border-slate-200">
          <header className="border-b border-slate-200 p-3">
            <h2 className="text-2xl font-semibold text-slate-800">Prescriptions</h2>
            <p className="text-xs text-slate-500">Manage your active medications and refill history.</p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Medication</th>
                  <th className="px-3 py-2">Dosage</th>
                  <th className="px-3 py-2">Frequency</th>
                  <th className="px-3 py-2">Doctor</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {meds.map(([medication, dosage, frequency, doctor, status]) => (
                  <tr key={medication} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-700">{medication}</td>
                    <td className="px-3 py-3 text-slate-500">{dosage}</td>
                    <td className="px-3 py-3 text-slate-500">{frequency}</td>
                    <td className="px-3 py-3 text-slate-500">{doctor}</td>
                    <td className="px-3 py-3">
                      <StatusBadge tone={status === "processing" ? "pending" : status === "out of refills" ? "cancelled" : "confirmed"}>
                        {status}
                      </StatusBadge>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className={cx(
                          "rounded-md px-3 py-1 text-[11px] font-semibold",
                          status === "out of refills"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-sky-500 text-white",
                        )}
                      >
                        {status === "out of refills" ? "Contact Doctor" : "Request Refill"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-3 md:grid-cols-3">
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Preferred Pharmacy</p>
            <p className="mt-1 text-xs text-slate-500">CVS Pharmacy - 125 Health Ave, Metropolis</p>
            <button type="button" className="mt-3 text-xs font-semibold text-sky-600">
              Change Pharmacy
            </button>
          </section>
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Medication Safety</p>
            <p className="mt-1 text-xs text-slate-500">
              Check for drug interactions or reminders about side effects.
            </p>
          </section>
          <section className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">Refill Reminder</p>
            <p className="mt-1 text-xs text-slate-500">
              Enable notifications to never miss a refill window.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function AddConsultationNotesModalScreen() {
  return (
    <WorkspaceCard className="mx-auto max-w-[980px] bg-slate-300/40 p-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-semibold text-slate-800">Add Consultation Notes</h2>
          <button type="button" className="text-slate-400">x</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
          <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-600">Patient: Jonathan Doe</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">October 24, 2023</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <AuthInput label="Age" value="Male, 34 years" />
          <AuthInput label="Blood Type" value="O Positive" />
          <AuthInput label="Last Visit" value="Sept 18, 2023" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-600">Diagnosis</p>
            <div className="h-16 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
              Enter the primary diagnosis and ICD-10 codes if applicable.
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-600">Clinical Notes</p>
            <div className="h-36 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
              Detailed symptoms, observations, vitals, and recommended treatment plan.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
            >
              Add Prescription
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
            >
              Order Lab Tests
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
            >
              Follow-up Visit
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              Save Consultation
            </button>
          </div>
        </div>
      </div>
    </WorkspaceCard>
  );
}

function ConsultationDetailsModalScreen() {
  return (
    <WorkspaceCard className="mx-auto max-w-[980px] bg-slate-300/40 p-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Consultation Details</p>
            <p className="text-[11px] text-slate-400">Reference #CD-9082</p>
          </div>
          <button type="button" className="text-slate-400">x</button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Attending Doctor</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">Dr. Jonathan Sterling</p>
            <p className="text-[11px] text-slate-500">Senior Cardiologist</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Patient</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">Sarah Jenkins</p>
            <p className="text-[11px] text-slate-500">ID: P-10293</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>October 24, 2023 · 10:30 AM - 11:00 AM · Video Call</p>
          <StatusBadge tone="confirmed">completed</StatusBadge>
        </div>

        <section className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3">
          <p className="text-xs font-semibold text-slate-700">Diagnosis</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">Acute Rhinosinusitis</p>
          <p className="text-[11px] text-slate-500">ICD-10 code: J01.90</p>
        </section>

        <section className="mt-4 rounded-lg border border-slate-200 p-3">
          <p className="text-xs font-semibold text-slate-700">Doctor&apos;s Clinical Notes</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Patient presented with persistent nasal congestion, facial pressure, and
            mild cough for 10 days. Symptoms worsened over the last 48 hours. Physical
            findings include tenderness over maxillary sinuses. Recommended treatment:
            Amoxicillin-clavulanate 875/125 mg twice daily for 7 days, saline nasal
            irrigation twice daily, and increased hydration.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Follow-up advised in 72 hours if symptoms do not improve.
          </p>
        </section>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
          >
            Download PDF
          </button>
          <button
            type="button"
            className="rounded-md bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </WorkspaceCard>
  );
}

export const telemedScreens = [
  {
    id: "patient-signup",
    title: "Referred Sign Up Page (Patient)",
    category: "Onboarding",
    description: "Patient onboarding with role switch, personal info, and account creation.",
    component: PatientSignupScreen,
  },
  {
    id: "doctor-signup",
    title: "Referred Doctor Registration Page",
    category: "Onboarding",
    description: "Doctor registration with credentials, specialty, and verification notice.",
    component: DoctorSignupScreen,
  },
  {
    id: "patient-dashboard",
    title: "Telemed Patient Dashboard",
    category: "Patient Journey",
    description: "Patient summary dashboard with appointments, messages, and health snapshot.",
    component: PatientDashboardScreen,
  },
  {
    id: "select-doctor",
    title: "Telemed Select Doctor Page",
    category: "Patient Journey",
    description: "Doctor discovery view with filters, specialties, and doctor cards.",
    component: SelectDoctorScreen,
  },
  {
    id: "schedule-appointment",
    title: "Telemed Schedule Appointment Page",
    category: "Patient Journey",
    description: "Step 2 scheduling flow with date picker and available slots.",
    component: ScheduleAppointmentScreen,
  },
  {
    id: "booking-confirmation",
    title: "Telemed Booking Confirmation Page",
    category: "Patient Journey",
    description: "Final confirmation step for selected doctor, date, and consultation type.",
    component: BookingConfirmationScreen,
  },
  {
    id: "doctor-dashboard",
    title: "Telemed Doctor Dashboard Overview",
    category: "Doctor Journey",
    description: "Doctor overview with metrics, appointment actions, and patient traffic.",
    component: DoctorDashboardScreen,
  },
  {
    id: "doctor-schedule",
    title: "Telemed Doctor Schedule Management",
    category: "Doctor Journey",
    description: "Weekly availability and capacity controls for doctor scheduling.",
    component: DoctorScheduleManagementScreen,
  },
  {
    id: "doctor-patient-list",
    title: "Telemed Doctor Patient List",
    category: "Doctor Journey",
    description: "Doctor-facing patient management table with quick actions.",
    component: DoctorPatientListScreen,
  },
  {
    id: "consultation-history",
    title: "Telemed Consultation History Page",
    category: "Patient Journey",
    description: "Historical consultations list with status and full report actions.",
    component: ConsultationHistoryScreen,
  },
  {
    id: "patient-settings",
    title: "Telemed Patient Profile Settings",
    category: "Patient Journey",
    description: "Patient account settings, security preferences, and profile updates.",
    component: PatientProfileSettingsScreen,
  },
  {
    id: "medical-records",
    title: "Telemed Medical Records Upload",
    category: "Patient Journey",
    description: "Secure upload and management view for patient medical documents.",
    component: MedicalRecordsUploadScreen,
  },
  {
    id: "prescriptions",
    title: "Telemed Prescriptions Page",
    category: "Patient Journey",
    description: "Medication list with refill actions, status tracking, and pharmacy details.",
    component: PrescriptionsScreen,
  },
  {
    id: "add-consultation-notes-modal",
    title: "Telemed Add Consultation Notes Modal",
    category: "Doctor Journey",
    description: "Doctor modal form for diagnosis, clinical notes, and follow-up actions.",
    component: AddConsultationNotesModalScreen,
  },
  {
    id: "consultation-details-modal",
    title: "Telemed Consultation Details Modal",
    category: "Doctor Journey",
    description: "Consultation detail modal showing diagnosis and clinical notes summary.",
    component: ConsultationDetailsModalScreen,
  },
];

export const telemedScreenCount = telemedScreens.length;
