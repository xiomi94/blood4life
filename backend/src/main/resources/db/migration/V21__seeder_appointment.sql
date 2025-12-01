-- 1. Insert Campaigns (linked to existing Hospitals)
-- Assuming Hospital IDs 1, 2, 3 exist from V4__seed_hospital.sql

INSERT INTO campaign (hospital_id, name, description, start_date, end_date, location, required_donor_quantity, required_blood_type) VALUES
(1, 'Campaña Invierno 2025', 'Donación de sangre en invierno', '2025-01-01', '2025-03-31', 'Madrid Centro', 100, 'A+'),
(1, 'Campaña Primavera 2025', 'Donación de sangre en primavera', '2025-04-01', '2025-06-30', 'Madrid Norte', 120, 'O+'),
(2, 'Campaña Verano 2025', 'Donación de sangre en verano', '2025-06-01', '2025-09-30', 'Sevilla Norte', 150, 'O-'),
(2, 'Campaña Otoño 2025', 'Donación de sangre en otoño', '2025-10-01', '2025-12-15', 'Sevilla Este', 130, 'B+'),
(3, 'Campaña Anual 2025', 'Campaña general 2025', '2025-01-01', '2025-12-31', 'Barcelona Sur', 500, 'Universal'),
(3, 'Campaña Especial 2026', 'Campaña especial año nuevo', '2026-01-01', '2026-06-30', 'Barcelona Centro', 200, 'AB-');

-- 2. Alter Appointment Table
-- Add campaign_id column
ALTER TABLE appointment ADD COLUMN campaign_id INT;

-- Update existing appointments (if any) to point to the first campaign to avoid nulls
UPDATE appointment SET campaign_id = 1 WHERE campaign_id IS NULL;

-- Add Foreign Key to campaign
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id);

-- Drop Foreign Key to hospital and the column itself
ALTER TABLE appointment DROP FOREIGN KEY fk_appointment_hospital;
ALTER TABLE appointment DROP COLUMN hospital_id;

-- Make campaign_id NOT NULL
ALTER TABLE appointment MODIFY COLUMN campaign_id INT NOT NULL;

-- 3. Seed Appointments (Random dates in 2025 and 2026)
-- Statuses: 1=PENDING, 2=CONFIRMED, 3=COMPLETED, 4=CANCELLED, 5=NO_SHOW
-- Donors: 1, 2, 3, 4
-- Campaigns: 1, 2, 3, 4, 5, 6

INSERT INTO appointment (appointment_status_id, campaign_id, blood_donor_id, hospital_comment, date_appointment, hour_appointment) VALUES
-- January 2025
(3, 1, 1, 'Todo correcto', '2025-01-10', '09:00:00'),
(3, 1, 2, 'Donación exitosa', '2025-01-12', '10:30:00'),
(4, 3, 3, 'Cancelada por gripe', '2025-01-15', '11:00:00'),
(3, 5, 4, 'Sin incidencias', '2025-01-20', '16:00:00'),
(3, 1, 1, 'Segunda donación', '2025-01-25', '09:30:00'),

-- February 2025
(3, 1, 2, 'Bien', '2025-02-05', '10:00:00'),
(5, 3, 3, 'No apareció', '2025-02-14', '12:00:00'),
(3, 5, 4, 'Muy rápido', '2025-02-28', '17:00:00'),

-- March 2025
(3, 1, 1, 'Ok', '2025-03-10', '09:00:00'),
(3, 1, 2, 'Ok', '2025-03-15', '11:00:00'),

-- April 2025
(3, 2, 3, 'Inicio primavera', '2025-04-02', '10:00:00'),
(3, 2, 4, 'Todo bien', '2025-04-20', '13:00:00'),

-- May 2025
(3, 5, 1, 'Donación regular', '2025-05-05', '09:00:00'),
(4, 2, 2, 'Cancelada', '2025-05-15', '10:00:00'),

-- June 2025
(3, 2, 3, 'Verano inicio', '2025-06-10', '11:00:00'),
(3, 3, 4, 'Calor pero bien', '2025-06-25', '12:00:00'),

-- July 2025
(3, 3, 1, 'Vacaciones', '2025-07-05', '09:00:00'),
(3, 3, 2, 'Todo ok', '2025-07-20', '10:00:00'),

-- August 2025
(5, 3, 3, 'Ausente', '2025-08-10', '11:00:00'),
(3, 3, 4, 'Bien', '2025-08-15', '12:00:00'),

-- September 2025
(3, 3, 1, 'Vuelta al cole', '2025-09-05', '09:00:00'),
(3, 4, 2, 'Otoño cerca', '2025-09-25', '16:00:00'),

-- October 2025
(3, 4, 3, 'Octubre rojo', '2025-10-10', '10:00:00'),
(3, 5, 4, 'Bien', '2025-10-31', '11:00:00'),

-- November 2025
(3, 4, 1, 'Noviembre', '2025-11-15', '09:00:00'),
(3, 5, 2, 'Frio', '2025-11-20', '10:00:00'),

-- December 2025
(3, 4, 3, 'Navidad', '2025-12-05', '11:00:00'),
(3, 5, 4, 'Fin de año', '2025-12-24', '09:00:00'),

-- 2026 Data
(1, 6, 1, 'Enero 2026', '2026-01-10', '10:00:00'),
(2, 6, 2, 'Febrero 2026', '2026-02-15', '11:00:00'),
(1, 6, 3, 'Marzo 2026', '2026-03-20', '12:00:00'),
(2, 6, 4, 'Abril 2026', '2026-04-25', '13:00:00'),
(1, 5, 1, 'Mayo 2026', '2026-05-05', '09:00:00'),
(2, 5, 2, 'Junio 2026', '2026-06-10', '10:00:00');
