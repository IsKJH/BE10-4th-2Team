package sp.releasetestbackend.dashboard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sp.releasetestbackend.dashboard.dto.DashboardResponseDTO;
import sp.releasetestbackend.home.entity.Todo;
import sp.releasetestbackend.home.repository.TodoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {
    private final TodoRepository todoRepository;

    public DashboardResponseDTO getDashboardData(Long accountId) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // 1. 오늘 할 일 관련 데이터 계산
        List<Todo> todaysTodos = todoRepository.findByAccountIdAndDueDate(accountId, today);
        long todaysTotalCount = todaysTodos.size();
        long todaysCompleteCount = todaysTodos.stream().filter(Todo::isCompleted).count();
        int todaysProgress = (todaysTotalCount > 0) ? (int) Math.round((double) todaysCompleteCount / todaysTotalCount * 100) : 0;

        // 2. 내일 할 일 개수 계산
        long tomorrowsTodoCount = todoRepository.countByAccountIdAndDueDate(accountId, tomorrow);

        // 3. 주간 차트 데이터 (지금 샘플임)
        List<Map<String, Object>> weeklyChartData = List.of(
                Map.of("name", "월", "저번주", 20, "이번주", 25),
                Map.of("name", "화", "저번주", 30, "이번주", 28),
                Map.of("name", "수", "저번주", 22, "이번주", 35)
        );

        // 4. 전체 진행률 (최근 1주일 기준으로 계산)
        LocalDate weekAgo = today.minusDays(7);
        List<Todo> weeklyTodos = todoRepository.findByAccountIdAndDueDateBetween(accountId, weekAgo, today);
        long weeklyTotalCount = weeklyTodos.size();
        long weeklyCompleteCount = weeklyTodos.stream().filter(Todo::isCompleted).count();
        int overallProgress = (weeklyTotalCount > 0) ? (int) Math.round((double) weeklyCompleteCount / weeklyTotalCount * 100) : 0;

        // 5. 계산된 모든 데이터를 DTO에 담아 반환
        return new DashboardResponseDTO(
                todaysTodos,
                todaysCompleteCount,
                todaysTotalCount,
                todaysProgress,
                tomorrowsTodoCount,
                weeklyChartData,
                overallProgress
        );
    }
}
