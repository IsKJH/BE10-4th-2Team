package sp.releasetestbackend.calendar.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.calendar.dto.CalendarEventDTO;
import sp.releasetestbackend.calendar.entity.CalendarEvent;
import sp.releasetestbackend.calendar.repository.CalendarEventRepository;
import sp.releasetestbackend.calendar.service.CalendarEventService;
import sp.releasetestbackend.config.auth.AuthUtils;

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
}