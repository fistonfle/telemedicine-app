# Telemed

A telemedicine platform for Rwanda, built with React, Vite, and Tailwind CSS. Patients can book appointments with doctors, view prescriptions, and access consultation history. Doctors can manage schedules, appointments, patients, and prescriptions.

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** – build tool
- **Tailwind CSS 4** – styling
- **React Router 7** – routing
- **Redux Toolkit** – auth state
- **Formik + Yup** – form handling and validation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server               |
| `npm run dev:remote` | Dev with remote API config  |
| `npm run build`   | Production build               |
| `npm run preview` | Preview production build       |
| `npm run test`    | Run tests once                 |
| `npm run test:watch` | Run tests in watch mode     |

## Project Structure

```
src/
├── api/              # API client and services
│   ├── client.ts     # Fetch wrapper
│   ├── config.ts     # API URL
│   ├── authService.ts
│   ├── patientService.ts
│   ├── doctorService.ts
│   └── bookingService.ts
├── components/       # Reusable UI
│   ├── layout/      # PatientLayout, DoctorLayout
│   ├── booking/     # SelectDoctor, SelectDateTime, ConfirmBooking
│   └── ui/          # Badge, Toast
├── pages/           # Route components
├── store/           # Redux slices (auth)
└── types/           # TypeScript definitions
```

## Routes

### Public

- `/` – Login
- `/signup` – Sign up (Patient / Doctor)
- `/verify-email` – Email verification
- `/account-created` – Post-signup confirmation
- `/register/doctor` – Doctor registration form

### Patient (protected)

- `/patient` – Dashboard
- `/patient/appointments` – Appointment list
- `/patient/appointments/:id` – Appointment detail
- `/patient/book` – Book appointment
- `/patient/prescriptions` – Prescriptions
- `/patient/history` – Consultation history
- `/patient/profile` – Profile settings

### Doctor (protected)

- `/doctor` – Dashboard
- `/doctor/appointments` – Appointments
- `/doctor/patients` – Patient list
- `/doctor/visit` – Create prescription (from appointment)
- `/doctor/prescriptions/new` – Create prescription
- `/doctor/schedule` – Schedule management
- `/doctor/profile` – Profile settings

## API Integration

Set `VITE_API_URL` in your environment to point at your backend:

- `.env.development` – used by `npm run dev`
- `.env.dev` – used by `npm run dev:remote`

```env
VITE_API_URL=https://your-api.example.com
```

When unset, requests use the current origin (same host as the frontend).

## Sample Data

Sample data uses Rwandan context:

- Names (e.g. Jean Paul Niyonzima, Dr. Anne Mutoni)
- Phone format: +250 78X XXX XXX / +250 79X XXX XXX
- Addresses (e.g. KN 4 Ave, Kicukiro, Kigali)
- Pharmacy (Inyange Pharmacy, Kigali)
- RMDC (Rwanda Medical and Dental Council) for doctor registration

## License

Private.
