package com.tutor.eclass.auth;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "account_tokens")
public class AccountToken {
    
    @Id 
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 20)
    private TokenPurpose purpose;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "created_at", nullable = false,
        insertable = false, updatable = false)
    private Instant createdAt;

    protected AccountToken(){
    }

    public static AccountToken createInvitation(
        UUID userId,
        String tokenHash,
        Instant expiresAt){
            AccountToken token = new AccountToken();
            token.id = UUID.randomUUID();
            token.userId = userId;
            token.tokenHash = tokenHash;
            token.purpose = TokenPurpose.INVITATION;
            token.expiresAt = expiresAt;

            return token;
    }

    public static AccountToken createPasswordReset(
        UUID userId,
        String tokenHash,
        Instant expiresAt){

            AccountToken token = new AccountToken();
            token.id = UUID.randomUUID();
            token.userId = userId;
            token.tokenHash = tokenHash;
            token.purpose = TokenPurpose.PASSWORD_RESET;
            token.expiresAt = expiresAt;

            return token;
    }

    public UUID getUserId(){
        return userId;
    }

    public TokenPurpose getPurpose(){
        return purpose;
    }

    public boolean isUsableAt(Instant now){
        return usedAt == null && now.isBefore(expiresAt);
    }

    public void markUsedAt(Instant now){
        if(!isUsableAt(now)){
            throw new IllegalStateException(
                "Το token έχει λήξει ή έχει ήδη χρησιμοποιηθεί"
            );
        }

        this.usedAt = now;
    }
}
