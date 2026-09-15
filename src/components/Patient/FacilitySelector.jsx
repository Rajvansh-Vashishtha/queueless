import React, { useState } from "react";
import { useQueue } from "../../context/QueueContext";
import { Building2, Stethoscope, User, Clock, ChevronRight, Sparkles, CheckCircle2, ShieldCheck, HeartPulse, Bone, Baby, Flame } from "lucide-react";

export default function FacilitySelector({ onSelectConfig }) {
  const { hospitals } = useQueue();
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || "hosp-1");
  const [selectedDeptId, setSelectedDeptId] = useState("dept-opd");

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
  const currentDepartment = currentHospital?.departments?.find(d => d.id === selectedDeptId) || currentHospital?.departments[0];

  const deptIcons = {
    "Stethoscope": <Stethoscope className="w-5 h-5" />,
    "HeartPulse": <HeartPulse className="w-5 h-5 text-rose-500" />,
    "Baby": <Baby className="w-5 h-5 text-amber-500" />,
    "Bone": <Bone className="w-5 h-5 text-indigo-500" />,
    "Sparkles": <Sparkles className="w-5 h-5 text-purple-500" />
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Select Facility / Hospital */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Building2 className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">1. Select Medical Facility</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hospitals.map(hosp => (
            <div
              key={hosp.id}
              onClick={() => {
                setSelectedHospitalId(hosp.id);
                if (hosp.departments[0]) {
                  setSelectedDeptId(hosp.departments[0].id);
                }
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedHospitalId === hosp.id
                  ? "bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{hosp.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{hosp.location}</p>
                </div>
                {selectedHospitalId === hosp.id && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                )}
              </div>
              <div className="mt-3 flex items-center space-x-3 text-[11px] text-slate-500">
                <span>{hosp.departments.length} Active Departments</span>
                <span>•</span>
                <span>{hosp.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Select Department */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">2. Choose Department</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentHospital?.departments?.map(dept => (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedDeptId === dept.id
                  ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDeptId === dept.id ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700"}`}>
                  {deptIcons[dept.icon] || <Stethoscope className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  selectedDeptId === dept.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {dept.code}
                </span>
              </div>
              <h4 className="font-bold text-sm leading-snug">{dept.name}</h4>
              <p className={`text-[11px] mt-1 ${selectedDeptId === dept.id ? "text-teal-100" : "text-slate-500"}`}>
                Avg Service: {dept.avgServiceTime} mins
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Select Doctor & Service */}
      {currentDepartment && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">3. Available Doctors & Specialists</h3>
            </div>
            <span className="text-xs text-slate-500">{currentDepartment.doctors.length} Doctor(s) Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDepartment.doctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                        doctor.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        ● {doctor.status}
                      </span>
                      <h4 className="font-bold text-base text-slate-900">{doctor.name}</h4>
                      <p className="text-xs text-slate-500">{doctor.specialty} • <span className="font-semibold text-slate-700">{doctor.room}</span></p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Avg Consultation</span>
                      <span className="text-xs font-bold text-teal-700 font-mono">{doctor.avgTime} mins</span>
                    </div>
                  </div>

                  {/* Services offered tag cloud */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {currentDepartment.services.map((srv, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectConfig({
                    hospital: currentHospital,
                    department: currentDepartment,
                    doctor: doctor,
                    service: currentDepartment.services[0]
                  })}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Join Queue for {doctor.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
