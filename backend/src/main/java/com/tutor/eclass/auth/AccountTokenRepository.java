package com.tutor.eclass.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface AccountTokenRepository 
    extends JpaRepository<AccountToken, UUID>{
        Optional<AccountToken> findByTokenHash(String tokenHash);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT t FROM AccountToken t WHERE t.tokenHash = :tokenHash")
        Optional<AccountToken> findByTokenHashForUpdate(
            @Param("tokenHash") String tokenHash
        );
}