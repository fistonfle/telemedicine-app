import { useState } from "react";

const MOCK_PATIENTS = [
  {
    id: "AP-2034",
    name: "Alex Johnson",
    lastAppointment: "Oct 12, 2023",
    lastDiagnosis: "Chronic Hypertension and slight heart rhythm irregularity.",
    phone: "+1 555-0123",
    email: "alex.j@email.com",
  },
  {
    id: "AP-2035",
    name: "Maria Garcia",
    lastAppointment: "Oct 10, 2023",
    lastDiagnosis: "Seasonal allergies - prescribed antihistamines.",
    phone: "+1 555-0124",
    email: "maria.g@email.com",
  },
  {
    id: "AP-2036",
    name: "James Wilson",
    lastAppointment: "Oct 8, 2023",
    lastDiagnosis: "Lower back pain - physical therapy recommended.",
    phone: "+1 555-0125",
    email: "james.w@email.com",
  },
  {
    id: "AP-2037",
    name: "Sarah Chen",
    lastAppointment: "Oct 5, 2023",
    lastDiagnosis: "Routine checkup - vitals within normal range.",
    phone: "+1 555-0126",
    email: "sarah.c@email.com",
  },
];

function DoctorPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Patient List</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <span className="material-icons text-lg">add</span>
            New Patient
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-100">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Appointment
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Diagnosis Snippet
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{patient.name}</p>
                        <p className="text-xs text-slate-500">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{patient.lastAppointment}</td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                    {patient.lastDiagnosis}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-600">
                      <p>{patient.phone}</p>
                      <p className="text-slate-500">{patient.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                      View Medical History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1-4 of 4 patients</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50">
              <span className="material-icons text-slate-600">chevron_left</span>
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </span>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
              2
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100">
              <span className="material-icons text-slate-600">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "trending_up",
            title: "Patient Trends",
            description:
              "Analyze demographic trends and drill on patterns across your roster.",
          },
          {
            icon: "cloud_upload",
            title: "Upload Results",
            description:
              "Bulk upload lab results and scan diagnostic images to patient files.",
          },
          {
            icon: "campaign",
            title: "Broadcast Notice",
            description:
              "Send an update to all your patients regarding office hours.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-icons text-primary text-xl">{card.icon}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorPatients;
