// 우선순위 타입 (백엔드와 동일)
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export const priorityOrder: Record<Priority, number> = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
};

// Todo 타입 (백엔드 Entity와 동일한 구조)
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    dueDate: string; // LocalDate -> string (YYYY-MM-DD)
}

// Release는 Todo로 마이그레이션 (호환성 유지)
export interface Release extends Todo {
    userId?: number; // 더이상 사용하지 않음 (JWT에서 추출)
}

// 이벤트 타입 (백엔드와 동일)
export type EventType = 'event' | 'holiday' | 'meeting';

// 캘린더 이벤트 (백엔드 Entity와 동일한 구조)
export interface CalendarEvent {
    id: number;
    date: string; // LocalDate -> string (JsonProperty로 eventDate -> date 매핑)
    title: string;
    type: EventType;
}

// 주간 데이터
export interface WeeklyData {
    name: string;
    저번주: number;
    이번주: number;
}

// 대시보드 데이터 (백엔드 DTO와 동일한 구조)
export interface DashboardData {
    todaysTodos: Todo[];
    todaysCompletedCount: number;
    todaysTotalCount: number;
    todaysProgress: number;
    tomorrowsTodoCount: number;
    weeklyChartData: Array<{[key: string]: any}>;
    overallProgress: number;
}

// API 요청 타입들
export interface TodoCreateRequest {
    text: string;
    priority: Priority;
    dueDate: string;
}

export interface TodoUpdateRequest {
    text: string;
    priority: Priority;
}

export interface CalendarEventCreateRequest {
    date: string; // LocalDate -> string
    title: string;
    type: EventType;
}

// Account 관련 타입들
export type LoginType = 'KAKAO' | 'GOOGLE' | 'NAVER';

export interface SignUpRequest {
    loginType: LoginType;
    email: string;
    nickname: string;
}

export interface SignUpResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        email: string;
        nickname: string;
        userToken: string;
    };
}

export interface UpdateNicknameRequest {
    nickname: string;
}

// API 응답 타입들
export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
}