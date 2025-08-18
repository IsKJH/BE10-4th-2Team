package sp.releasetestbackend.naverLogin.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import sp.releasetestbackend.account.entity.LoginType;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import sp.releasetestbackend.account_profile.repository.AccountProfileRepository;
import sp.releasetestbackend.jwt.JwtTokenService;
import sp.releasetestbackend.naverLogin.repository.NaverLoginRepository;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NaverLoginServiceImpl implements NaverLoginService {
    private final NaverLoginRepository naverLoginRepository;
    private final AccountProfileRepository accountProfileRepository;
    private final JwtTokenService jwtTokenService;

    @Override
    public ResponseEntity<String> handleLogin(@Nullable String code) {
        // code가 없으면 Naver 로그인 URL로 리다이렉트
        if (code == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(naverLoginRepository.getAccessCode()))
                    .build();
        }

        // 네이버 액세스 토큰 발급
        Map<String, Object> tokenResponse = naverLoginRepository.getAccessToken(code);
        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return createErrorHtml("토큰 발급에 실패했습니다.");
        }

        String token = tokenResponse.get("access_token").toString();

        // 네이버 사용자 정보 조회
        Map<String, Object> userInfo = naverLoginRepository.getUserInfo(token);
        if (userInfo == null) {
            return createErrorHtml("사용자 정보를 가져올 수 없습니다.");
        }

        System.out.println(userInfo);

        // 네이버 API는 response 객체 안에 사용자 정보가 있음
        Map<String, Object> response = (Map<String, Object>) userInfo.get("response");
        if (response == null) {
            return createErrorHtml("네이버 사용자 정보 형식이 올바르지 않습니다.");
        }

        String email = (String) response.get("email");
        String nickname = (String) response.get("nickname");

        if (email == null || nickname == null) {
            return createErrorHtml("필수 사용자 정보가 누락되었습니다.");
        }

        // 4. 기존 사용자 확인
        Optional<AccountProfile> existAccount =
                accountProfileRepository.findByEmailAndAccount_LoginType(email, LoginType.NAVER);
        boolean isNewUser = existAccount.isEmpty();
        String userToken = token;
        String displayNickname = nickname;

        if (!isNewUser) {
            Long accountId = existAccount.get().getAccount().getId();
            userToken = jwtTokenService.generateToken(accountId);
            displayNickname = existAccount.get().getNickname();
        }

        // 5. Naver 로그인 기준으로 postMessage
        return createSuccessHtml(token, userToken, displayNickname, email, isNewUser);
    }

    private ResponseEntity<String> createSuccessHtml(String token, String userToken, String nickname, String email, boolean isNewUser) {
        String htmlResponse = """
                <html>
                  <body>
                    <script>
                      window.opener.postMessage({
                        type: 'NAVER_LOGIN_SUCCESS',
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
                        type: 'NAVER_LOGIN_ERROR',
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
