import React from "react";
import { useQueue } from "../../context/QueueContext";
import { calculateAnalyticsMetrics } from "../../utils/queueEngine";
import { BarChart3, Users, CheckCircle2, Clock, AlertOctagon, UserX, TrendingUp, Sparkles, Activity } from "lucide-react";

export default function OperationalAnalytics() {
  const { patients, hospitals } = useQueue();

  const metrics = calculateAnalyticsMetrics(patients);

  // Departmental distribution calculation
  const deptStats = [];
  hospitals.forEach(h => {
    h.departments.forEach(d => {
      const deptPatients = patients.filter(p => p.deptId === d.id);
      const total = deptPatients.length;
      const served = deptPatients.filter(p => p.status === "Served").length;
      const waiting = deptPatients.filter(p => p.status === "Waiting").length;
      const percentage = total > 0 ? Math.round((served / total) * 100) : 0;

      deptStats.push({
        name: d.name,
        code: d.code,
        total,
        served,
        waiting,
        percentage
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Operational Analytics Dashboard</h2>
            <p className="text-xs text-slate-500">Real-time facility throughput, wait time performance & queue metrics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
          <TrendingUp className="w-4 h-4" />
          <span>Queue Throughput Efficiency: 94.2%</span>
        </div>
      </div>

      {/* Top 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Tokens</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.total}</div>
          <p className="text-[10px] text-slate-400 mt-1">Total registered today</p>
        </div>

        {/* Patients Served */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Patients Served</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{metrics.served}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Completed consultations</p>
        </div>

        {/* Currently Waiting */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Waiting</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{metrics.waiting}</div>
          <p className="text-[10px] text-slate-400 mt-1">In queue stream</p>
        </div>

        {/* No-Shows */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">No-Shows</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{metrics.noShows}</div>
          <p className="text-[10px] text-slate-400 mt-1">Missed call tokens</p>
        </div>

        {/* Cancellations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cancellations</span>
            <AlertOctagon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-slate-600">{metrics.cancelled}</div>
          <p className="text-[10px] text-slate-400 mt-1">Patient dropped</p>
        </div>
      </div>

      {/* Average Performance Metrics & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cards: Averages */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>KEY PERFORMANCE BENCHMARKS</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 block">Average Patient Waiting Time</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  {metrics.avgWaitTimeMins} <span className="text-sm font-normal text-white">mins</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">From token generation to doctor call</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 block">Average Consultation / Service Time</span>
                <div className="text-3xl font-black font-mono text-indigo-300 mt-1">
                  {metrics.avgServiceTimeMins} <span className="text-sm font-normal text-white">mins</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Per completed patient session</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Department Throughput Visual Progress Bars */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Departmental Throughput</h3>
              <p className="text-xs text-slate-500">Served vs Waiting distribution by specialty</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{deptStats.length} Departments</span>
          </div>

          <div className="space-y-5">
            {deptStats.map((dept, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {dept.code}
                    </span>
                    <span className="font-bold text-slate-800">{dept.name}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    <span className="font-bold text-emerald-600">{dept.served} served</span> / {dept.total} total
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                    title={`${dept.percentage}% Served`}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${dept.total > 0 ? (dept.waiting / dept.total) * 100 : 0}%` }}
                    title={`Waiting`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
