# telemedicine-app

Clean starter foundation for a telemedicine platform focused on:

- secure authentication data separation
- role-aware profile management
- doctor scheduling and patient appointments
- consultation records linked to completed appointments

## Current status

The database foundation is implemented in PostgreSQL migration files.

- Migration: `database/migrations/001_initial_schema.sql`
- Database notes: `database/README.md`
- Architecture notes: `docs/architecture.md`

## Core entities

1. `users`
2. `profiles`
3. `doctor_schedules`
4. `appointments`
5. `consultations`

## Next implementation phases

1. Add backend API modules and DTO validation.
2. Add authentication and authorization middleware.
3. Implement page designs you provide.
4. Integrate your real APIs and end-to-end booking flow.
=======
Frontend starter configured with:

- Vite
- React
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```
