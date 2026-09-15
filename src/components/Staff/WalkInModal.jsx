import React, { useState } from "react";
import { useQueue } from "../../context/QueueContext";
import { X, UserPlus, Phone, User, Check } from "lucide-react";

export default function WalkInModal({ isOpen, onClose, selectedDoctorId }) {
  const { addWalkInPatient, hospitals, getDoctor } = useQueue();
  const doctor = getDoctor(selectedDoctorId);

  const [formData, setFormData] = useState({
    patientName: "",
    mobile: "",
    priority: "Standard"
  });

  if (!isOpen || !doctor) return null;

  // Find department and hospital
  let targetHospital = null;
  let targetDept = null;

  for (const h of hospitals) {
    for (const d of h.departments) {
      if (d.doctors.some(doc => doc.id === doctor.id)) {
        targetHospital = h;
        targetDept = d;
        break;
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) {
      alert("Please enter patient name.");
      return;
    }

    addWalkInPatient({
      hospitalId: targetHospital?.id || "hosp-1",
      deptId: targetDept?.id || "dept-opd",
      doctorId: doctor.id,
      service: targetDept?.services[0] || "Walk-In Consultation",
      ...formData
    });

    setFormData({ patientName: "", mobile: "", priority: "Standard" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-down relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Add Walk-In Patient</h3>
            <p className="text-xs text-slate-500">Assign token to reception patient</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-5 text-xs text-slate-600">
          <div><span className="font-semibold text-slate-700">Doctor:</span> {doctor.name} ({doctor.room})</div>
          <div><span className="font-semibold text-slate-700">Department:</span> {doctor.departmentName}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Walk-In Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="+1 555-0000"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {["Standard", "Senior Citizen", "Emergency"].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    formData.priority === p
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Issue Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
