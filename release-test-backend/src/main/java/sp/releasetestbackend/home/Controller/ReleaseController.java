package sp.releasetestbackend.home.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.home.entity.Release;
import sp.releasetestbackend.home.service.ReleaseService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/releases")
@RequiredArgsConstructor
@CrossOrigin
public class ReleaseController {

    private final ReleaseService releaseService;

    @GetMapping
    public List<Release> getReleases() {
        Long userId = 1L; // 임시 사용자 1번
        return releaseService.findReleasesByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Release> createRelease(@RequestBody Map<String, String> payload) {
        Long userId = 1L; // 임시 사용자 ID
        String text = payload.get("text");

        try {
            Release savedRelease = releaseService.createRelease(text, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRelease);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // [PATCH] /api/releases/{id} -> 특정 체크리스트 수정
    @PatchMapping("/{id}")
    public ResponseEntity<Release> updateRelease(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        try {
            Release updatedRelease = releaseService.updateRelease(id, updates);
            return ResponseEntity.ok(updatedRelease);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRelease(@PathVariable Long id) {
        releaseService.deleteRelease(id);
        return ResponseEntity.noContent().build();
    }
}

