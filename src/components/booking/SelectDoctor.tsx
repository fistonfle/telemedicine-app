import { useState, ChangeEvent } from "react";
import type { Doctor } from "../../types";

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

interface SelectDoctorProps {
  doctors: Doctor[];
  loading: boolean;
  onSelect: (doctor: Doctor) => void;
  specialtyFilter: string;
  onFilterChange: (value: string) => void;
}

function SelectDoctor({ doctors, loading, onSelect, specialtyFilter, onFilterChange }: SelectDoctorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = (doctors ?? []).filter((doc: Doctor) => {
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
    <div>
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Find your Specialist</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Browse available doctors and select one to book a consultation
        </p>
      </header>

      {/* Search + Specialty in one row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            aria-label="Search doctors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <span className="material-icons text-lg">close</span>
            </button>
          )}
        </div>
        <div className="sm:w-48">
          <select
            value={specialtyFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        {loading ? "Loading..." : (
          <><span className="font-medium text-slate-700">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? "s" : ""} available</>
        )}
      </p>

      {/* Doctor List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 animate-pulse flex gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12 px-6 bg-slate-50 rounded-lg border border-slate-200">
          <span className="material-icons text-4xl text-slate-300 mb-3">person_search</span>
          <p className="font-medium text-slate-700">No doctors found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or specialty filter.</p>
          <button
            onClick={() => { setSearchQuery(""); onFilterChange("all"); }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDoctors.map((doctor: Doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onSelect(doctor)}
              className="w-full text-left flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                {doctor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{doctor.name}</p>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
              </div>
              <span className="material-icons text-slate-400">chevron_right</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectDoctor;
