package com.ticketez_backend_springboot.auth.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.auth.models.SecurityAccount;
import com.ticketez_backend_springboot.auth.models.RefreshToken;



@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByAccount(SecurityAccount account);
}
