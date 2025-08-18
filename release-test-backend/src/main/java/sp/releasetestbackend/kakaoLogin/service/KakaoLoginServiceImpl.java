package sp.releasetestbackend.kakaoLogin.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import sp.releasetestbackend.account_profile.repository.AccountProfileRepository;
import sp.releasetestbackend.kakaoLogin.controller.response.KakaoUserInfoResponse;
import sp.releasetestbackend.kakaoLogin.repository.KakaoLoginRepository;
import sp.releasetestbackend.jwt.JwtTokenService;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class KakaoLoginServiceImpl implements KakaoLoginService {
    private final KakaoLoginRepository kakaoLoginRepository;
    private final AccountProfileRepository accountProfileRepository;
    private final JwtTokenService jwtTokenService;

    @Override
    public ResponseEntity<String> getLoginUrl() {
        return ResponseEntity.ok(kakaoLoginRepository.getAccessCode());
    }

    @Override
    public ResponseEntity<KakaoUserInfoResponse> handleLogin(@Nullable String code) {
        if (code == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(kakaoLoginRepository.getAccessCode()))
                    .build();
        } else {
            Map<String, Object> tokenResponse = kakaoLoginRepository.getAccessToken(code);
            if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String token = tokenResponse.get("access_token").toString();

            Map<String, Object> userInfo = kakaoLoginRepository.getUserInfo(token);
            if (userInfo != null) {
                Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
                Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
                if (properties == null || kakaoAccount == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }

                String nickname = (String) properties.get("nickname");
                String email = (String) kakaoAccount.get("email");

                if (nickname == null || email == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }

                Optional<AccountProfile> existAccount = accountProfileRepository.findByEmailAndAccount_LoginType(email, sp.releasetestbackend.account.entity.LoginType.KAKAO);
                if (existAccount.isPresent()) {
                    // 기존 사용자 - JWT 토큰 생성
                    Long accountId = existAccount.get().getAccount().getId();
                    String userToken = jwtTokenService.generateToken(accountId);
                    
                    return ResponseEntity.ok(
                            new KakaoUserInfoResponse(token, userToken, nickname, email, false));
                }
                
                // 신규 사용자 - 카카오 액세스 토큰을 그대로 반환 (회원가입용)
                return ResponseEntity.ok(
                        new KakaoUserInfoResponse(token, token, nickname, email, true));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Override
    public ResponseEntity<String> handleFrontLogin(@Nullable String code) {
        // code가 없으면 카카오 로그인 페이지로 리다이렉트
        if (code == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(kakaoLoginRepository.getAccessCode()))
                    .build();
        }

        // 카카오 액세스 토큰 발급
        Map<String, Object> tokenResponse = kakaoLoginRepository.getAccessToken(code);
        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return createErrorHtml("토큰 발급에 실패했습니다.");
        }

        String token = tokenResponse.get("access_token").toString();

        // 카카오 사용자 정보 조회
        Map<String, Object> userInfo = kakaoLoginRepository.getUserInfo(token);
        if (userInfo == null) {
            return createErrorHtml("사용자 정보를 가져올 수 없습니다.");
        }

        // 사용자 정보 파싱
        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        if (properties == null || kakaoAccount == null) {
            return createErrorHtml("사용자 정보가 올바르지 않습니다.");
        }

        String nickname = (String) properties.get("nickname");
        String email = (String) kakaoAccount.get("email");

        if (nickname == null || email == null) {
            return createErrorHtml("필수 사용자 정보가 누락되었습니다.");
        }

        // 기존 사용자 확인 및 토큰 생성 (카카오 로그인 타입으로만 확인)
        Optional<AccountProfile> existAccount = accountProfileRepository.findByEmailAndAccount_LoginType(email, sp.releasetestbackend.account.entity.LoginType.KAKAO);
        boolean isNewUser = existAccount.isEmpty();
        String userToken = token; // 신규 사용자는 카카오 토큰을 그대로 사용

        if (!isNewUser) {
            // 기존 사용자 - JWT 토큰 생성
            Long accountId = existAccount.get().getAccount().getId();
            userToken = jwtTokenService.generateToken(accountId);
        }

        return createSuccessHtml(token, userToken, nickname, email, isNewUser);
    }

    private ResponseEntity<String> createSuccessHtml(String token, String userToken, String nickname, String email, boolean isNewUser) {
        String htmlResponse = """
                <html>
                  <body>
                    <script>
                      window.opener.postMessage({
                        type: 'KAKAO_LOGIN_SUCCESS',
                        data: {
                          token: '%s',
                          tempToken: '%s',
                          nickname: '%s',
                          email: '%s',
                          isNewUser: %s
                        }
                      }, 'http://localhost:5173');
                      window.close();
                    </script>
                  </body>
                </html>
                """.formatted(token, userToken, nickname, email, isNewUser);

        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(htmlResponse);
    }

    private ResponseEntity<String> createErrorHtml(String errorMessage) {
        String htmlResponse = """
                <html>
                  <body>
                    <script>
                      window.opener.postMessage({
                        type: 'KAKAO_LOGIN_ERROR',
                        data: {
                          error: '%s'
                        }
                      }, 'http://localhost:5173');
                      window.close();
                    </script>
                  </body>
                </html>
                """.formatted(errorMessage);

        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(htmlResponse);
    }


}
