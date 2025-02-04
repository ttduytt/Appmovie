package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.EmailMessage;
import com.mycompany.myapp.service.dto.event.dto.NotificationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    private final MailService mailService;

    public KafkaConsumerService(MailService mailService) {
        this.mailService = mailService;
    }

    @KafkaListener(topics = "email_topic", groupId = "email-consumer-group")
    public void consumeEmailEvent(NotificationEvent message) {
        mailService.sendEmail(message.getRecipient(), message.getSubject(), message.getBody(), false, false);
    }
    //    private void sendEmail(String to, String subject, String content) {
    //        SimpleMailMessage message = new SimpleMailMessage();
    //        message.setTo(to);
    //        message.setSubject(subject);
    //        message.setText(content);
    //        mailSender.send(message);
    //        System.out.println("Email sent to " + to);
    //    }
}
