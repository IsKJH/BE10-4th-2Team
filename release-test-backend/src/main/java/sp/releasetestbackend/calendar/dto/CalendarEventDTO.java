package sp.releasetestbackend.calendar.dto;

import lombok.Getter;
import lombok.Setter;
import sp.releasetestbackend.calendar.entity.EventType;

import java.time.LocalDate;

public class CalendarEventDTO {
    @Getter
    @Setter
    public static class Create {
        private LocalDate date;
        private String title;
        private EventType type;
    }
}
