package sp.releasetestbackend.account_profile.service;

import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.account.entity.LoginType;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;
import sp.releasetestbackend.account_profile.entity.AccountProfile;

import java.util.Optional;

public interface AccountProfileService {

    AccountProfile createProfile(Account account, SignUpRequest request);

    boolean isEmailExists(String email);
    
    // 이메일과 로그인 타입 조합으로 중복 체크
    boolean isEmailExistsWithLoginType(String email, LoginType loginType);

    Optional<AccountProfile> findByEmail(String email);
    
    // 이메일과 로그인 타입 조합으로 찾기
    Optional<AccountProfile> findByEmailAndLoginType(String email, LoginType loginType);

    AccountProfile updateProfile(String email, String token);

    String deleteProfile(String email);
}
