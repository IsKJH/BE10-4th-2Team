package sp.releasetestbackend.account.service;

import sp.releasetestbackend.account.controller.response.SignUpResponse;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.account.repository.AccountRepository;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import sp.releasetestbackend.account_profile.service.AccountProfileService;
import sp.releasetestbackend.jwt.JwtTokenService;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final AccountProfileService accountProfileService;
    private final JwtTokenService jwtTokenService;

    @Override
    public SignUpResponse signUp(SignUpRequest request, String token) {
        // 카카오 액세스 토큰 검증 (JWT가 아닌 카카오에서 받은 토큰)
        String accessToken = token.replace("Bearer ", "");
        
        // 이메일과 로그인 타입 조합으로 중복 체크
        if (accountProfileService.isEmailExistsWithLoginType(request.getEmail(), request.getLoginType())) {
            return new SignUpResponse(false, "이미 해당 로그인 방식으로 가입된 이메일입니다.", null);
        }
        
        // Account 생성
        Account account = new Account(request.getLoginType());
        Account savedAccount = accountRepository.save(account);

        // AccountProfile 생성
        AccountProfile savedAccountProfile = accountProfileService.createProfile(savedAccount, request);

        // JWT 토큰 생성
        String userToken = jwtTokenService.generateToken(savedAccount.getId());

        // 응답 데이터 생성
        SignUpResponse.SignUpData data = new SignUpResponse.SignUpData(
            savedAccount.getId(), 
            savedAccountProfile.getEmail(), 
            savedAccountProfile.getNickname(), 
            userToken
        );

        return new SignUpResponse(true, "회원가입에 성공했습니다.", data);
    }
}
