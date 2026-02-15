import { useState, useEffect } from "react";
import { getDoctorPatients } from "../api/services";

function DoctorPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getDoctorPatients(searchQuery)
      .then(setPatients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  if (loading && !patients.length) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading patients</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const filteredPatients = patients;

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing {filteredPatients.length} patients</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;
