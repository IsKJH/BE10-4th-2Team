package sp.releasetestbackend.googleLogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sp.releasetestbackend.googleLogin.service.GoogleLoginService;

@RestController
@RequestMapping("/google-authentication")
@RequiredArgsConstructor
public class GoogleLoginController {
    private final GoogleLoginService googleLoginService;

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam(value = "code", required = false) String code) {
        return googleLoginService.handleLogin(code);
    }

}
