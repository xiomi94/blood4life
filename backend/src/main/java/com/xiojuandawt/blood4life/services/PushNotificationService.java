package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.PushSubscription;
import com.xiojuandawt.blood4life.repositories.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class PushNotificationService {

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    @Value("${vapid.subject}")
    private String subject;

    private PushService pushService;

    private final PushSubscriptionRepository subscriptionRepository;

    public PushNotificationService(PushSubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostConstruct
    private void init() throws GeneralSecurityException {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        pushService = new PushService(publicKey, privateKey, subject);
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void subscribe(Subscription subscription, BloodDonor donor, Hospital hospital) {
        if (subscriptionRepository.findByEndpoint(subscription.endpoint).isPresent()) {
            return;
        }

        PushSubscription entity = new PushSubscription();
        entity.setEndpoint(subscription.endpoint);
        entity.setP256dh(subscription.keys.p256dh);
        entity.setAuth(subscription.keys.auth);
        entity.setDonor(donor);
        entity.setHospital(hospital);
        subscriptionRepository.save(entity);
    }

    public void unsubscribe(String endpoint) {
        subscriptionRepository.deleteByEndpoint(endpoint);
    }

    @Async
    public void sendPushNotification(BloodDonor donor, String message) {
        List<PushSubscription> subs = subscriptionRepository.findByDonor(donor);
        sendToSubscriptions(subs, message);
    }

    @Async
    public void sendPushNotification(Hospital hospital, String message) {
        List<PushSubscription> subs = subscriptionRepository.findByHospital(hospital);
        sendToSubscriptions(subs, message);
    }

    private void sendToSubscriptions(List<PushSubscription> subs, String messageJson) {
        for (PushSubscription sub : subs) {
            try {
                Subscription webPushSub = new Subscription(sub.getEndpoint(),
                        new Subscription.Keys(sub.getP256dh(), sub.getAuth()));

                // Extract only the title part (before the "|" separator) for push notifications
                String titleOnly = messageJson;
                if (messageJson.contains("|")) {
                    titleOnly = messageJson.substring(0, messageJson.indexOf("|"));
                }

                // Create JSON payload with clean title
                String payload = String.format("{\"message\": \"%s\"}", titleOnly.replace("\"", "\\\""));
                Notification notification = new Notification(webPushSub, payload);
                pushService.send(notification);
            } catch (Exception e) {
                System.err.println("Failed to send push: " + e.getMessage());
                // Simple error handling, ideally check for 410 to delete
                if (e.getMessage().contains("410") || e.getMessage().contains("404")) {
                    subscriptionRepository.delete(sub);
                }
            }
        }
    }
}
