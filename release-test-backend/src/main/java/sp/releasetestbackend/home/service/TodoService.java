package sp.releasetestbackend.home.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.account.entity.Account;
import sp.releasetestbackend.home.dto.TodoDTO;
import sp.releasetestbackend.home.entity.Todo;
import sp.releasetestbackend.home.repository.TodoRepository;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {
    private final TodoRepository todoRepository;

    // 할 일 생성
    public Todo createTodo(Long accountId, TodoDTO.Create request) {
        Todo newTodo = new Todo();
        Account account = new Account(); // 실제로는 AccountRepository에서 accountId로 조회해야 함
        account.setId(accountId); // 임시로 ID만 설정
        newTodo.setAccount(account);
        newTodo.setText(request.getText());
        newTodo.setPriority(request.getPriority());
        newTodo.setDueDate(request.getDueDate());
        return todoRepository.save(newTodo);
    }

    // 할 일 수정
    public Todo updateTodo(Long accountId, Long todoId, TodoDTO.Update request) throws AccessDeniedException {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("ID에 해당하는 할 일을 찾을 수 없습니다: " + todoId));

        if (!todo.getAccount().getId().equals(accountId)) {
            throw new AccessDeniedException("이 할 일을 수정할 권한이 없습니다.");
        }

        todo.setText(request.getText());
        todo.setPriority(request.getPriority());
        return todo;
    }

    // 할 일 삭제
    public void deleteTodo(Long accountId, Long todoId) throws AccessDeniedException {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("ID에 해당하는 할 일을 찾을 수 없습니다: " + todoId));

        if (!todo.getAccount().getId().equals(accountId)) {
            throw new AccessDeniedException("이 할 일을 삭제할 권한이 없습니다.");
        }

        todoRepository.deleteById(todoId);
    }

    // 할 일 완료/미완료 토글
    public Todo toggleTodo(Long accountId, Long todoId) throws AccessDeniedException {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("ID에 해당하는 할 일을 찾을 수 없습니다: " + todoId));

        if (!todo.getAccount().getId().equals(accountId)) {
            throw new AccessDeniedException("이 할 일을 변경할 권한이 없습니다.");
        }

        todo.setCompleted(!todo.isCompleted());
        return todo;
    }
}