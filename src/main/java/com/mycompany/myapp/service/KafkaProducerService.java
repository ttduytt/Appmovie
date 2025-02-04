package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.event.dto.NotificationEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEmailEvent(String email, String username) {
        NotificationEvent notificationEvent = NotificationEvent.builder()
            .chanel("EMAIL")
            .recipient(email)
            .subject("Welcome to movie")
            .body("hello, " + username)
            .build();
        kafkaTemplate.send("email_topic", notificationEvent);
    }
}
