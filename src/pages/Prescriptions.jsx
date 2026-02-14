import { useState } from "react";
import Badge from "../components/Badge";

const MOCK_PRESCRIPTIONS = [
  {
    id: 1,
    medication: "Amoxicillin",
    expires: "10 Jan 2024",
    dosage: "500 mg",
    frequency: "Twice daily, with food",
    doctor: "Dr. Sarah Smith",
    status: "ready-for-refill",
    action: "refill",
  },
  {
    id: 2,
    medication: "Lisinopril",
    expires: "10 Jan 2024",
    dosage: "10 mg",
    frequency: "Once daily, morning",
    doctor: "Dr. James Wilson",
    status: "processing",
    action: "refill",
  },
  {
    id: 3,
    medication: "Metformin",
    expires: "2024",
    dosage: "850 mg",
    frequency: "Twice daily",
    doctor: "Dr. Sarah Smith",
    status: "unavailable",
    action: "contact",
  },
];

function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search medications, doctors, or prescriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-lg hover:bg-slate-100">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-100">
            <span className="material-icons text-slate-600">schedule</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prescriptions</h1>
          <p className="text-slate-500 mt-1">
            Manage your active medications and refill history.
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Doctor
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
              {MOCK_PRESCRIPTIONS.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-icons text-primary">
                          medication
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{rx.medication}</p>
                        <p className="text-xs text-slate-500">Expires {rx.expires}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {rx.dosage}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{rx.frequency}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {rx.doctor
                          .replace("Dr. ", "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-slate-600">{rx.doctor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={rx.status}>
                      {rx.status === "ready-for-refill"
                        ? "Ready for Refill"
                        : rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {rx.action === "refill" ? (
                      <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                        Request Refill
                      </button>
                    ) : (
                      <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                        Contact Doctor
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "local_pharmacy",
            title: "Preferred Pharmacy",
            content: "CVS Pharmacy - 123 Health Ave, Metro City",
            action: "Change Pharmacy",
          },
          {
            icon: "health_and_safety",
            title: "Medication Safety",
            content:
              "Check for drug interactions and learn more about side effects.",
            action: "Learn More",
          },
          {
            icon: "notifications",
            title: "Refill Reminders",
            content:
              "Enable notifications to receive timely refill reminders.",
            action: "Enable Now",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-icons text-primary">{card.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{card.content}</p>
                <button className="text-primary font-medium hover:underline text-sm">
                  {card.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prescriptions;
