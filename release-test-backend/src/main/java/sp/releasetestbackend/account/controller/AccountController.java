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
    
    @PutMapping("/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody UpdateNicknameRequest request, @RequestHeader("Authorization") String token) {
        accountService.updateNickname(request, token);
        return ResponseEntity.ok("닉네임이 성공적으로 변경되었습니다.");
    }
    
    @DeleteMapping
    public ResponseEntity<String> deleteAccount(@RequestHeader("Authorization") String token) {
        accountService.deleteAccount(token);
        return ResponseEntity.ok("계정이 성공적으로 삭제되었습니다.");
    }
    
    public static class UpdateNicknameRequest {
        public String nickname;
        
        public UpdateNicknameRequest() {}
        
        public UpdateNicknameRequest(String nickname) {
            this.nickname = nickname;
        }
    }
}
