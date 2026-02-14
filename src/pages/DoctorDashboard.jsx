import Badge from "../components/Badge";

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patient: "Alex Johnson",
    description: "Follow up chat",
    time: "09:00 AM",
    status: "approved",
  },
  {
    id: 2,
    patient: "Maria Garcia",
    description: "First Consultation",
    time: "10:30 AM",
    status: "pending",
  },
  {
    id: 3,
    patient: "James Wilson",
    description: "Annual checkup",
    time: "02:00 PM",
    status: "approved",
  },
  {
    id: 4,
    patient: "Sarah Chen",
    description: "Follow up",
    time: "03:30 PM",
    status: "pending",
  },
];

const TRAFFIC_DATA = [
  { day: "Mon", patients: 18 },
  { day: "Tue", patients: 22 },
  { day: "Wed", patients: 25 },
  { day: "Thu", patients: 20 },
  { day: "Fri", patients: 28 },
  { day: "Sat", patients: 12 },
  { day: "Sun", patients: 8 },
];

function DoctorDashboard() {
  const maxPatients = Math.max(...TRAFFIC_DATA.map((d) => d.patients));

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello, Dr. Smith!</h1>
          <p className="text-slate-500 mt-1">
            You have 10 appointments scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            DS
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: "event_available",
            label: "Appointments Today",
            value: "12",
            change: "+10%",
            changeColor: "text-emerald-600",
          },
          {
            icon: "notifications",
            label: "Pending Requests",
            value: "4",
            change: "+new",
            changeColor: "text-amber-600",
          },
          {
            icon: "people",
            label: "Total Patients",
            value: "1,240",
            change: "+2%",
            changeColor: "text-emerald-600",
          },
          {
            icon: "payments",
            label: "Weekly Earnings",
            value: "$4,250",
            change: "+5%",
            changeColor: "text-emerald-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className={`text-xs font-medium mt-1 ${stat.changeColor}`}>
                  {stat.change}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-primary">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Today's Appointments</h2>
            <div className="flex gap-2">
              <button className="text-sm text-primary font-medium hover:underline">
                View All
              </button>
              <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <span className="material-icons text-lg">filter_list</span>
                Filter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Appointment Time
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_APPOINTMENTS.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {apt.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{apt.patient}</p>
                          <p className="text-xs text-slate-500">{apt.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {apt.time}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={apt.status}>{apt.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {apt.status === "approved" ? (
                        <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                          Start Consultation
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Traffic Chart */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Patient Traffic</h2>
            <button className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              Last 7 Days
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="h-48 flex items-end gap-2">
              {TRAFFIC_DATA.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/30 rounded-t transition-all hover:bg-primary/50"
                    style={{
                      height: `${(d.patients / maxPatients) * 100}%`,
                      minHeight: "20px",
                    }}
                  />
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-primary rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Telemed Premium</h3>
            <p className="text-primary-100 text-sm mb-4 opacity-90">
              Upgrade your plan to unlock AI powered patient notes and group
              consultations.
            </p>
            <button className="w-full py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
