BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_role') THEN
        CREATE TYPE profile_role AS ENUM ('DOCTOR', 'PATIENT', 'ADMIN');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    login_attempts SMALLINT NOT NULL DEFAULT 0 CHECK (login_attempts >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_password_hash_length CHECK (char_length(password) >= 60)
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    names VARCHAR(150) NOT NULL,
    address TEXT,
    phone VARCHAR(30),
    id_number VARCHAR(80),
    role profile_role NOT NULL,
    specialty VARCHAR(120),
    license_number VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_profiles_doctor_fields
    CHECK (
        (role = 'DOCTOR' AND specialty IS NOT NULL AND license_number IS NOT NULL)
        OR
        (role <> 'DOCTOR' AND specialty IS NULL AND license_number IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_patients_per_day INTEGER NOT NULL CHECK (max_patients_per_day > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_schedule_time_window CHECK (start_time < end_time),
    CONSTRAINT uq_doctor_schedule_window UNIQUE (doctor_id, day_of_week, start_time, end_time)
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES doctor_schedules(id) ON DELETE RESTRICT,
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_number INTEGER NOT NULL CHECK (appointment_number > 0),
    status appointment_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_schedule_daily_slot UNIQUE (schedule_id, appointment_date, appointment_number)
);

CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_id_number
    ON profiles (id_number)
    WHERE id_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_license_number
    ON profiles (license_number)
    WHERE license_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_day ON doctor_schedules(doctor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_schedule_date ON appointments(schedule_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_consultations_appointment ON consultations(appointment_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION validate_doctor_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    selected_role profile_role;
BEGIN
    SELECT role INTO selected_role
    FROM profiles
    WHERE id = NEW.doctor_id;

    IF selected_role IS NULL THEN
        RAISE EXCEPTION 'Doctor profile % does not exist', NEW.doctor_id;
    END IF;

    IF selected_role <> 'DOCTOR' THEN
        RAISE EXCEPTION 'Profile % must have role DOCTOR', NEW.doctor_id;
    END IF;

    RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION validate_appointment_patient_and_schedule()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    selected_role profile_role;
    selected_day SMALLINT;
    daily_limit INTEGER;
BEGIN
    SELECT role INTO selected_role
    FROM profiles
    WHERE id = NEW.patient_id;

    IF selected_role IS NULL THEN
        RAISE EXCEPTION 'Patient profile % does not exist', NEW.patient_id;
    END IF;

    IF selected_role <> 'PATIENT' THEN
        RAISE EXCEPTION 'Profile % must have role PATIENT', NEW.patient_id;
    END IF;

    SELECT day_of_week, max_patients_per_day
    INTO selected_day, daily_limit
    FROM doctor_schedules
    WHERE id = NEW.schedule_id;

    IF selected_day IS NULL THEN
        RAISE EXCEPTION 'Doctor schedule % does not exist', NEW.schedule_id;
    END IF;

    IF EXTRACT(DOW FROM NEW.appointment_date)::SMALLINT <> selected_day THEN
        RAISE EXCEPTION
            'Appointment date % does not match schedule day_of_week %',
            NEW.appointment_date,
            selected_day;
    END IF;

    IF NEW.appointment_number > daily_limit THEN
        RAISE EXCEPTION
            'Appointment number % exceeds max_patients_per_day %',
            NEW.appointment_number,
            daily_limit;
    END IF;

    RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION validate_consultation_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    appointment_state appointment_status;
BEGIN
    SELECT status INTO appointment_state
    FROM appointments
    WHERE id = NEW.appointment_id;

    IF appointment_state IS NULL THEN
        RAISE EXCEPTION 'Appointment % does not exist', NEW.appointment_id;
    END IF;

    IF appointment_state <> 'COMPLETED' THEN
        RAISE EXCEPTION
            'Consultation requires COMPLETED appointment. Current status: %',
            appointment_state;
    END IF;

    RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_doctor_schedules_updated_at ON doctor_schedules;
CREATE TRIGGER trg_doctor_schedules_updated_at
BEFORE UPDATE ON doctor_schedules
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON appointments;
CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_consultations_updated_at ON consultations;
CREATE TRIGGER trg_consultations_updated_at
BEFORE UPDATE ON consultations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_validate_doctor_profile ON doctor_schedules;
CREATE TRIGGER trg_validate_doctor_profile
BEFORE INSERT OR UPDATE ON doctor_schedules
FOR EACH ROW
EXECUTE FUNCTION validate_doctor_profile();

DROP TRIGGER IF EXISTS trg_validate_appointment_rules ON appointments;
CREATE TRIGGER trg_validate_appointment_rules
BEFORE INSERT OR UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION validate_appointment_patient_and_schedule();

DROP TRIGGER IF EXISTS trg_validate_consultation_appointment ON consultations;
CREATE TRIGGER trg_validate_consultation_appointment
BEFORE INSERT OR UPDATE ON consultations
FOR EACH ROW
EXECUTE FUNCTION validate_consultation_appointment();

COMMIT;
