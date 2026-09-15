import React, { useState, useEffect } from "react";
import { useQueue } from "../context/QueueContext";
import { Activity, UserCheck, ShieldCheck, BarChart3, Clock, RotateCcw } from "lucide-react";

export default function Navbar() {
  const { activeRole, setActiveRole, resetDemoData, patients } = useQueue();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeWaitingCount = patients.filter(p => p.status === "Waiting").length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveRole("patient")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Queue<span className="text-teal-600">Less</span>
                </span>
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                  Health OS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Smart Digital Queue Platform</p>
            </div>
          </div>

          {/* Navigation Role Switcher */}
          <nav className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveRole("patient")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeRole === "patient"
                  ? "bg-white text-teal-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient Flow</span>
            </button>

            <button
              onClick={() => setActiveRole("staff")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeRole === "staff"
                  ? "bg-white text-emerald-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Staff Board</span>
              {activeWaitingCount > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeWaitingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveRole("admin")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeRole === "admin"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Config</span>
            </button>

            <button
              onClick={() => setActiveRole("analytics")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeRole === "analytics"
                  ? "bg-white text-indigo-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-medium">{time}</span>
            </div>

            <button
              onClick={resetDemoData}
              title="Reset sample data"
              className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
