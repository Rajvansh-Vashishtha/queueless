/**
 * Queue Engine Helper Utilities for QueueLess
 */

// Generate sequential token number formatted e.g., OPD-105, CAR-004
export function generateTokenNumber(deptCode = "OPD", totalGeneratedCount = 1) {
  const code = (deptCode || "OPD").toUpperCase().substring(0, 3);
  const sequence = String(totalGeneratedCount).padStart(3, "0");
  return `${code}-${sequence}`;
}

// Calculate people ahead for a specific patient token
export function calculatePeopleAhead(patients, patientTokenId) {
  const targetPatient = patients.find(p => p.tokenId === patientTokenId || p.id === patientTokenId);
  if (!targetPatient || targetPatient.status !== "Waiting") {
    return 0;
  }

  // Filter patients in the same doctor/queue who are currently "Waiting" and joined before or have higher priority
  const queueWaiting = patients.filter(
    p => p.doctorId === targetPatient.doctorId &&
         p.deptId === targetPatient.deptId &&
         p.status === "Waiting"
  );

  // Sort queue by priority (Emergency > Senior > Standard) then by joinedAt time
  const sortedQueue = [...queueWaiting].sort((a, b) => {
    const priorityScore = { Emergency: 3, "Senior Citizen": 2, Standard: 1 };
    const scoreDiff = (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(a.joinedAt) - new Date(b.joinedAt);
  });

  const index = sortedQueue.findIndex(p => p.id === targetPatient.id || p.tokenId === targetPatient.tokenId);
  return index >= 0 ? index : 0;
}

// Calculate dynamic estimated waiting time range (min, max mins)
export function calculateEstimatedWaitTime(peopleAhead, avgServiceTimeMinutes = 10) {
  if (peopleAhead <= 0) {
    return { min: 1, max: 5, formatted: "Next in line (< 5 mins)" };
  }

  const baseMinutes = peopleAhead * avgServiceTimeMinutes;
  const minMins = Math.max(1, Math.floor(baseMinutes * 0.85));
  const maxMins = Math.ceil(baseMinutes * 1.15);

  return {
    min: minMins,
    max: maxMins,
    formatted: `${minMins} - ${maxMins} mins`
  };
}

// Audio chime generator using Web Audio API
export function playTurnAlertChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play dual-tone pleasant chime
    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.4);      // C5
    playTone(659.25, now + 0.15, 0.4); // E5
    playTone(783.99, now + 0.3, 0.6);  // G5
  } catch (err) {
    console.log("Audio alert playback error:", err);
  }
}

// Operational Analytics calculation helper
export function calculateAnalyticsMetrics(patients = []) {
  const total = patients.length;
  const served = patients.filter(p => p.status === "Served").length;
  const waiting = patients.filter(p => p.status === "Waiting").length;
  const serving = patients.filter(p => p.status === "Serving").length;
  const noShows = patients.filter(p => p.status === "No-Show").length;
  const cancelled = patients.filter(p => p.status === "Cancelled").length;

  // Calculate average wait time for served patients
  const servedPatientsWithTime = patients.filter(p => p.status === "Served" && p.joinedAt && p.calledAt);
  let totalWaitMs = 0;
  servedPatientsWithTime.forEach(p => {
    totalWaitMs += (new Date(p.calledAt) - new Date(p.joinedAt));
  });

  const avgWaitTimeMins = servedPatientsWithTime.length > 0 
    ? Math.round(totalWaitMs / (servedPatientsWithTime.length * 60000))
    : 12;

  // Calculate average service time
  const servedWithFinishTime = patients.filter(p => p.status === "Served" && p.calledAt && p.servedAt);
  let totalServiceMs = 0;
  servedWithFinishTime.forEach(p => {
    totalServiceMs += (new Date(p.servedAt) - new Date(p.calledAt));
  });

  const avgServiceTimeMins = servedWithFinishTime.length > 0
    ? Math.round(totalServiceMs / (servedWithFinishTime.length * 60000))
    : 10;

  return {
    total,
    served,
    waiting,
    serving,
    noShows,
    cancelled,
    avgWaitTimeMins,
    avgServiceTimeMins
  };
}
