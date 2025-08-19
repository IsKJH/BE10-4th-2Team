package sp.releasetestbackend.home.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sp.releasetestbackend.account.entity.Account;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    private String text;
    private boolean completed = false;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDate dueDate;
}
