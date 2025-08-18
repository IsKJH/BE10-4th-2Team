package sp.releasetestbackend.account.repository;

import sp.releasetestbackend.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
