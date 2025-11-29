CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    blood_donor_id INT,
    hospital_id INT,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    notification_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notification_blood_donor
        FOREIGN KEY (blood_donor_id)
        REFERENCES blood_donor(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_notification_hospital
        FOREIGN KEY (hospital_id)
        REFERENCES hospital(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
