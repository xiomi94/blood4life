CREATE TABLE campaign
(
  id                      INT PRIMARY KEY AUTO_INCREMENT,
  hospital_id             INT         NOT NULL,
  name                    VARCHAR(255),
  description             VARCHAR(500),
  start_date              DATE,
  end_date                DATE,
  location                VARCHAR(255),
  required_donor_quantity INT         NOT NULL,
  required_blood_type     VARCHAR(50) NOT NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospital (id)
);
