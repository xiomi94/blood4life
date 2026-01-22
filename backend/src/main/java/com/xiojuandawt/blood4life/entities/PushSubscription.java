package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

/**
 * Represents a Web Push subscription for receiving push notifications.
 * 
 * <p>
 * <strong>Integrity Constraint (XOR):</strong>
 * </p>
 * <ul>
 * <li>A subscription must belong to <strong>exactly one owner</strong>: either
 * a {@link BloodDonor} OR a {@link Hospital}</li>
 * <li>It cannot belong to both simultaneously</li>
 * <li>It cannot exist without an owner</li>
 * </ul>
 * 
 * <p>
 * This constraint is enforced at two levels:
 * </p>
 * <ul>
 * <li><strong>Application level:</strong> {@link #validateOwnership()} method
 * called on persist/update</li>
 * <li><strong>Database level:</strong> CHECK constraint in the database
 * schema</li>
 * </ul>
 * 
 * @see BloodDonor
 * @see Hospital
 */
@Entity
@Table(name = "push_subscriptions")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String endpoint;

    @Column(name = "encryption_key", columnDefinition = "TEXT")
    private String encryptionKey;

    @Column(columnDefinition = "TEXT")
    private String auth;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private BloodDonor donor;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    public PushSubscription() {
    }

    public PushSubscription(String endpoint, String encryptionKey, String auth) {
        this.endpoint = endpoint;
        this.encryptionKey = encryptionKey;
        this.auth = auth;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getEncryptionKey() {
        return encryptionKey;
    }

    public void setEncryptionKey(String encryptionKey) {
        this.encryptionKey = encryptionKey;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public BloodDonor getDonor() {
        return donor;
    }

    public void setDonor(BloodDonor donor) {
        this.donor = donor;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    /**
     * Validates that a subscription belongs to exactly one owner (donor XOR
     * hospital).
     * This method is called before persisting or updating the entity.
     * 
     * @throws IllegalStateException if both donor and hospital are set, or if
     *                               neither is set
     */
    @PrePersist
    @PreUpdate
    private void validateOwnership() {
        boolean hasDonor = (donor != null);
        boolean hasHospital = (hospital != null);

        if (hasDonor && hasHospital) {
            throw new IllegalStateException(
                    "Una suscripción push no puede pertenecer simultáneamente a un donante y a un hospital. " +
                            "Debe pertenecer exclusivamente a uno de ellos.");
        }

        if (!hasDonor && !hasHospital) {
            throw new IllegalStateException(
                    "Una suscripción push debe pertenecer a un donante o a un hospital. " +
                            "No puede existir una suscripción sin propietario.");
        }
    }
}
