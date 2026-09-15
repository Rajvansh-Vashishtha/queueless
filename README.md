# 🏥 QueueLess — Smart Healthcare Digital Queue Management Platform

> A privacy-first, role-based digital queue & OPD appointment management system designed for modern hospitals and healthcare centers.

🚀 **Live Demo:**(https://queueless-app-six.vercel.app/)

---

## 📋 Project Overview

**QueueLess** is a smart digital queue management platform that eliminates crowded hospital waiting rooms. Patients can book OPD appointments from home, track their unique staggered visit slots, and monitor real-time travel recommendations. Hospital staff manage live queues with read-only automated QR entrance verification, while hospital administrators maintain doctor rosters, cabin numbers, and security passwords.

---

## ✨ Key Features

### 👨‍👩‍👧‍👦 1. Patient Portal & Smart At-Home Timeline
- **Remote OPD Booking**: Select hospital server, department, doctor, and treatment specialty to generate a queue token.
- **Smart At-Home Travel Timeline**: Displays a 3-step live guidance card (*1. Stay at Home*, *2. Leave Home*, *3. Hospital Arrival & QR Check-In*).
- **Night-Time OPD Schedule Detection**: Automatically schedules late-evening bookings for the next morning starting at 09:00 AM.
- **Unique Staggered Slots**: Guarantees distinct, non-matching consultation visit times for every patient token.
- **QR Code Entrance Check-in**: Patients scan the hospital entrance QR code upon arrival to update status to `Arrived`.

### 🩺 2. Staff Queue Controller Board (Read-Only Status Verification)
- **Role Privacy**: Staff members see strictly the live Staff Queue Board without access to Admin settings or doctor configuration.
- **Live Consultation Management**: Single-click actions to call next patient, mark served, manage no-shows, or add walk-in patients.
- **Automated QR Arrival Verification**: Status updates to `Arrived` only via automated QR scanner check-in.

### 🔐 3. Hospital Admin Panel & Security Control
- **Master Roster & Cabin Maintenance**: Admin can add, edit, or delete doctors, assign cabin/room numbers (e.g., `Room 305`), update departments, and adjust consultation durations.
- **Custom Password / PIN Management**: Admin can configure custom security PINs for Admin and Staff logins.
- **🚀 First-Time Setup Mode**: When launched on any new device or shared link, the app unlocks first-time setup without requiring a PIN.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite 8, Tailwind CSS v4
- **Single-File Compiler**: `vite-plugin-singlefile`
- **Icons**: Lucide React
- **Persistence**: React Context API + LocalStorage
