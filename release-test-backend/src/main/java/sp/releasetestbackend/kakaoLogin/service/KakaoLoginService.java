package sp.releasetestbackend.kakaoLogin.service;

import org.springframework.http.ResponseEntity;
import sp.releasetestbackend.kakaoLogin.controller.response.KakaoUserInfoResponse;

public interface KakaoLoginService {
    ResponseEntity<String> getLoginUrl();
    
    ResponseEntity<KakaoUserInfoResponse> handleLogin(String code);

    ResponseEntity<String> handleFrontLogin(String code);
}
