package sp.releasetestbackend.calendar.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.account.repository.AccountRepository;
import sp.releasetestbackend.calendar.dto.CalendarEventDTO;
import sp.releasetestbackend.calendar.entity.CalendarEvent;
import sp.releasetestbackend.calendar.repository.CalendarEventRepository;

import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;
    private final AccountRepository accountRepository;

    public CalendarEvent createEvent(Long accountId, CalendarEventDTO.Create request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("해당 계정을 찾을 수 없습니다: " + accountId));
        
        CalendarEvent newEvent = new CalendarEvent();
        newEvent.setAccount(account);
        newEvent.setEventDate(request.getDate());
        newEvent.setTitle(request.getTitle());
        newEvent.setType(request.getType());
        return calendarEventRepository.save(newEvent);
    }

    // 이벤트 수정
    public CalendarEvent updateEvent(Long accountId, Long eventId, CalendarEventDTO.Update request) throws AccessDeniedException {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 이벤트를 찾을 수 없습니다: " + eventId));

        if (!event.getAccount().getId().equals(accountId)) {
            throw new AccessDeniedException("이 이벤트를 수정할 권한이 없습니다.");
        }

        event.setTitle(request.getTitle());
        event.setType(request.getType());
        return event;
    }

    // 이벤트 삭제
    public void deleteEvent(Long accountId, Long eventId) throws AccessDeniedException {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 이벤트를 찾을 수 없습니다: " + eventId));

        if (!event.getAccount().getId().equals(accountId)) {
            throw new AccessDeniedException("이 이벤트를 삭제할 권한이 없습니다.");
        }

        calendarEventRepository.deleteById(eventId);
    }
}
