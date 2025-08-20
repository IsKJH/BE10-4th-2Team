package sp.releasetestbackend.calendar.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sp.releasetestbackend.account.entity.Account;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "calendar_events")
public class CalendarEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;

    @JsonProperty("date")
    private LocalDate eventDate;
    private String title;

    @Enumerated(EnumType.STRING)
    private EventType type;
}
