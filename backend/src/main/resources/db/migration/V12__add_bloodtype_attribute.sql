ALTER TABLE blood_donor
  ADD COLUMN blood_type_id INT;

ALTER TABLE blood_donor
  ADD CONSTRAINT fk_blood_donor_blood_type
    FOREIGN KEY (blood_type_id) REFERENCES blood_type (id)
      ON DELETE SET NULL;
