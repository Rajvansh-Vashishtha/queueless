export const INITIAL_HOSPITALS = [
  {
    id: "hosp-1",
    name: "CityCare General Hospital",
    location: "Downtown Medical Hub, Bldg 4",
    phone: "+1 (800) 555-0199",
    departments: [
      {
        id: "dept-opd",
        name: "General Outpatient (OPD)",
        code: "OPD",
        icon: "Stethoscope",
        avgServiceTime: 10,
        doctors: [
          { id: "doc-1", name: "Dr. Sarah Jenkins", specialty: "General Physician", room: "Room 102", status: "Active", avgTime: 10 },
          { id: "doc-2", name: "Dr. Robert Chen", specialty: "Internal Medicine", room: "Room 105", status: "Active", avgTime: 12 }
        ],
        services: ["General Consultation", "Routine Checkup", "Prescription Renewal", "Follow-up Visit"]
      },
      {
        id: "dept-cardio",
        name: "Cardiology Center",
        code: "CAR",
        icon: "HeartPulse",
        avgServiceTime: 15,
        doctors: [
          { id: "doc-3", name: "Dr. Elena Rostova", specialty: "Interventional Cardiologist", room: "Room 204", status: "Active", avgTime: 15 },
          { id: "doc-4", name: "Dr. Marcus Vance", specialty: "Electrophysiologist", room: "Room 206", status: "On Break", avgTime: 15 }
        ],
        services: ["ECG & Echo Assessment", "Cardiac Consultation", "BP & Lipid Evaluation"]
      },
      {
        id: "dept-pediatrics",
        name: "Pediatrics & Child Care",
        code: "PED",
        icon: "Baby",
        avgServiceTime: 12,
        doctors: [
          { id: "doc-5", name: "Dr. Anita Desai", specialty: "Pediatric Specialist", room: "Room 110", status: "Active", avgTime: 12 }
        ],
        services: ["Child Immunization", "Growth & Nutrition", "Pediatric Illness Consultation"]
      },
      {
        id: "dept-ortho",
        name: "Orthopedics & Joint Care",
        code: "ORT",
        icon: "Bone",
        avgServiceTime: 14,
        doctors: [
          { id: "doc-6", name: "Dr. James Wilson", specialty: "Orthopedic Surgeon", room: "Room 301", status: "Active", avgTime: 14 }
        ],
        services: ["Joint Pain Evaluation", "Fracture & Cast Check", "Post-Surgery Follow-up"]
      }
    ]
  },
  {
    id: "hosp-2",
    name: "St. Jude Specialist Clinic",
    location: "Westside Wellness Boulevard",
    phone: "+1 (800) 555-0844",
    departments: [
      {
        id: "dept-derma",
        name: "Dermatology & Skin Care",
        code: "DER",
        icon: "Sparkles",
        avgServiceTime: 12,
        doctors: [
          { id: "doc-7", name: "Dr. Chloe Bennett", specialty: "Dermatologist", room: "Suite 12", status: "Active", avgTime: 12 }
        ],
        services: ["Skin Consultation", "Allergy Screening", "Cosmetic Checkup"]
      }
    ]
  }
];

export const INITIAL_QUEUES = [
  {
    id: "q-1",
    hospitalId: "hosp-1",
    deptId: "dept-opd",
    doctorId: "doc-1",
    service: "General Consultation",
    status: "Active", // Active or Paused
    currentTokenNumber: "OPD-101",
    createdAt: new Date().toISOString()
  },
  {
    id: "q-2",
    hospitalId: "hosp-1",
    deptId: "dept-cardio",
    doctorId: "doc-3",
    service: "Cardiac Consultation",
    status: "Active",
    currentTokenNumber: "CAR-002",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "p-101",
    tokenId: "tok-101",
    tokenNumber: "OPD-101",
    patientName: "Michael Vance",
    mobile: "+1 555-0144",
    age: 45,
    gender: "Male",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-opd",
    doctorId: "doc-1",
    service: "General Consultation",
    status: "Serving", // Waiting, Serving, Served, No-Show, Cancelled
    joinedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 5 * 60000).toISOString(),
    servedAt: null
  },
  {
    id: "p-102",
    tokenId: "tok-102",
    tokenNumber: "OPD-102",
    patientName: "Eleanor Vance (Senior)",
    mobile: "+1 555-0188",
    age: 72,
    gender: "Female",
    priority: "Senior Citizen",
    hospitalId: "hosp-1",
    deptId: "dept-opd",
    doctorId: "doc-1",
    service: "General Consultation",
    status: "Waiting",
    joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    calledAt: null,
    servedAt: null
  },
  {
    id: "p-103",
    tokenId: "tok-103",
    tokenNumber: "OPD-103",
    patientName: "David Miller",
    mobile: "+1 555-0192",
    age: 34,
    gender: "Male",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-opd",
    doctorId: "doc-1",
    service: "General Consultation",
    status: "Waiting",
    joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    calledAt: null,
    servedAt: null
  },
  {
    id: "p-104",
    tokenId: "tok-104",
    tokenNumber: "OPD-104",
    patientName: "Sophia Martinez",
    mobile: "+1 555-0210",
    age: 28,
    gender: "Female",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-opd",
    doctorId: "doc-1",
    service: "General Consultation",
    status: "Waiting",
    joinedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    calledAt: null,
    servedAt: null
  },

  // Cardio queue
  {
    id: "p-201",
    tokenId: "tok-201",
    tokenNumber: "CAR-001",
    patientName: "Arthur Pendelton",
    mobile: "+1 555-0311",
    age: 64,
    gender: "Male",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-cardio",
    doctorId: "doc-3",
    service: "Cardiac Consultation",
    status: "Served",
    joinedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 30 * 60000).toISOString(),
    servedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: "p-202",
    tokenId: "tok-202",
    tokenNumber: "CAR-002",
    patientName: "Samantha Reed",
    mobile: "+1 555-0422",
    age: 52,
    gender: "Female",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-cardio",
    doctorId: "doc-3",
    service: "Cardiac Consultation",
    status: "Serving",
    joinedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    calledAt: new Date(Date.now() - 10 * 60000).toISOString(),
    servedAt: null
  },
  {
    id: "p-203",
    tokenId: "tok-203",
    tokenNumber: "CAR-003",
    patientName: "Lucas Wright",
    mobile: "+1 555-0533",
    age: 39,
    gender: "Male",
    priority: "Standard",
    hospitalId: "hosp-1",
    deptId: "dept-cardio",
    doctorId: "doc-3",
    service: "Cardiac Consultation",
    status: "Waiting",
    joinedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    calledAt: null,
    servedAt: null
  }
];
