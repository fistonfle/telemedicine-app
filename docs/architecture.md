# Telemedicine app architecture (phase 0)

This repository now starts from a clean, production-minded data model and is ready for API and UI layers.

## Domain model

1. **users** (authentication)
   - credentials and account lock-state
2. **profiles** (identity and role context)
   - patient, doctor, admin data
3. **doctor_schedules** (availability)
   - time windows per weekday and daily capacity
4. **appointments** (bookings)
   - schedule slot + patient + lifecycle status
5. **consultations** (clinical outcome)
   - diagnosis and notes after completed appointment

## Suggested backend module boundaries

- `auth`
  - signup/signin
  - password hashing
  - account enable/disable and login attempt policy
- `profiles`
  - role-aware profile CRUD
- `scheduling`
  - doctor schedule CRUD
  - availability checks
- `appointments`
  - booking and status transitions
- `consultations`
  - create/read consultation records

## Suggested appointment state machine

- `PENDING` -> `APPROVED` -> `COMPLETED`
- `PENDING` -> `CANCELLED`
- `APPROVED` -> `CANCELLED`

Recommended guardrails in service layer:

- only doctor/admin can approve or complete appointment
- only patient/doctor/admin can cancel under policy rules
- consultation can only be created for `COMPLETED` appointments

## Suggested API-first practices for next phase

- versioned routes: `/api/v1/...`
- explicit DTO validation for all inputs
- structured error schema:
  - `code`
  - `message`
  - `details`
- pagination for list endpoints
- idempotency for sensitive writes when needed
- centralized audit logging for state changes

## Frontend design readiness

When you provide page designs, keep these UI forms aligned to tables:

- signup/login -> `users`
- patient/doctor profile completion -> `profiles`
- doctor availability setup -> `doctor_schedules`
- patient booking flow -> `appointments`
- doctor consultation form -> `consultations`

This mapping keeps UI, API, and DB aligned from the beginning.
