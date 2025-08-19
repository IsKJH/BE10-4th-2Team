package sp.releasetestbackend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import sp.releasetestbackend.home.entity.Todo;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class DashboardResponseDTO {

    private List<Todo> todaysTodos;
    private long todaysCompletedCount;
    private long todaysTotalCount;
    private int todaysProgress;
    private long tomorrowsTodoCount;
    private List<Map<String, Object>> weeklyChartData;
    private int overallProgress;
}
