CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    appointment_status_id BIGINT NOT NULL,
    blood_donor_id INT NOT NULL,
    hospital_id INT NOT NULL,
    
    hospital_comment VARCHAR(255),
    date_appointment DATE,
    
    CONSTRAINT fk_appointment_status
        FOREIGN KEY (appointment_status_id)
        REFERENCES appointment_status(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_appointment_blood_donor
        FOREIGN KEY (blood_donor_id)
        REFERENCES blood_donor(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_appointment_hospital
        FOREIGN KEY (hospital_id)
        REFERENCES hospital(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
