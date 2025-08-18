package sp.releasetestbackend.naverLogin.service;

import org.springframework.http.ResponseEntity;

public interface NaverLoginService {
    ResponseEntity<String> handleLogin(String code);
}
