package sp.releasetestbackend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
public class JwtTokenService {
    
    @Value("${jwt.secret-key:your-default-secret-key-change-this-in-production}")
    private String secretKey;
    
    @Value("${jwt.expiration:86400000}") // 24시간 (밀리초)
    private long expiration;
    
    public String generateToken(Long accountId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(accountId.toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
    
    public Long getAccountIdFromToken(String token) {
        try {
            System.out.println("JWT 파싱 시도 중, 토큰: " + token);
            System.out.println("사용할 secretKey: " + secretKey);
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            String subject = claims.getSubject();
            System.out.println("토큰에서 추출한 subject: " + subject);
            
            return Long.parseLong(subject);
        } catch (Exception e) {
            System.out.println("JWT 파싱 실패: " + e.getMessage());
            e.printStackTrace();
            log.error("Failed to parse JWT token: {}", e.getMessage(), e);
            return null;
        }
    }
    
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.debug("JWT token validation failed: {}", e.getMessage());
            return false;
        }
    }
    
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}