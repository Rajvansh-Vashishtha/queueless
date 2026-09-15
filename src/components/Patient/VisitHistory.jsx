import React from "react";
import { useQueue } from "../../context/QueueContext";
import { History, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function VisitHistory({ onBack }) {
  const { patients, getDoctor } = useQueue();

  const historyPatients = patients.filter(p => ["Served", "Cancelled", "No-Show"].includes(p.status));

  const statusBadges = {
    Served: <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Served</span>,
    Cancelled: <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">Cancelled</span>,
    "No-Show": <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">No-Show</span>
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Visit History</h3>
            <p className="text-xs text-slate-500">Log of past consultations and token activity</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Card</span>
        </button>
      </div>

      {historyPatients.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No past visit history recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {historyPatients.map(patient => {
            const doctor = getDoctor(patient.doctorId);
            const joinedTime = new Date(patient.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={patient.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-800 text-sm">
                    {patient.tokenNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{patient.patientName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {doctor?.name || "Doctor"} • {patient.service}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Joined at {joinedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {statusBadges[patient.status]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
