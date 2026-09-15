import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_HOSPITALS, INITIAL_QUEUES, INITIAL_PATIENTS } from "../data/initialData";
import { generateTokenNumber, playTurnAlertChime } from "../utils/queueEngine";

const QueueContext = createContext();

export function QueueProvider({ children }) {
  // Navigation & Role State
  const [activeRole, setActiveRole] = useState("patient"); // 'patient', 'staff', 'admin', 'analytics'
  
  // Data state with localStorage persistence
  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem("queueless_hospitals");
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("queueless_patients");
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [queueStates, setQueueStates] = useState(() => {
    const saved = localStorage.getItem("queueless_queuestates");
    return saved ? JSON.parse(saved) : {};
  });

  const [myTokenId, setMyTokenId] = useState(() => {
    return localStorage.getItem("queueless_mytokenid") || "tok-102"; // default to Eleanor Vance for demonstration
  });

  const [notification, setNotification] = useState(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("queueless_hospitals", JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem("queueless_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("queueless_queuestates", JSON.stringify(queueStates));
  }, [queueStates]);

  useEffect(() => {
    if (myTokenId) {
      localStorage.setItem("queueless_mytokenid", myTokenId);
    } else {
      localStorage.removeItem("queueless_mytokenid");
    }
  }, [myTokenId]);

  // Helper: Get department by ID
  const getDepartment = (hospitalId, deptId) => {
    const hosp = hospitals.find(h => h.id === hospitalId);
    return hosp?.departments?.find(d => d.id === deptId);
  };

  // Helper: Get doctor by ID
  const getDoctor = (doctorId) => {
    for (const h of hospitals) {
      for (const d of h.departments) {
        const doc = d.doctors.find(doc => doc.id === doctorId);
        if (doc) return { ...doc, departmentName: d.name, deptCode: d.code };
      }
    }
    return null;
  };

  // Action: Patient joins queue
  const joinQueue = (patientDetails) => {
    const { hospitalId, deptId, doctorId, service, patientName, mobile, age, gender, priority } = patientDetails;
    const dept = getDepartment(hospitalId, deptId);
    const deptCode = dept ? dept.code : "OPD";

    // Count existing tokens for token number generation
    const existingDeptPatientsCount = patients.filter(p => p.deptId === deptId).length;
    const newTokenNumber = generateTokenNumber(deptCode, existingDeptPatientsCount + 101);

    const newPatient = {
      id: `p-${Date.now()}`,
      tokenId: `tok-${Date.now()}`,
      tokenNumber: newTokenNumber,
      patientName,
      mobile,
      age: parseInt(age, 10) || 30,
      gender,
      priority: priority || "Standard",
      hospitalId,
      deptId,
      doctorId,
      service,
      status: "Waiting",
      joinedAt: new Date().toISOString(),
      calledAt: null,
      servedAt: null
    };

    setPatients(prev => [...prev, newPatient]);
    setMyTokenId(newPatient.tokenId);
    
    setNotification({
      type: "success",
      title: "Queue Joined Successfully!",
      message: `Your token is ${newTokenNumber}. Track your live position on your screen.`
    });

    return newPatient;
  };

  // Action: Patient cancels token
  const cancelToken = (tokenId) => {
    setPatients(prev => prev.map(p => p.tokenId === tokenId || p.id === tokenId ? { ...p, status: "Cancelled" } : p));
    if (myTokenId === tokenId) {
      setMyTokenId(null);
    }
    setNotification({
      type: "info",
      title: "Token Cancelled",
      message: "Your queue token has been cancelled."
    });
  };

  // Action: Staff calls next patient
  const callNextPatient = (doctorId) => {
    // Find waiting patients for doctor, sorted by priority then time
    const waitingList = patients
      .filter(p => p.doctorId === doctorId && p.status === "Waiting")
      .sort((a, b) => {
        const priorityScore = { Emergency: 3, "Senior Citizen": 2, Standard: 1 };
        const scoreDiff = (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(a.joinedAt) - new Date(b.joinedAt);
      });

    if (waitingList.length === 0) {
      setNotification({
        type: "warning",
        title: "No Waiting Patients",
        message: "There are currently no waiting patients in this queue."
      });
      return null;
    }

    const nextPatient = waitingList[0];
    const nowIso = new Date().toISOString();

    // Set any currently "Serving" patient for this doctor to "Served" or update next patient
    setPatients(prev => prev.map(p => {
      if (p.doctorId === doctorId && p.status === "Serving") {
        return { ...p, status: "Served", servedAt: nowIso };
      }
      if (p.id === nextPatient.id) {
        return { ...p, status: "Serving", calledAt: nowIso };
      }
      return p;
    }));

    // Trigger audio chime for turn announcement
    playTurnAlertChime();

    setNotification({
      type: "alert",
      title: `Calling Token ${nextPatient.tokenNumber}`,
      message: `Patient ${nextPatient.patientName} has been called to consultation room.`
    });

    return nextPatient;
  };

  // Action: Staff marks patient as Served
  const markServed = (tokenId) => {
    const nowIso = new Date().toISOString();
    setPatients(prev => prev.map(p => p.tokenId === tokenId || p.id === tokenId ? { ...p, status: "Served", servedAt: nowIso } : p));
    setNotification({
      type: "success",
      title: "Patient Completed",
      message: "Patient marked as Served."
    });
  };

  // Action: Staff marks patient as No-Show
  const markNoShow = (tokenId) => {
    setPatients(prev => prev.map(p => p.tokenId === tokenId || p.id === tokenId ? { ...p, status: "No-Show" } : p));
    setNotification({
      type: "warning",
      title: "Patient No-Show",
      message: "Patient marked as No-Show."
    });
  };

  // Action: Staff adds walk-in patient
  const addWalkInPatient = (walkInDetails) => {
    const { hospitalId, deptId, doctorId, service, patientName, mobile, priority } = walkInDetails;
    const dept = getDepartment(hospitalId, deptId);
    const deptCode = dept ? dept.code : "WKN";

    const existingDeptPatientsCount = patients.filter(p => p.deptId === deptId).length;
    const newTokenNumber = generateTokenNumber(deptCode, existingDeptPatientsCount + 101);

    const newWalkIn = {
      id: `p-walkin-${Date.now()}`,
      tokenId: `tok-walkin-${Date.now()}`,
      tokenNumber: newTokenNumber,
      patientName: patientName || "Walk-In Patient",
      mobile: mobile || "N/A",
      age: 35,
      gender: "Not Specified",
      priority: priority || "Standard",
      hospitalId,
      deptId,
      doctorId,
      service: service || "General Service",
      status: "Waiting",
      joinedAt: new Date().toISOString(),
      calledAt: null,
      servedAt: null
    };

    setPatients(prev => [...prev, newWalkIn]);
    setNotification({
      type: "success",
      title: `Walk-In Token ${newTokenNumber}`,
      message: `${newWalkIn.patientName} added to the queue.`
    });
  };

  // Action: Pause / Resume Queue
  const toggleQueuePause = (doctorId) => {
    setQueueStates(prev => {
      const current = prev[doctorId] || "Active";
      const nextState = current === "Active" ? "Paused" : "Active";
      setNotification({
        type: "info",
        title: `Queue ${nextState}`,
        message: `Queue status updated to ${nextState}.`
      });
      return { ...prev, [doctorId]: nextState };
    });
  };

  // Action: Admin updates Doctor Average Service Time
  const updateDoctorAvgTime = (hospitalId, deptId, doctorId, newAvgTime) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      return {
        ...h,
        departments: h.departments.map(d => {
          if (d.id !== deptId) return d;
          return {
            ...d,
            doctors: d.doctors.map(doc => {
              if (doc.id !== doctorId) return doc;
              return { ...doc, avgTime: parseInt(newAvgTime, 10) || 10 };
            })
          };
        })
      };
    }));

    setNotification({
      type: "success",
      title: "Configuration Saved",
      message: `Average service time updated to ${newAvgTime} minutes.`
    });
  };

  // Reset to sample state
  const resetDemoData = () => {
    setHospitals(INITIAL_HOSPITALS);
    setPatients(INITIAL_PATIENTS);
    setQueueStates({});
    setMyTokenId("tok-102");
    setNotification({
      type: "info",
      title: "Demo Data Reset",
      message: "Reset all queues and patients to default demonstration state."
    });
  };

  return (
    <QueueContext.Provider value={{
      activeRole,
      setActiveRole,
      hospitals,
      patients,
      queueStates,
      myTokenId,
      setMyTokenId,
      notification,
      setNotification,
      getDepartment,
      getDoctor,
      joinQueue,
      cancelToken,
      callNextPatient,
      markServed,
      markNoShow,
      addWalkInPatient,
      toggleQueuePause,
      updateDoctorAvgTime,
      resetDemoData
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
