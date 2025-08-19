package sp.releasetestbackend.calendar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sp.releasetestbackend.calendar.entity.CalendarEvent;

import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByAccountId(Long accountId);
}