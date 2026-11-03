package com.tutor.eclass.auth;

import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tutor.eclass.mail.PasswordResetMailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final PasswordResetMailService passwordResetMailService;

    public PasswordResetController(
            PasswordResetService passwordResetService,
            PasswordResetMailService passwordResetMailService) {

        this.passwordResetService = passwordResetService;
        this.passwordResetMailService = passwordResetMailService;
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        var prepared = passwordResetService.preparePasswordReset(request);

        if (prepared.isEmpty()) {
            return;
        }

        PreparedPasswordReset reset = prepared.get();

        try {
            passwordResetMailService.sendPasswordReset(
                reset.recipientEmail(),
                reset.fullName(),
                reset.resetUrl()
            );
        } catch (MailException exception) {
            // Η απάντηση παραμένει ίδια και σε αποτυχία αποστολής,
            // ώστε να μην αποκαλύπτεται αν υπάρχει ο λογαριασμός.
        }
    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(request);
    }
}