package com.ticketez_backend_springboot.auth.security.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ticketez_backend_springboot.auth.models.RefreshToken;
import com.ticketez_backend_springboot.auth.repository.AccountRepository;
import com.ticketez_backend_springboot.auth.repository.RefreshTokenRepository;
import com.ticketez_backend_springboot.auth.security.jwt.exception.TokenRefreshException;

import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {
    @Value("${bezkoder.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private AccountRepository dao;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String userId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(dao.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Mã thông báo làm mới đã hết hạn. Vui lòng thực hiện yêu cầu đăng nhập mới");
        }

        return token;
    }

    @Transactional
    public int deleteByAccountId(String userId) {
        return refreshTokenRepository.deleteByAccount(dao.findById(userId).get());
    }
}
