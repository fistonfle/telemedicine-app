import { useState } from "react";

const SPECIALTIES = [
  { id: "all", label: "All" },
  { id: "general practice", label: "General Practice" },
  { id: "cardiology", label: "Cardiology" },
  { id: "dermatology", label: "Dermatology" },
  { id: "psychiatry", label: "Psychiatry" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "neurology", label: "Neurology" },
  { id: "general surgery", label: "General Surgery" },
  { id: "orthopedic surgery", label: "Orthopedic Surgery" },
];

function SelectDoctor({ doctors, loading, onSelect, specialtyFilter, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = (doctors ?? []).filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialty && doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty =
      specialtyFilter === "all" ||
      (doc.specialty && doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Find your Specialist
        </h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
          Browse available doctors and select one to book a consultation
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          search
        </span>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow shadow-sm"
          aria-label="Search doctors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        )}
      </div>

      {/* Specialty Filters */}
      <div className="mb-8">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Specialty
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 min-w-0">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onFilterChange(spec.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                specialtyFilter === spec.id
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {loading ? (
            "Loading..."
          ) : (
            <>
              <span className="font-medium text-slate-700">{filteredDoctors.length}</span>
              {" "}doctor{filteredDoctors.length !== 1 ? "s" : ""} available
            </>
          )}
        </p>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-10 bg-slate-100 rounded w-24 mt-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 px-6 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="material-icons text-5xl text-slate-300 mb-4">person_search</span>
          <h3 className="font-semibold text-slate-700 mb-1">No doctors found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search or filter to find the right specialist for you.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              onFilterChange("all");
            }}
            className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDoctors.map((doctor) => (
            <article
              key={doctor.id}
              className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
              onClick={() => onSelect(doctor)}
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shrink-0 ring-2 ring-white shadow-sm group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                  {doctor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {doctor.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mt-0.5">
                    {doctor.specialty}
                  </p>
                  {(doctor.rating != null || doctor.reviews != null) && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="material-icons text-amber-400 text-lg">star</span>
                      <span className="text-sm font-medium text-slate-600">
                        {doctor.rating ?? "—"}
                        {doctor.reviews != null && (
                          <span className="text-slate-400 font-normal">
                            {" "}({doctor.reviews} reviews)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {doctor.description && (
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {doctor.description}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(doctor);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all text-sm"
                  >
                    Select
                    <span className="material-icons text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && filteredDoctors.length > 0 && filteredDoctors.length >= 4 && (
        <p className="text-center text-slate-400 text-sm mt-8">
          Showing all available doctors. Need help?{" "}
          <a href="#" className="text-primary hover:underline">Contact support</a>
        </p>
      )}
    </div>
  );
}

export default SelectDoctor;
