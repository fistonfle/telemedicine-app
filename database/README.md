## Telemedicine database foundation

This folder contains the base PostgreSQL schema for the telemedicine app.

### Migration files

- `migrations/001_initial_schema.sql`
  - Creates the core tables:
    - `users`
    - `profiles`
    - `doctor_schedules`
    - `appointments`
    - `consultations`
  - Adds enum types for:
    - `profile_role`: `DOCTOR`, `PATIENT`, `ADMIN`
    - `appointment_status`: `PENDING`, `APPROVED`, `COMPLETED`, `CANCELLED`
  - Enforces integrity via:
    - foreign keys
    - role-aware checks
    - scheduling constraints
    - audit timestamps (`created_at`, `updated_at`)
    - triggers for cross-table validation

### Why this structure

- `users` is exclusively for authentication/security.
- `profiles` stores person data and role context.
- `doctor_schedules` captures doctor availability windows.
- `appointments` maps patient bookings into schedule slots.
- `consultations` stores clinical outcomes tied to a completed appointment.

### Apply migration manually

```bash
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
```

### Recommended API mapping (later)

- `users` and login logic should be handled behind an auth service layer.
- Any write to `doctor_schedules` should require role `DOCTOR`.
- Any write to `appointments` should require role `PATIENT`.
- Consultation creation should occur only after appointment completion.
