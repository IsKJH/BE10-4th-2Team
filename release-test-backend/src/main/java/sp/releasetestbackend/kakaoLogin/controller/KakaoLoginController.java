package sp.releasetestbackend.kakaoLogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sp.releasetestbackend.kakaoLogin.controller.response.KakaoUserInfoResponse;
import sp.releasetestbackend.kakaoLogin.service.KakaoLoginService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kakao-authentication")
public class KakaoLoginController {
    private final KakaoLoginService kakaoLoginService;

    @GetMapping("/url")
    public ResponseEntity<String> getLoginUrl() {
        return kakaoLoginService.getLoginUrl();
    }

    @GetMapping("/login")
    public ResponseEntity<KakaoUserInfoResponse> kakaoLogin(@RequestParam(value = "code", required = false) String code) {
        return kakaoLoginService.handleLogin(code);
    }
    
    @GetMapping("/front-login")
    public ResponseEntity<String> frontLogin(@RequestParam(value = "code", required = false) String code) {
        return kakaoLoginService.handleFrontLogin(code);
    }
}
