package sp.releasetestbackend.home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sp.releasetestbackend.home.entity.Release;

import java.util.List;

public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findByUserId(Long userId);
}
