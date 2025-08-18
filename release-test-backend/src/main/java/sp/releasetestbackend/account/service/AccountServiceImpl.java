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
import sp.releasetestbackend.account_profile.repository.AccountProfileRepository;
import sp.releasetestbackend.jwt.JwtTokenService;
import sp.releasetestbackend.account.controller.AccountController.UpdateNicknameRequest;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final AccountProfileService accountProfileService;
    private final AccountProfileRepository accountProfileRepository;
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
    
    @Override
    public void updateNickname(UpdateNicknameRequest request, String token) {
        // JWT 토큰에서 accountId 추출
        System.out.println("받은 토큰: " + token);
        String accessToken = token.replace("Bearer ", "");
        System.out.println("Bearer 제거 후 토큰: " + accessToken);
        
        Long accountId = jwtTokenService.getAccountIdFromToken(accessToken);
        System.out.println("파싱된 accountId: " + accountId);
        
        if (accountId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        System.out.println("추출된 accountId: " + accountId);
        
        // AccountProfile 조회 및 업데이트
        Optional<AccountProfile> profileOpt = accountProfileRepository.findByAccount_Id(accountId);
        
        System.out.println("프로필 조회 결과: " + profileOpt.isPresent());
        
        if (profileOpt.isEmpty()) {
            // 모든 프로필 조회하여 디버깅
            System.out.println("=== 모든 AccountProfile 조회 ===");
            for (AccountProfile profile : accountProfileRepository.findAll()) {
                System.out.println("Profile ID: " + profile.getId() + 
                                 ", Account ID: " + profile.getAccount().getId() +
                                 ", Email: " + profile.getEmail() +
                                 ", Nickname: " + profile.getNickname());
            }
            throw new RuntimeException("프로필을 찾을 수 없습니다. accountId: " + accountId);
        }
        
        AccountProfile profile = profileOpt.get();
        profile.updateNickname(request.nickname);
        accountProfileRepository.save(profile);
    }
    
    @Override
    public void deleteAccount(String token) {
        // JWT 토큰에서 accountId 추출
        String accessToken = token.replace("Bearer ", "");
        Long accountId = jwtTokenService.getAccountIdFromToken(accessToken);
        
        if (accountId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        System.out.println("삭제할 accountId: " + accountId);
        
        // Account 조회
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("계정을 찾을 수 없습니다. accountId: " + accountId);
        }
        
        // AccountProfile 먼저 삭제 (외래키 관계 때문에)
        accountProfileRepository.deleteByAccount_Id(accountId);
        
        // Account 삭제
        accountRepository.deleteById(accountId);
        
        System.out.println("계정 삭제 완료: " + accountId);
    }
}
