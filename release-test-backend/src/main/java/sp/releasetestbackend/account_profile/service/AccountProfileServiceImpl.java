package sp.releasetestbackend.account_profile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.account.entity.LoginType;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import sp.releasetestbackend.account_profile.repository.AccountProfileRepository;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountProfileServiceImpl implements AccountProfileService {
    private final AccountProfileRepository accountProfileRepository;

    @Override
    public AccountProfile createProfile(Account account, SignUpRequest request) {
        AccountProfile profile = new AccountProfile(account, request.getEmail(), request.getNickname());

        return accountProfileRepository.save(profile);
    }

    @Override
    public boolean isEmailExists(String email) {
        return accountProfileRepository.findByEmail(email).isPresent();
    }
    
    @Override
    public boolean isEmailExistsWithLoginType(String email, LoginType loginType) {
        return accountProfileRepository.existsByEmailAndAccount_LoginType(email, loginType);
    }

    @Override
    public Optional<AccountProfile> findByEmail(String email) {
        return accountProfileRepository.findByEmail(email);
    }
    
    @Override
    public Optional<AccountProfile> findByEmailAndLoginType(String email, LoginType loginType) {
        return accountProfileRepository.findByEmailAndAccount_LoginType(email, loginType);
    }

    @Override
    public AccountProfile updateProfile(String email, String token) {
        return null;
    }

    @Override
    public String deleteProfile(String email) {
        return "";
    }
}
