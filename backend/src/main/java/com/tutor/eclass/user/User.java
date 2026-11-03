package com.tutor.eclass.user;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "users")
public class User {
    
    @Id 
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 320)
    private String email;

    @Column(name = "password_hash",length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "education_level", length = 100)
    private String educationLevel;

    @Column(name = "created_at", nullable = false,
        insertable = false, updatable = false)
    private Instant createdAt;

    protected User(){
    }

    public static User createInvitedStudent(
        String fullName,
        String email,
        String educationLevel){
            User user = new User();
            user.id = UUID.randomUUID();
            user.fullName = fullName;
            user.email = email;
            user.educationLevel = educationLevel;
            user.role = Role.STUDENT;
            user.status = UserStatus.INVITED;

            return user;
        }

    public static User createTeacher(
        String fullName,
        String email,
        String passwordHash){
            User user = new User();
            user.id = UUID.randomUUID();
            user.fullName = fullName;
            user.email = email;
            user.passwordHash = passwordHash;
            user.role = Role.TEACHER;
            user.status = UserStatus.ACTIVE;

            return user;
        }

    public UUID getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail(){
        return email;
    }

    public Role getRole(){
        return role;
    }

    public UserStatus getStatus(){
        return status;
    }

    public String getEducationLevel(){
        return educationLevel;
    }

    public Instant getCreatedAt(){
        return createdAt;
    }

    String getPasswordHash(){
        return passwordHash;
    }

    public void activate(String passwordHash){
        if(role != Role.STUDENT || status != UserStatus.INVITED){
            throw new IllegalStateException(
                "Ο λογαριασμός δεν μπορεί να ενεργοποιηθεί"
            );
        }

        if(passwordHash == null || passwordHash.isBlank()){
            throw new IllegalArgumentException(
                "Απαιτείται password hash"
            );
        }

        this.passwordHash = passwordHash;
        this.status = UserStatus.ACTIVE;
    }

    public void updateStudentDetails(
        String fullName,
        String email,
        String educationLevel){
            if(role != Role.STUDENT){
                throw new IllegalStateException(
                    "Η αλλαγή αφορά μόνο λογαριασμό μαθητή"
                );
            }

            this.fullName = fullName;
            this.email = email;
            this.educationLevel =educationLevel;
    }

    public void disableStudent(){
        if (role != Role.STUDENT){
            throw new IllegalStateException(
                "Η απενεργοποίηση αφορά μόνο λογαριασμό μαθητή"
            );
        }

        this.status = UserStatus.DISABLED;
    }

    public void enableStudent(){
        if(role != Role.STUDENT || status != UserStatus.DISABLED){
            throw new IllegalStateException(
                "Η επανενεργοποίηση αφορά μόνο απενεργοποιημένο μαθητή"
            );
        }

        this.status = passwordHash == null || passwordHash.isBlank()
            ? UserStatus.INVITED
            : UserStatus.ACTIVE;
    }

    public void changePassword(String passwordHash){
        if (status != UserStatus.ACTIVE){
            throw new IllegalStateException(
                "Η αλλαγή κωδικού απαιτεί ενεργό λογαριασμό"
            );
        }

        if(passwordHash == null || passwordHash.isBlank()){
            throw new IllegalArgumentException(
                "Απαιτείται password hash"
            );
        }

        this.passwordHash = passwordHash;
    }
}
