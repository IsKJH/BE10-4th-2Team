export interface Release {
    id: number;
    text: string;
    completed: boolean;
    userId: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
}

// 주간 차트 데이터 타입
export interface WeeklyData {
    name: string;
    저번주: number;
    이번주: number;
}

// 대시보드 전체 데이터 타입
export interface DashboardData {
    todaysTodos: Release[];         // 오늘 할 일 목록
    todaysCompletedCount: number;   // 오늘 완료한 일 개수
    todaysTotalCount: number;       // 오늘 전체 할 일 개수
    overallProgress: number;        // 전체 진행률 (%)
    weeklyChartData: WeeklyData[];  // 주간 업무 비교 데이터
}
