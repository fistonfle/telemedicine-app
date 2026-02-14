# API Integration Guide

The app uses a **mock API** by default while waiting for the backend. When your API is ready, you can switch with a single env variable.

## Current Setup (Mock Mode)

- **No env vars needed** – mock data is used automatically
- Simulated ~400ms delay per request
- All data lives in `src/api/mockData.js`

## Switching to Real API

1. Create `.env` in project root:

```
VITE_API_URL=https://your-api.onrender.com
```

2. Restart dev server: `npm run dev`

The app will use your API instead of mock data.

## Expected API Endpoints

When integrating, your backend should implement these endpoints:

### Patient
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/appointments` | List appointments |
| GET | `/api/patient/stats` | Dashboard stats |
| GET | `/api/patient/health` | Health snapshot |
| GET | `/api/patient/consultations?search=` | Consultation history |
| GET | `/api/patient/consultations/stats` | Consultation stats |
| GET | `/api/patient/prescriptions` | Prescriptions list |

### Booking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors?specialty=` | List doctors |
| GET | `/api/doctors/:id/slots?date=` | Available slot numbers (1, 2, 3...) |
| POST | `/api/appointments` | Create appointment |

### Doctor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/appointments` | Today's appointments |
| GET | `/api/doctor/stats` | Dashboard stats |
| GET | `/api/doctor/traffic` | Patient traffic data |
| GET | `/api/doctor/patients?search=` | Patient list |
| POST | `/api/doctor/prescriptions` | Create prescription (body: patientId, medication, dosage, frequency, instructions?, refills?, expiresIn?) |

## Response Shapes

See `src/api/mockData.js` and `src/api/services.js` for the expected request/response structures. Services are in `src/api/services.js` – update the `fetchApi` calls when your API format differs.
