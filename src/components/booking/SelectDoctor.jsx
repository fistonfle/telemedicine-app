import { useState } from "react";

const SPECIALTIES = [
  "All Doctors",
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Psychiatry",
  "Pediatrics",
  "Neurology",
  "General Surgery",
  "Orthopedic Surgery",
];

function SelectDoctor({ doctors, loading, onSelect, specialtyFilter, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = (doctors ?? []).filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "all" ||
      doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Find your Specialist</h1>
        <p className="text-slate-500 mt-1">
          Select a doctor to begin your booking process
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() =>
                onFilterChange(spec === "All Doctors" ? "all" : spec.toLowerCase())
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (specialtyFilter === "all" && spec === "All Doctors") ||
                (specialtyFilter !== "all" &&
                  spec.toLowerCase() === specialtyFilter.toLowerCase())
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {spec}
            </button>
          ))}
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
            Advanced
          </button>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {doctor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
                <p className="text-slate-500 text-sm">{doctor.specialty}</p>
                {(doctor.rating || doctor.reviews) && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="material-icons text-amber-400 text-lg">star</span>
                    <span className="font-medium text-slate-700">
                      {doctor.rating ?? "—"} ({doctor.reviews ?? 0} reviews)
                    </span>
                  </div>
                )}
                {doctor.description && (
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                    {doctor.description}
                  </p>
                )}
                {doctor.nextSession && (
                  <p className="text-primary text-sm font-medium mt-2">
                    Next Session: {doctor.nextSession}
                  </p>
                )}
                <button
                  onClick={() => onSelect(doctor)}
                  className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
          Load More Doctors
        </button>
      </div>
    </div>
  );
}

export default SelectDoctor;
