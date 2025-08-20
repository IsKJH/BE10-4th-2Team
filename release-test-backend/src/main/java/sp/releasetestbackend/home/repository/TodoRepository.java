package sp.releasetestbackend.home.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sp.releasetestbackend.home.entity.Todo;
import sp.releasetestbackend.home.entity.Priority;

import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByAccountIdAndDueDate(Long accountId, LocalDate dueDate);
    List<Todo> findByAccountIdAndPriorityInAndCompletedIsFalse(Long accountId, List<Priority> priorities);
    List<Todo> findByAccountIdAndCompletedIsTrue(Long accountId);
    long countByAccountIdAndDueDate(Long accountId, LocalDate dueDate);
    List<Todo> findByAccountIdAndDueDateBetween(Long accountId, LocalDate startDate, LocalDate endDate);
}