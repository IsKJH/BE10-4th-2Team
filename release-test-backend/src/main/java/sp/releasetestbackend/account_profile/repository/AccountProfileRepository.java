package sp.releasetestbackend.account_profile.repository;

import sp.releasetestbackend.account.entity.LoginType;
import sp.releasetestbackend.account_profile.entity.AccountProfile;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AccountProfileRepository extends CrudRepository<AccountProfile, Integer> {
    Optional<AccountProfile> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // 이메일과 로그인 타입 조합으로 찾기
    Optional<AccountProfile> findByEmailAndAccount_LoginType(String email, LoginType loginType);
    boolean existsByEmailAndAccount_LoginType(String email, LoginType loginType);
    
    // Account ID로 찾기
    Optional<AccountProfile> findByAccount_Id(Long accountId);
    void deleteByAccount_Id(Long accountId);
}
