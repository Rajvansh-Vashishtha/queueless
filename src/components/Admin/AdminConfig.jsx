import React, { useState } from "react";
import { useQueue } from "../../context/QueueContext";
import { ShieldCheck, Stethoscope, Clock, Save, Edit3, Plus, Building, UserCheck } from "lucide-react";

export default function AdminConfig() {
  const { hospitals, updateDoctorAvgTime } = useQueue();
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || "hosp-1");

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newAvgTime, setNewAvgTime] = useState("");

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  const handleEditClick = (deptId, doctor) => {
    setEditingDoctor({ deptId, doctorId: doctor.id, name: doctor.name });
    setNewAvgTime(doctor.avgTime);
  };

  const handleSave = (deptId, doctorId) => {
    if (!newAvgTime || isNaN(newAvgTime) || parseInt(newAvgTime, 10) <= 0) {
      alert("Please enter a valid positive number for average service time.");
      return;
    }

    updateDoctorAvgTime(selectedHospitalId, deptId, doctorId, newAvgTime);
    setEditingDoctor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Operational Configuration</h2>
            <p className="text-xs text-slate-500">Configure operational queues, department codes & doctor service time baselines</p>
          </div>
        </div>

        {/* Hospital Switcher */}
        <div className="flex items-center space-x-2">
          {hospitals.map(hosp => (
            <button
              key={hosp.id}
              onClick={() => setSelectedHospitalId(hosp.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedHospitalId === hosp.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {hosp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Roster Configuration */}
      <div className="space-y-6">
        {currentHospital?.departments?.map(dept => (
          <div key={dept.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-200">
                  {dept.code}
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500">Default Service Time: {dept.avgServiceTime} mins</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium">{dept.doctors.length} Doctors Assigned</span>
              </div>
            </div>

            {/* Doctors Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase border-b border-slate-100 font-bold">
                    <th className="pb-2.5 pr-4">Doctor Name</th>
                    <th className="pb-2.5 px-4">Specialty</th>
                    <th className="pb-2.5 px-4">Room</th>
                    <th className="pb-2.5 px-4">Status</th>
                    <th className="pb-2.5 px-4">Avg Service Time</th>
                    <th className="pb-2.5 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dept.doctors.map(doctor => {
                    const isEditing = editingDoctor?.doctorId === doctor.id;

                    return (
                      <tr key={doctor.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-slate-900">{doctor.name}</td>
                        <td className="py-3.5 px-4 text-slate-500">{doctor.specialty}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{doctor.room}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doctor.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="number"
                                min="1"
                                max="60"
                                value={newAvgTime}
                                onChange={(e) => setNewAvgTime(e.target.value)}
                                className="w-16 px-2 py-1 bg-slate-50 border border-blue-400 rounded-lg text-xs font-mono font-bold focus:outline-none"
                              />
                              <span className="text-slate-500 text-[11px]">mins</span>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {doctor.avgTime} mins / patient
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(dept.id, doctor.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1 ml-auto"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditClick(dept.id, doctor)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors inline-flex items-center space-x-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Time</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
