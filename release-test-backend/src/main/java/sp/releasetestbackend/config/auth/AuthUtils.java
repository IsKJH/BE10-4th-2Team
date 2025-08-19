package sp.releasetestbackend.config.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import sp.releasetestbackend.jwt.JwtTokenService;

@Component // 이 클래스를 스프링 빈으로 등록
@RequiredArgsConstructor
public class AuthUtils {
    private final JwtTokenService jwtTokenService;

    /**
     * "Bearer <token>" 형식의 헤더에서 순수 토큰을 추출하고 사용자 ID를 반환하는 헬퍼 메서드
     * @param authorizationHeader HTTP 요청의 Authorization 헤더 값
     * @return 사용자 ID
     */
    public Long getAccountIdFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효하지 않은 인증 헤더입니다.");
        }
        String token = authorizationHeader.substring(7); // "Bearer " 부분(7글자)을 잘라냄
        return jwtTokenService.getAccountIdFromToken(token);
    }
}

