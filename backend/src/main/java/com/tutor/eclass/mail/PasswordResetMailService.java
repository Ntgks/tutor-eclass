package com.tutor.eclass.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetMailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public PasswordResetMailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress) {

        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendPasswordReset(
            String recipientEmail,
            String fullName,
            String resetUrl) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setTo(recipientEmail);
        message.setSubject("Επαναφορά κωδικού — Tutor eClass");

        message.setText("""
            Γεια σου %s,

            Λάβαμε ένα αίτημα επαναφοράς του κωδικού σου στο Tutor eClass.

            Για να ορίσεις νέο κωδικό, άνοιξε τον παρακάτω σύνδεσμο:

            %s

            Ο σύνδεσμος ισχύει για 30 λεπτά και χρησιμοποιείται μία φορά.

            Αν δεν ζήτησες επαναφορά, αγνόησε αυτό το μήνυμα.
            Ο κωδικός σου δεν έχει αλλάξει.

            Tutor eClass
            """.formatted(fullName, resetUrl));

        mailSender.send(message);
    }
}