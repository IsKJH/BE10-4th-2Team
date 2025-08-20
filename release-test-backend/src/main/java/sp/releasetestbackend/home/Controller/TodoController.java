package sp.releasetestbackend.home.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.config.auth.AuthUtils;
import sp.releasetestbackend.home.dto.TodoDTO;
import sp.releasetestbackend.home.entity.Todo;
import sp.releasetestbackend.home.repository.TodoRepository;
import sp.releasetestbackend.home.service.TodoService;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin
public class TodoController {
    private final TodoService todoService;
    private final TodoRepository todoRepository;
    private final AuthUtils authUtils;

    @GetMapping
    public List<Todo> getTodosByDate(@RequestParam("date") LocalDate date, @RequestHeader("Authorization") String token) {
        Long accountId = authUtils.getAccountIdFromToken(token);
        return todoRepository.findByAccountIdAndDueDate(accountId, date);
    }


    @PostMapping
    public Todo createTodo(@RequestBody TodoDTO.Create request, @RequestHeader("Authorization") String token) {
        Long accountId = authUtils.getAccountIdFromToken(token);
        return todoService.createTodo(accountId, request);
    }

    // 할 일 수정
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody TodoDTO.Update request, @RequestHeader("Authorization") String token) {
        try {
            Long accountId = authUtils.getAccountIdFromToken(token);
            Todo updatedTodo = todoService.updateTodo(accountId, id, request);
            return ResponseEntity.ok(updatedTodo);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build(); // 403 Forbidden (권한 없음)
        }
    }

    // 할 일 완료 토글 API
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long accountId = authUtils.getAccountIdFromToken(token);
            Todo updatedTodo = todoService.toggleTodo(accountId, id);
            return ResponseEntity.ok(updatedTodo);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }

    // 할 일 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long accountId = authUtils.getAccountIdFromToken(token);
            todoService.deleteTodo(accountId, id);
            return ResponseEntity.noContent().build(); // 204 No Content (성공적으로 삭제됨)
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }
}