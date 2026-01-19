package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "push_subscriptions")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String endpoint;

    @Column(columnDefinition = "TEXT")
    private String p256dh;

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

    public PushSubscription(String endpoint, String p256dh, String auth) {
        this.endpoint = endpoint;
        this.p256dh = p256dh;
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

    public String getP256dh() {
        return p256dh;
    }

    public void setP256dh(String p256dh) {
        this.p256dh = p256dh;
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
}
