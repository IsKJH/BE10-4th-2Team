package sp.releasetestbackend.calendar.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.calendar.dto.CalendarEventDTO;
import sp.releasetestbackend.calendar.entity.CalendarEvent;
import sp.releasetestbackend.calendar.repository.CalendarEventRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;

    public CalendarEvent createEvent(Long accountId, CalendarEventDTO.Create request) {
        CalendarEvent newEvent = new CalendarEvent();
        Account account = new Account();
        account.setId(accountId);
        newEvent.setAccount(account);
        newEvent.setEventDate(request.getDate());
        newEvent.setTitle(request.getTitle());
        newEvent.setType(request.getType());
        return calendarEventRepository.save(newEvent);
    }
}
