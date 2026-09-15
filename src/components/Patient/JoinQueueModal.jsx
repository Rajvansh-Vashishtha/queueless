import React, { useState } from "react";
import { useQueue } from "../../context/QueueContext";
import { X, User, Phone, Calendar, ShieldAlert, Sparkles, Check } from "lucide-react";

export default function JoinQueueModal({ isOpen, onClose, selectedConfig }) {
  const { joinQueue } = useQueue();
  const [formData, setFormData] = useState({
    patientName: "",
    mobile: "",
    age: "32",
    gender: "Female",
    priority: "Standard"
  });

  if (!isOpen || !selectedConfig) return null;

  const { hospital, department, doctor, service } = selectedConfig;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.mobile) {
      alert("Please provide your name and phone number.");
      return;
    }

    joinQueue({
      hospitalId: hospital.id,
      deptId: department.id,
      doctorId: doctor.id,
      service: service || department.services[0],
      ...formData
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-down relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Generate Digital Token</h3>
            <p className="text-xs text-slate-500">{hospital.name} • {department.name}</p>
          </div>
        </div>

        {/* Selected Summary Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Doctor:</span>
            <span className="font-bold text-slate-800">{doctor.name} ({doctor.room})</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Service:</span>
            <span className="font-bold text-slate-800">{service || "General Service"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Est. Service Time:</span>
            <span className="font-bold text-teal-700">{doctor.avgTime || 10} mins / patient</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Patient Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Jane Doe"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+1 555-0100"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority / Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "Standard", label: "Standard", desc: "Regular queue" },
                { id: "Senior Citizen", label: "Senior Citizen", desc: "Age 65+ priority" },
                { id: "Emergency", label: "Emergency", desc: "Urgent triage" }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, priority: opt.id })}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    formData.priority === opt.id
                      ? "border-teal-500 bg-teal-50/60 text-teal-900 font-semibold"
                      : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Generate Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
