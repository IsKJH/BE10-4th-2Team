package sp.releasetestbackend.account.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.account.controller.response.SignUpResponse;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.account.service.AccountService;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;

@Slf4j
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signup(@RequestBody SignUpRequest request, @RequestHeader("Authorization") String token) {
        SignUpResponse response = accountService.signUp(request, token);
        return ResponseEntity.ok(response);
    }
}
