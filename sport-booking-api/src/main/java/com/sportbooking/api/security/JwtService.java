package com.sportbooking.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import com.sportbooking.api.entity.user.User;

import org.springframework.beans.factory.annotation.Value;
import java.util.Date;
import java.security.Key;

@Service
public class JwtService {

    @Value("${application.jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${application.jwt.expiration}")
    private long EXPIRATION;

    @Value("${application.jwt.refresh-expiration:604800000}")
    private long REFRESH_EXPIRATION;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("type", "access")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact();
    }

    /** Refresh token: thời hạn dài hơn, chỉ dùng để cấp lại access token. */
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId())
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact();
    }

    public String extractType(String token) {
        return (String) getClaims(token).get("type");
    }

    /** Token hợp lệ + đúng loại refresh + chưa hết hạn. */
    public boolean isRefreshTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return "refresh".equals(claims.get("type"))
                    && !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    public String extractEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    public boolean isTokenValid(String token) {
        try {
            return !getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}