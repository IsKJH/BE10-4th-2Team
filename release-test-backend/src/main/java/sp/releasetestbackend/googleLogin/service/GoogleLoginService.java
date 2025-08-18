package sp.releasetestbackend.googleLogin.service;

import org.springframework.http.ResponseEntity;

public interface GoogleLoginService {
    ResponseEntity<String> handleLogin(String code);
}
