import React, { useState, useEffect } from "react";
import { useQueue } from "../../context/QueueContext";
import WalkInModal from "./WalkInModal";
import { BellRing, CheckCircle, XCircle, UserPlus, PauseCircle, PlayCircle, Users, Clock, Stethoscope, AlertTriangle, ShieldAlert } from "lucide-react";

export default function StaffDashboard() {
  const {
    hospitals,
    patients,
    queueStates,
    callNextPatient,
    markServed,
    markNoShow,
    toggleQueuePause,
    getDoctor
  } = useQueue();

  // Collect all doctors across hospitals for tab selection
  const allDoctors = [];
  hospitals.forEach(h => {
    h.departments.forEach(d => {
      d.doctors.forEach(doc => {
        allDoctors.push({ ...doc, hospitalName: h.name, deptName: d.name, deptCode: d.code });
      });
    });
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState(allDoctors[0]?.id || "doc-1");
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [servingDurationSecs, setServingDurationSecs] = useState(0);

  const activeDoctor = getDoctor(selectedDoctorId) || allDoctors[0];
  const queueStatus = queueStates[selectedDoctorId] || "Active";

  // Filter patients for selected doctor
  const doctorPatients = patients.filter(p => p.doctorId === selectedDoctorId);
  const currentlyServing = doctorPatients.find(p => p.status === "Serving");
  
  // Sorted waiting queue
  const waitingPatients = doctorPatients
    .filter(p => p.status === "Waiting")
    .sort((a, b) => {
      const priorityScore = { Emergency: 3, "Senior Citizen": 2, Standard: 1 };
      const scoreDiff = (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(a.joinedAt) - new Date(b.joinedAt);
    });

  const completedToday = doctorPatients.filter(p => p.status === "Served").length;
  const noShowsToday = doctorPatients.filter(p => p.status === "No-Show").length;

  // Timer for currently serving patient
  useEffect(() => {
    let interval = null;
    if (currentlyServing && currentlyServing.calledAt) {
      const updateTimer = () => {
        const elapsed = Math.floor((new Date() - new Date(currentlyServing.calledAt)) / 1000);
        setServingDurationSecs(elapsed > 0 ? elapsed : 0);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setServingDurationSecs(0);
    }
    return () => clearInterval(interval);
  }, [currentlyServing]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Doctor Queue Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Staff Queue Controller</h2>
            <p className="text-xs text-slate-500">Live operational queue management dashboard</p>
          </div>
        </div>

        {/* Doctor Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {allDoctors.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctorId(doc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDoctorId === doc.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {doc.name} ({doc.room})
            </button>
          ))}
        </div>
      </div>

      {/* Main Staff Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Now Serving & Action Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pause Alert if Paused */}
          {queueStatus === "Paused" && (
            <div className="bg-amber-500 text-white p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md">
              <span className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>QUEUE IS CURRENTLY PAUSED</span>
              </span>
              <button
                onClick={() => toggleQueuePause(selectedDoctorId)}
                className="bg-white text-amber-900 text-[10px] px-2.5 py-1 rounded-lg hover:bg-amber-50"
              >
                Resume Queue
              </button>
            </div>
          )}

          {/* Currently Serving Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Currently Consultation</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
                {activeDoctor?.room}
              </span>
            </div>

            {currentlyServing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-2xl font-bold">{currentlyServing.patientName}</h3>
                    <p className="text-xs text-slate-400">{currentlyServing.service} • {currentlyServing.priority}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TOKEN</span>
                    <span className="text-3xl font-black font-mono text-emerald-400">{currentlyServing.tokenNumber}</span>
                  </div>
                </div>

                {/* Consultation Duration Counter */}
                <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Consultation Elapsed Time</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-emerald-400">
                    {formatTimer(servingDurationSecs)}
                  </span>
                </div>

                {/* Quick Action Controls for Currently Serving */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => markServed(currentlyServing.id)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Served</span>
                  </button>
                  <button
                    onClick={() => markNoShow(currentlyServing.id)}
                    className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>No-Show</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">No Patient in Consultation Room</p>
                <p className="text-xs text-slate-500">Click "Call Next Patient" to bring in the next token.</p>
              </div>
            )}
          </div>

          {/* Primary Queue Controller Action Buttons */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <button
              onClick={() => callNextPatient(selectedDoctorId)}
              disabled={queueStatus === "Paused" || waitingPatients.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <BellRing className="w-5 h-5 animate-pulse" />
              <span>Call Next Patient ({waitingPatients.length} Waiting)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsWalkInOpen(true)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Add Walk-In</span>
              </button>

              <button
                onClick={() => toggleQueuePause(selectedDoctorId)}
                className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                  queueStatus === "Paused"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {queueStatus === "Paused" ? (
                  <>
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    <span>Resume Queue</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-amber-600" />
                    <span>Pause Queue</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Served Today</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{completedToday}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">No-Shows</span>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{noShowsToday}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Waiting Queue Stream Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Waiting Queue</h3>
                <p className="text-xs text-slate-500">Sorted by Priority & Check-in Time</p>
              </div>
              <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
                {waitingPatients.length} Waiting
              </span>
            </div>

            {waitingPatients.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                No patients currently waiting in this queue.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                      <th className="pb-3 pr-3">Pos</th>
                      <th className="pb-3 px-3">Token</th>
                      <th className="pb-3 px-3">Patient</th>
                      <th className="pb-3 px-3">Priority</th>
                      <th className="pb-3 px-3">Joined Time</th>
                      <th className="pb-3 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {waitingPatients.map((patient, idx) => {
                      const joinedTime = new Date(patient.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 pr-3 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-teal-700 text-sm">{patient.tokenNumber}</td>
                          <td className="py-3.5 px-3 font-medium text-slate-900">
                            {patient.patientName}
                            <div className="text-[10px] text-slate-400">{patient.mobile}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              patient.priority === "Emergency"
                                ? "bg-red-100 text-red-700"
                                : patient.priority === "Senior Citizen"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {patient.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500">{joinedTime}</td>
                          <td className="py-3.5 pl-3 text-right space-x-1">
                            <button
                              onClick={() => markNoShow(patient.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-semibold"
                            >
                              No-Show
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Walk-In Modal */}
      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        selectedDoctorId={selectedDoctorId}
      />
    </div>
  );
}
