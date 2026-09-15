import React, { useState } from "react";
import { QueueProvider, useQueue } from "./context/QueueContext";
import Navbar from "./components/Navbar";
import TurnNotification from "./components/Patient/TurnNotification";
import FacilitySelector from "./components/Patient/FacilitySelector";
import ActiveTokenCard from "./components/Patient/ActiveTokenCard";
import JoinQueueModal from "./components/Patient/JoinQueueModal";
import VisitHistory from "./components/Patient/VisitHistory";
import StaffDashboard from "./components/Staff/StaffDashboard";
import AdminConfig from "./components/Admin/AdminConfig";
import OperationalAnalytics from "./components/Analytics/OperationalAnalytics";

function MainContent() {
  const { activeRole } = useQueue();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [patientTab, setPatientTab] = useState("active"); // 'active' or 'history'

  const handleSelectConfig = (config) => {
    setSelectedConfig(config);
    setIsJoinModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Patient View */}
      {activeRole === "patient" && (
        <div className="space-y-8 animate-slide-down">
          {patientTab === "active" ? (
            <>
              <ActiveTokenCard onViewHistory={() => setPatientTab("history")} />
              <FacilitySelector onSelectConfig={handleSelectConfig} />
            </>
          ) : (
            <VisitHistory onBack={() => setPatientTab("active")} />
          )}

          <JoinQueueModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
            selectedConfig={selectedConfig}
          />
        </div>
      )}

      {/* Staff View */}
      {activeRole === "staff" && (
        <div className="animate-slide-down">
          <StaffDashboard />
        </div>
      )}

      {/* Admin View */}
      {activeRole === "admin" && (
        <div className="animate-slide-down">
          <AdminConfig />
        </div>
      )}

      {/* Analytics View */}
      {activeRole === "analytics" && (
        <div className="animate-slide-down">
          <OperationalAnalytics />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <QueueProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <TurnNotification />

        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
          <p>© 2026 QueueLess Platform • Smart Digital Healthcare Queue Management System</p>
        </footer>
      </div>
    </QueueProvider>
  );
}
