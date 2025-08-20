package sp.releasetestbackend.calendar.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.calendar.dto.CalendarEventDTO;
import sp.releasetestbackend.calendar.entity.CalendarEvent;
import sp.releasetestbackend.calendar.repository.CalendarEventRepository;
import sp.releasetestbackend.calendar.service.CalendarEventService;
import sp.releasetestbackend.config.auth.AuthUtils;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/calendar/events")
@RequiredArgsConstructor
@CrossOrigin
public class CalendarEventController {
    private final CalendarEventService calendarEventService;
    private final CalendarEventRepository calendarEventRepository;
    private final AuthUtils authUtils;

    // 로그인한 사용자의 모든 이벤트 조회
    @GetMapping
    public List<CalendarEvent> getAllEvents(@RequestHeader("Authorization") String token) {
        Long accountId = authUtils.getAccountIdFromToken(token);
        return calendarEventRepository.findByAccountId(accountId);
    }

    // 로그인한 사용자의 새 이벤트 생성
    @PostMapping
    public CalendarEvent createEvent(@RequestBody CalendarEventDTO.Create request, @RequestHeader("Authorization") String token) {
        Long accountId = authUtils.getAccountIdFromToken(token);
        return calendarEventService.createEvent(accountId, request);
    }

    // 이벤트 수정
    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable Long id, @RequestBody CalendarEventDTO.Update request, @RequestHeader("Authorization") String token) {
        try {
            Long accountId = authUtils.getAccountIdFromToken(token);
            CalendarEvent updatedEvent = calendarEventService.updateEvent(accountId, id, request);
            return ResponseEntity.ok(updatedEvent);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }

    // 이벤트 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long accountId = authUtils.getAccountIdFromToken(token);
            calendarEventService.deleteEvent(accountId, id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }
}