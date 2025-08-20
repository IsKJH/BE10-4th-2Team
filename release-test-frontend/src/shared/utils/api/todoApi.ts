import { apiClient } from './Api';
import { 
    Todo, 
    TodoCreateRequest, 
    TodoUpdateRequest, 
    DashboardData,
    CalendarEvent,
    CalendarEventCreateRequest,
    EventType 
} from '@/home/types/release';

// Todo CRUD API
export const todoApi = {
    // 특정 날짜의 할 일 목록 조회
    getTodosByDate: async (date: string): Promise<Todo[]> => {
        return await apiClient.get<Todo[]>(`/api/todos?date=${date}`);
    },

    // 새 할 일 생성
    createTodo: async (todoData: TodoCreateRequest): Promise<Todo> => {
        return await apiClient.post<Todo>('/api/todos', todoData);
    },

    // 할 일 수정
    updateTodo: async (id: number, todoData: TodoUpdateRequest): Promise<Todo> => {
        return await apiClient.put<Todo>(`/api/todos/${id}`, todoData);
    },

    // 할 일 완료 상태 토글
    toggleTodo: async (id: number): Promise<Todo> => {
        return await apiClient.put<Todo>(`/api/todos/${id}/toggle`);
    },

    // 할 일 삭제
    deleteTodo: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/todos/${id}`);
    },

    // 대시보드 데이터 조회
    getDashboardData: async (): Promise<DashboardData> => {
        return await apiClient.get<DashboardData>('/api/dashboard');
    }
};

// Calendar Event API
export const calendarApi = {
    // 모든 캘린더 이벤트 조회
    getAllEvents: async (): Promise<CalendarEvent[]> => {
        return await apiClient.get<CalendarEvent[]>('/api/calendar/events');
    },

    // 새 캘린더 이벤트 생성
    createEvent: async (eventData: CalendarEventCreateRequest): Promise<CalendarEvent> => {
        return await apiClient.post<CalendarEvent>('/api/calendar/events', eventData);
    },

    // 캘린더 이벤트 수정
    updateEvent: async (id: number, eventData: { title: string; type: EventType }): Promise<CalendarEvent> => {
        return await apiClient.put<CalendarEvent>(`/api/calendar/events/${id}`, eventData);
    },

    // 캘린더 이벤트 삭제
    deleteEvent: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/calendar/events/${id}`);
    }
};