package sp.releasetestbackend.googleLogin.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import sp.releasetestbackend.account.entity.LoginType;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import sp.releasetestbackend.account_profile.repository.AccountProfileRepository;
import sp.releasetestbackend.googleLogin.repository.GoogleLoginRepository;
import sp.releasetestbackend.jwt.JwtTokenService;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleLoginServiceImpl implements GoogleLoginService {
    private final GoogleLoginRepository googleLoginRepository;
    private final AccountProfileRepository accountProfileRepository;
    private final JwtTokenService jwtTokenService;

    @Override
    public ResponseEntity<String> handleLogin(@Nullable String code) {
        // code가 없으면 Google 로그인 URL로 리다이렉트
        if (code == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(googleLoginRepository.getAccessCode()))
                    .build();
        }

        // 구글 액세스 토큰 발급
        Map<String, Object> tokenResponse = googleLoginRepository.getAccessToken(code);
        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return createErrorHtml("토큰 발급에 실패했습니다.");
        }

        String token = tokenResponse.get("access_token").toString();

        // 구글 사용자 정보 조회
        Map<String, Object> userInfo = googleLoginRepository.getUserInfo(token);
        if (userInfo == null) {
            return createErrorHtml("사용자 정보를 가져올 수 없습니다.");
        }

        System.out.println(userInfo);

        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        if (email == null || name == null) {
            return createErrorHtml("필수 사용자 정보가 누락되었습니다.");
        }

        // 4. 기존 사용자 확인
        Optional<AccountProfile> existAccount =
                accountProfileRepository.findByEmailAndAccount_LoginType(email, LoginType.GOOGLE);
        boolean isNewUser = existAccount.isEmpty();
        String userToken = token;
        String displayName = name;

        if (!isNewUser) {
            Long accountId = existAccount.get().getAccount().getId();
            userToken = jwtTokenService.generateToken(accountId);
            displayName = existAccount.get().getNickname();
        }

        // 5. Google 로그인 기준으로 postMessage
        return createSuccessHtml(token, userToken, displayName, email, isNewUser);
    }

    private ResponseEntity<String> createSuccessHtml(String token, String userToken, String nickname, String email, boolean isNewUser) {
        String htmlResponse = """
                <html>
                  <body>
                    <script>
                      window.opener.postMessage({
                        type: 'GOOGLE_LOGIN_SUCCESS',
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
                        type: 'GOOGLE_LOGIN_ERROR',
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