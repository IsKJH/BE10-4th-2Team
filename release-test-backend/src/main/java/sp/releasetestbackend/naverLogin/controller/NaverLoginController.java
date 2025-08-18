package sp.releasetestbackend.naverLogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sp.releasetestbackend.naverLogin.service.NaverLoginService;

@RestController
@RequestMapping("/naver-authentication")
@RequiredArgsConstructor
public class NaverLoginController {
    private final NaverLoginService naverLoginService;

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam(value = "code", required = false) String code) {
        return naverLoginService.handleLogin(code);
    }
}
