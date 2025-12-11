-- Create log tables with GDPR-compliant timestamps
CREATE TABLE blood_donor_log (
    id INT PRIMARY KEY,
    dni VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    gender VARCHAR(255),
    blood_type_id INT,
    email VARCHAR(255),
    phone_number VARCHAR(255),
    date_of_birth DATE,
    password VARCHAR(255),
    image_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (blood_type_id) REFERENCES blood_type(id),
    FOREIGN KEY (image_id) REFERENCES image(id)
);

CREATE TABLE hospital_log (
    id INT PRIMARY KEY,
    cif VARCHAR(255),
    name VARCHAR(255),
    address VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(255),
    password VARCHAR(255),
    image_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (image_id) REFERENCES image(id)
);

-- Copy existing data to log tables
INSERT INTO blood_donor_log (id, dni, first_name, last_name, gender, blood_type_id, email, phone_number, date_of_birth, password, image_id, created_at)
SELECT id, dni, first_name, last_name, gender, blood_type_id, email, phone_number, date_of_birth, password, image_id, CURRENT_TIMESTAMP
FROM blood_donor;

INSERT INTO hospital_log (id, cif, name, address, email, phone_number, password, image_id, created_at)
SELECT id, cif, name, address, email, phone_number, password, image_id, CURRENT_TIMESTAMP
FROM hospital;

-- Create triggers for blood_donor
DELIMITER $$

CREATE TRIGGER blood_donor_after_insert
AFTER INSERT ON blood_donor
FOR EACH ROW
BEGIN
    INSERT INTO blood_donor_log (id, dni, first_name, last_name, gender, blood_type_id, email, phone_number, date_of_birth, password, image_id, created_at)
    VALUES (NEW.id, NEW.dni, NEW.first_name, NEW.last_name, NEW.gender, NEW.blood_type_id, NEW.email, NEW.phone_number, NEW.date_of_birth, NEW.password, NEW.image_id, CURRENT_TIMESTAMP);
END$$

CREATE TRIGGER blood_donor_after_update
AFTER UPDATE ON blood_donor
FOR EACH ROW
BEGIN
    UPDATE blood_donor_log SET
        dni = NEW.dni,
        first_name = NEW.first_name,
        last_name = NEW.last_name,
        gender = NEW.gender,
        blood_type_id = NEW.blood_type_id,
        email = NEW.email,
        phone_number = NEW.phone_number,
        date_of_birth = NEW.date_of_birth,
        password = NEW.password,
        image_id = NEW.image_id
    WHERE id = NEW.id;
END$$

CREATE TRIGGER blood_donor_before_delete
BEFORE DELETE ON blood_donor
FOR EACH ROW
BEGIN
    UPDATE blood_donor_log SET
        deleted_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END$$

-- Create triggers for hospital
CREATE TRIGGER hospital_after_insert
AFTER INSERT ON hospital
FOR EACH ROW
BEGIN
    INSERT INTO hospital_log (id, cif, name, address, email, phone_number, password, image_id, created_at)
    VALUES (NEW.id, NEW.cif, NEW.name, NEW.address, NEW.email, NEW.phone_number, NEW.password, NEW.image_id, CURRENT_TIMESTAMP);
END$$

CREATE TRIGGER hospital_after_update
AFTER UPDATE ON hospital
FOR EACH ROW
BEGIN
    UPDATE hospital_log SET
        cif = NEW.cif,
        name = NEW.name,
        address = NEW.address,
        email = NEW.email,
        phone_number = NEW.phone_number,
        password = NEW.password,
        image_id = NEW.image_id
    WHERE id = NEW.id;
END$$

CREATE TRIGGER hospital_before_delete
BEFORE DELETE ON hospital
FOR EACH ROW
BEGIN
    UPDATE hospital_log SET
        deleted_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END$$

DELIMITER ;

-- Update foreign keys to point to log tables
ALTER TABLE appointment DROP FOREIGN KEY fk_appointment_blood_donor;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_donor_log FOREIGN KEY (blood_donor_id) REFERENCES blood_donor_log(id);

-- Note: Update other FKs as needed for campaign and other tables referencing hospital
