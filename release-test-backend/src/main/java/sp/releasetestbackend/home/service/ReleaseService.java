package sp.releasetestbackend.home.service;

import sp.releasetestbackend.home.entity.Release;
import sp.releasetestbackend.home.repository.ReleaseRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReleaseService {

    private final ReleaseRepository releaseRepository;

    // 모든 루트를 조회
    @Transactional(readOnly = true)
    public List<Release> findReleasesByUserId(Long userId) {
        return releaseRepository.findByUserId(userId);
    }

    // 새로운 체크리스트 생성
    @Transactional
    public Release createRelease(String text, Long userId) {
        if (text == null || text.isEmpty()) {
            throw new IllegalArgumentException("할 일이 없습니다.");
        }
        Release newRelease = new Release();
        newRelease.setText(text);
        newRelease.setUserId(userId);
        newRelease.setCreatedAt(LocalDate.now());
        return releaseRepository.save(newRelease);
    }

    // 체크리스트를 수정
    @Transactional
    public Release updateRelease(Long id, Map<String, Object> updates) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 체크리스트를 찾을 수 없습니다."));

        if (updates.containsKey("text")) {
            release.setText((String) updates.get("text"));
        }
        if (updates.containsKey("completed")) {
            release.setCompleted((boolean) updates.get("completed"));
        }
        return release;
    }

    @Transactional
    public void deleteRelease(Long id) {
        releaseRepository.deleteById(id);
    }
}
