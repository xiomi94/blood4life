CREATE TABLE push_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    donor_id INT,
    hospital_id INT,
    FOREIGN KEY (donor_id) REFERENCES blood_donor(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospital(id) ON DELETE CASCADE
);
