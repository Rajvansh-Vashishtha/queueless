import React, { useEffect } from "react";
import { useQueue } from "../../context/QueueContext";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function TurnNotification() {
  const { notification, setNotification } = useQueue();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    alert: <Bell className="w-5 h-5 text-teal-500 animate-bounce shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    alert: "bg-teal-50 border-teal-300 text-teal-900 shadow-teal-500/10",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    info: "bg-blue-50 border-blue-200 text-blue-900"
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-slide-down">
      <div className={`flex items-start space-x-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${bgStyles[notification.type] || bgStyles.info}`}>
        {icons[notification.type] || icons.info}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
          <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
