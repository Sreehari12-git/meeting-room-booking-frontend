# Meeting Room Booking System - Frontend

A modern, responsive, and intuitive web interface for the Meeting Room Booking System. Designed for both Administrators and Employees to efficiently manage, search, and book meeting rooms.

---

## 🚀 Tech Stack

- **Framework:** [React (v19.x)](https://react.dev/)
- **Build Tool & Dev Server:** [Vite (v8.x)](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS (v4.x)](https://tailwindcss.com/)
- **Routing:** [React Router DOM (v7.x)](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Cookie Utility:** [js-cookie](https://github.com/js-cookie/js-cookie)
- **Icons:** [Tabler Icons React](https://tabler.io/icons) & [Lucide React](https://lucide.dev/)

---

## ✨ Key Features

### 🔑 Authentication
- **Secure Login:** Credentials validation matching backend authentication.
- **Session Management:** Automatic token refresh using Axios interceptors and HttpOnly cookies.
- **Role-based Protected Routes:** Automatically redirects unauthorized users and guards administrative pages.

### 👑 Administrator Features
- **User Management:** Create new system users (Admin/Employee), update existing details, or delete users.
- **Room Management:** Add new meeting rooms (specifying name, capacity, and amenities), edit details, or remove rooms.

### 👥 Employee Features
- **Check Availability:** Quick search filters to find available meeting rooms based on a specific date, start time, and end time.
- **Book Room:** Easily reserve available rooms.
- **Booking History:** View active/upcoming bookings, check-in history, and cancel reservations directly.

---

## 🛠️ Project Setup

### 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)

### 💻 Installation

1. Navigate to the frontend directory:
   ```bash
   cd MR-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### ⚙️ Environment Configuration

Create a `.env` file in the root of the `MR-frontend` directory to specify the backend API URL:

```env
VITE_API_URL="http://localhost:5000"
```

*Make sure this URL matches the port and host where your NestJS backend service is currently running.*

---

## 🏃 Running the Application

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local development server (usually at `http://localhost:5173`) |
| `npm run build` | Compiles and builds production-ready static assets in the `dist/` directory |
| `npm run preview` | Runs a local server to preview the production build |
| `npm run lint` | Runs ESLint to check for code issues and styling errors |

---

## 🗂️ Project Directory Structure

```text
MR-frontend/
├── src/
│   ├── api/                # API service definitions (Axios setup, auth, bookings, rooms, users)
│   ├── assets/             # Images, logos, and static media files
│   ├── components/         # Reusable UI components & route protection (ProtectedRoute)
│   ├── layout/             # Layout templates (sidebar, navbar, main container)
│   ├── pages/              # Application pages:
│   │   ├── Admin/          # Admin-only pages (AddRoom, AddUser, AdminDashboard)
│   │   ├── Employee/       # Employee-only pages (Availability, BookRoom, BookingHistory)
│   │   └── Login.tsx       # Auth login page
│   ├── App.tsx             # Route definitions and layouts configuration
│   ├── index.css           # Global Tailwind and styling configurations
│   └── main.tsx            # Application entry point
├── vite.config.ts          # Vite compilation and plugin setup
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts & dependencies definition
```
