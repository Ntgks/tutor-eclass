package com.tutor.eclass.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class InvitationMailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public InvitationMailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress) {

        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendInvitation(
            String recipientEmail,
            String fullName,
            String activationUrl) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setTo(recipientEmail);
        message.setSubject("Πρόσκληση στο Tutor eClass");

        message.setText("""
            Γεια σου %s,

            Έχει δημιουργηθεί ένας λογαριασμός για εσένα στο Tutor eClass.

            Για να ενεργοποιήσεις τον λογαριασμό σου και να ορίσεις
            τον προσωπικό σου κωδικό, άνοιξε τον παρακάτω σύνδεσμο:

            %s

            Ο σύνδεσμος ισχύει για 24 ώρες.

            Αν δεν περίμενες αυτή την πρόσκληση, μπορείς να αγνοήσεις
            αυτό το μήνυμα.

            Tutor eClass
            """.formatted(fullName, activationUrl));

        mailSender.send(message);
    }
}