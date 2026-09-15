import React from "react";
import { useQueue } from "../../context/QueueContext";
import { calculatePeopleAhead, calculateEstimatedWaitTime } from "../../utils/queueEngine";
import { Ticket, Users, Clock, AlertTriangle, CheckCircle, XCircle, Bell, ArrowRight, Activity } from "lucide-react";

export default function ActiveTokenCard({ onViewHistory }) {
  const { patients, myTokenId, cancelToken, getDoctor, queueStates } = useQueue();

  const myToken = patients.find(p => p.tokenId === myTokenId || p.id === myTokenId);

  if (!myToken || myToken.status === "Served" || myToken.status === "Cancelled") {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Active Digital Token</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
          You currently do not have an active queue token. Select a department and doctor below to get your live token.
        </p>
        <button
          onClick={onViewHistory}
          className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors inline-flex items-center space-x-1.5"
        >
          <span>View Past Visit History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const doctor = getDoctor(myToken.doctorId);
  const avgServiceTime = doctor?.avgTime || 10;
  const peopleAhead = calculatePeopleAhead(patients, myToken.tokenId);
  const waitTimeEstimate = calculateEstimatedWaitTime(peopleAhead, avgServiceTime);
  const queueStatus = queueStates[myToken.doctorId] || "Active";

  // Find currently serving patient in this queue
  const currentServingPatient = patients.find(
    p => p.doctorId === myToken.doctorId && p.status === "Serving"
  );

  const isMyTurn = myToken.status === "Serving";
  const isApproaching = peopleAhead <= 1 && myToken.status === "Waiting";

  return (
    <div className="space-y-4">
      {/* Approaching or Current Turn Alert Banner */}
      {isMyTurn && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20 animate-bounce flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">IT'S YOUR TURN NOW!</h4>
              <p className="text-xs opacity-90">Please proceed immediately to {doctor?.room || "Consultation Room"}.</p>
            </div>
          </div>
          <span className="bg-white/20 text-white font-mono text-xs px-3 py-1 rounded-lg font-bold">
            ROOM {doctor?.room || "101"}
          </span>
        </div>
      )}

      {isApproaching && !isMyTurn && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-xs">Approaching Turn Alert</h4>
            <p className="text-xs text-amber-700">You are next in line! Please stay near the waiting area.</p>
          </div>
        </div>
      )}

      {queueStatus === "Paused" && (
        <div className="bg-slate-800 text-slate-200 rounded-2xl p-3 text-xs flex items-center justify-between">
          <span className="font-semibold">Queue Temporarily Paused by Staff</span>
          <span className="bg-slate-700 px-2 py-0.5 rounded text-[10px]">On Hold</span>
        </div>
      )}

      {/* Digital Token Card */}
      <div className={`relative rounded-3xl p-6 sm:p-8 border overflow-hidden transition-all shadow-xl ${
        isMyTurn
          ? "bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/30"
          : "bg-white border-teal-100/80 shadow-teal-500/5"
      }`}>
        {/* Background Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                myToken.priority === "Emergency"
                  ? "bg-red-100 text-red-700"
                  : myToken.priority === "Senior Citizen"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-teal-50 text-teal-700"
              }`}>
                {myToken.priority} Priority
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {myToken.tokenId.slice(0, 10)}</span>
            </div>
            <h2 className={`text-2xl font-extrabold mt-1 ${isMyTurn ? "text-white" : "text-slate-900"}`}>
              {myToken.patientName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {doctor?.name || "Attending Physician"} • {doctor?.departmentName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Token Number</span>
            <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
              isMyTurn ? "text-emerald-400" : "text-teal-600"
            }`}>
              {myToken.tokenNumber}
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6">
          {/* Current Serving */}
          <div className={`p-3.5 rounded-2xl border ${
            isMyTurn ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/60"
          }`}>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              <span>Now Serving</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${isMyTurn ? "text-white" : "text-slate-800"}`}>
              {currentServingPatient ? currentServingPatient.tokenNumber : "None"}
            </div>
          </div>

          {/* People Ahead */}
          <div className={`p-3.5 rounded-2xl border ${
            isMyTurn ? "bg-slate-800/80 border-slate-700" : "bg-teal-50/50 border-teal-100"
          }`}>
            <div className="flex items-center space-x-1.5 text-xs text-teal-600 mb-1">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>People Ahead</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${isMyTurn ? "text-white" : "text-teal-900"}`}>
              {isMyTurn ? "0 (Your Turn)" : `${peopleAhead} ${peopleAhead === 1 ? "person" : "people"}`}
            </div>
          </div>

          {/* Dynamic Wait Range */}
          <div className={`p-3.5 rounded-2xl border ${
            isMyTurn ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/60"
          }`}>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Est. Wait Time</span>
            </div>
            <div className={`text-sm sm:text-base font-bold ${isMyTurn ? "text-emerald-400" : "text-slate-800"}`}>
              {isMyTurn ? "In Room" : waitTimeEstimate.formatted}
            </div>
          </div>
        </div>

        {/* Footer Actions & Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live position recalculating automatically</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => cancelToken(myToken.tokenId)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200/60"
            >
              Cancel Queue Token
            </button>
            <button
              onClick={onViewHistory}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Visit History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
