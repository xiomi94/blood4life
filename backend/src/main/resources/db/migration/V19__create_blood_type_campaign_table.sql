CREATE TABLE IF NOT EXISTS blood_type_campaign
(
  blood_type INT NOT NULL,
  campaign   INT NOT NULL,

  PRIMARY KEY (blood_type, campaign),

  CONSTRAINT fk_btc_blood_type
    FOREIGN KEY (blood_type) REFERENCES blood_type (id)
      ON DELETE CASCADE,

  CONSTRAINT fk_btc_campaign
    FOREIGN KEY (campaign) REFERENCES campaign (id)
      ON DELETE CASCADE
);
