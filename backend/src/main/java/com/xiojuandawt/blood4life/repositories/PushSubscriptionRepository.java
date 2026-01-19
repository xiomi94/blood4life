package com.xiojuandawt.blood4life.repositories;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    Optional<PushSubscription> findByEndpoint(String endpoint);

    List<PushSubscription> findByDonor(BloodDonor donor);

    List<PushSubscription> findByHospital(Hospital hospital);

    void deleteByEndpoint(String endpoint);
}
