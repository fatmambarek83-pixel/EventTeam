package com.eventteam.service;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    public void sendRHCredentials(String toEmail, String name, String rawPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre compte Responsable RH — Event-Team");
        message.setText(
                "Bonjour " + name + ",\n\n" +
                        "Un compte Responsable RH vient d'être créé pour vous sur Event-Team.\n\n" +
                        "Email : " + toEmail + "\n" +
                        "Mot de passe : " + rawPassword + "\n\n" +
                        "Merci de vous connecter et de changer votre mot de passe dès que possible.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);
    }
    public void sendAccountValidated(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre compte a été validé — Event-Team");
        message.setText(
                "Bonjour " + name + ",\n\n" +
                        "Votre compte a été validé par le Responsable RH. " +
                        "Vous pouvez désormais vous connecter avec l'email et le mot de passe utilisés lors de votre inscription.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);
    }
    public void sendAccountRejected(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre demande d'inscription — Event-Team");
        message.setText(
                "Bonjour " + name + ",\n\n" +
                        "Votre demande d'inscription sur Event-Team a été refusée par le Responsable RH.\n\n" +
                        "Pour plus d'informations, contactez votre service RH.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);

    }
    public void sendPasswordResetEmail(String toEmail, String name, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe — Event-Team");
        message.setText(
                "Bonjour" + (name != null && !name.isBlank() ? " " + name : "") + ",\n\n" +
                        "Vous avez demandé la réinitialisation de votre mot de passe sur Event-Team.\n\n" +
                        "Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe. " +
                        "Ce lien est valable 1 heure :\n\n" +
                        resetLink + "\n\n" +
                        "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email, " +
                        "votre mot de passe restera inchangé.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);
    }
    public void sendParticipationAccepted(String toEmail, String name, String eventName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre participation a été acceptée — Event-Team");
        message.setText(
                "Bonjour " + name + ",\n\n" +
                        "Bonne nouvelle ! Votre demande de participation à l'événement \"" + eventName + "\" a été acceptée par le Responsable RH.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);
    }
    public void sendParticipationRefused(String toEmail, String name, String eventName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre participation a été refusée — Event-Team");
        message.setText(
                "Bonjour " + name + ",\n\n" +
                        "Votre demande de participation à l'événement \"" + eventName + "\" a été refusée par le Responsable RH.\n\n" +
                        "Votre compte a été suspendu et vous ne pourrez plus vous connecter à Event-Team. " +
                        "Pour plus d'informations, contactez votre service RH.\n\n" +
                        "L'équipe Event-Team"
        );
        mailSender.send(message);
    }
}