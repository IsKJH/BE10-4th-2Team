import { create } from 'zustand';
import { todoApi, calendarApi } from '@/shared/utils/api/todoApi';
import { showErrorAlert, showSuccessAlert } from '@/shared/utils/sweetAlert';
import type { Todo, Release, Priority, CalendarEvent, DashboardData } from '@/home/types/release';

// 개발 환경에서만 로그 출력
const devLog = (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
        console.log(`[Store] ${message}`, ...args);
    }
};

const devError = (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
        console.error(`[Store Error] ${message}`, ...args);
    }
};

interface AppState {
    // 상태
    todos: Todo[];
    events: CalendarEvent[];
    dashboardData: DashboardData | null;
    isLoading: boolean;
    userName: string;

    // Todo 관련 액션
    loadTodosByDate: (date: string) => Promise<void>;
    loadCompletedTodosByDateRange: (startDate: string, endDate: string) => Promise<Todo[]>;
    loadAllCompletedTodos: () => Promise<Todo[]>;
    loadDashboardData: () => Promise<void>;
    addTodo: (data: { text: string; priority: Priority; dueDate: string }) => Promise<void>;
    updateTodo: (id: number, data: { text: string; priority: Priority }) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
    toggleTodo: (id: number) => Promise<void>;

    // Calendar 관련 액션
    loadCalendarEvents: () => Promise<void>;
    addEvent: (event: { title: string; type: 'event' | 'holiday' | 'meeting'; date: string }) => Promise<void>;
    updateEvent: (id: number, data: { title: string; type: 'event' | 'holiday' | 'meeting' }) => Promise<void>;
    deleteEvent: (id: number) => Promise<void>;

    // 상태 초기화
    resetStore: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // 초기 상태
    todos: [],
    events: [],
    dashboardData: null,
    isLoading: false,
    userName: "사용자",

    // Todo 관련 액션들
    loadTodosByDate: async (date: string) => {
        // 로그인 상태 확인
        const token = localStorage.getItem('accessToken') || localStorage.getItem('tempToken');
        if (!token) {
            devLog('No auth token found, skipping todos load');
            set({ todos: [], isLoading: false });
            return;
        }

        try {
            set({ isLoading: true });
            const todos = await todoApi.getTodosByDate(date);
            set({ todos, isLoading: false });
        } catch (error) {
            devError('Failed to load todos:', error);
            set({ isLoading: false });
            showErrorAlert('데이터 로드 실패', '할 일 목록을 불러오는데 실패했습니다.');
        }
    },

    loadCompletedTodosByDateRange: async (startDate: string, endDate: string): Promise<Todo[]> => {
        // 로그인 상태 확인
        const token = localStorage.getItem('accessToken') || localStorage.getItem('tempToken');
        if (!token) {
            devLog('No auth token found, skipping completed todos load');
            return [];
        }

        try {
            // 날짜 범위의 각 날짜별로 데이터를 로드하여 모든 완료된 할일 수집
            const allCompletedTodos: Todo[] = [];
            const currentDate = new Date(startDate);
            const endDateTime = new Date(endDate);
            
            while (currentDate <= endDateTime) {
                const dateStr = currentDate.toISOString().split('T')[0];
                try {
                    const dayTodos = await todoApi.getTodosByDate(dateStr);
                    const completedTodos = dayTodos.filter(todo => todo.completed);
                    allCompletedTodos.push(...completedTodos);
                } catch (error) {
                    devError(`Failed to load todos for ${dateStr}:`, error);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            return allCompletedTodos;
        } catch (error) {
            devError('Failed to load completed todos:', error);
            return [];
        }
    },

    loadAllCompletedTodos: async (): Promise<Todo[]> => {
        // 로그인 상태 확인
        const token = localStorage.getItem('accessToken') || localStorage.getItem('tempToken');
        if (!token) {
            devLog('No auth token found, skipping all completed todos load');
            return [];
        }

        try {
            // 지난 2주간의 모든 완료된 할일을 로드 (주간 차트용)
            const today = new Date();
            const twoWeeksAgo = new Date(today);
            twoWeeksAgo.setDate(today.getDate() - 14);
            
            const startDate = twoWeeksAgo.toISOString().split('T')[0];
            const endDate = today.toISOString().split('T')[0];
            
            return await get().loadCompletedTodosByDateRange(startDate, endDate);
        } catch (error) {
            devError('Failed to load all completed todos:', error);
            return [];
        }
    },

    loadDashboardData: async () => {
        // 로그인 상태 확인
        const token = localStorage.getItem('accessToken') || localStorage.getItem('tempToken');
        if (!token) {
            devLog('No auth token found, skipping dashboard data load');
            set({ isLoading: false });
            return;
        }

        try {
            set({ isLoading: true });
            const dashboardData = await todoApi.getDashboardData();
            set({ dashboardData, isLoading: false });
        } catch (error) {
            devError('Failed to load dashboard data:', error);
            set({ isLoading: false });
            // 에러 시 더미 데이터로 폴백
            const fallbackData: DashboardData = {
                todaysTodos: [],
                todaysCompletedCount: 0,
                todaysTotalCount: 0,
                todaysProgress: 0,
                tomorrowsTodoCount: 0,
                weeklyChartData: [
                    { name: '월', 저번주: 0, 이번주: 0 },
                    { name: '화', 저번주: 0, 이번주: 0 },
                    { name: '수', 저번주: 0, 이번주: 0 },
                    { name: '목', 저번주: 0, 이번주: 0 },
                    { name: '금', 저번주: 0, 이번주: 0 },
                ],
                overallProgress: 0
            };
            set({ dashboardData: fallbackData });
        }
    },

    addTodo: async (data) => {
        try {
            set({ isLoading: true });
            const newTodo = await todoApi.createTodo(data);
            
            // 로컬 상태 업데이트
            set((state) => ({
                todos: [...state.todos, newTodo],
                isLoading: false
            }));

            // 로컬 상태에 이미 추가되었으므로 서버 재조회 생략
            // await get().loadTodosByDate(data.dueDate);

            // 성공 알림
            showSuccessAlert('추가 완료', '새로운 할 일이 성공적으로 추가되었습니다.');
        } catch (error) {
            devError('Failed to create todo:', error);
            set({ isLoading: false });
            showErrorAlert('생성 실패', '새 할 일을 생성하는데 실패했습니다.');
        }
    },

    updateTodo: async (id, data) => {
        try {
            set({ isLoading: true });
            const updatedTodo = await todoApi.updateTodo(id, data);
            
            set((state) => ({
                todos: state.todos.map(t => t.id === id ? updatedTodo : t),
                isLoading: false
            }));

            // 성공 알림
            showSuccessAlert('수정 완료', '할 일이 성공적으로 수정되었습니다.');
        } catch (error) {
            devError('Failed to update todo:', error);
            set({ isLoading: false });
            showErrorAlert('수정 실패', '할 일을 수정하는데 실패했습니다.');
        }
    },

    deleteTodo: async (id) => {
        try {
            set({ isLoading: true });
            await todoApi.deleteTodo(id);
            
            set((state) => ({
                todos: state.todos.filter(t => t.id !== id),
                isLoading: false
            }));

            // 성공 알림
            showSuccessAlert('삭제 완료', '할 일이 성공적으로 삭제되었습니다.');
        } catch (error) {
            devError('Failed to delete todo:', error);
            set({ isLoading: false });
            showErrorAlert('삭제 실패', '할 일을 삭제하는데 실패했습니다.');
        }
    },

    toggleTodo: async (id) => {
        try {
            set({ isLoading: true });
            const updatedTodo = await todoApi.toggleTodo(id);
            
            set((state) => ({
                todos: state.todos.map(t => t.id === id ? updatedTodo : t),
                isLoading: false
            }));
        } catch (error) {
            devError('Failed to toggle todo:', error);
            set({ isLoading: false });
            showErrorAlert('상태 변경 실패', '할 일 상태를 변경하는데 실패했습니다.');
        }
    },

    // Calendar 관련 액션들
    loadCalendarEvents: async () => {
        // 로그인 상태 확인
        const token = localStorage.getItem('accessToken') || localStorage.getItem('tempToken');
        if (!token) {
            devLog('No auth token found, skipping calendar events load');
            set({ events: [], isLoading: false });
            return;
        }

        try {
            set({ isLoading: true });
            const events = await calendarApi.getAllEvents();
            set({ events, isLoading: false });
        } catch (error) {
            devError('Failed to load calendar events:', error);
            set({ isLoading: false });
            showErrorAlert('이벤트 로드 실패', '캘린더 이벤트를 불러오는데 실패했습니다.');
        }
    },

    addEvent: async (eventData) => {
        try {
            set({ isLoading: true });
            devLog('Creating new calendar event:', eventData);
            const newEvent = await calendarApi.createEvent({
                date: eventData.date,
                title: eventData.title,
                type: eventData.type
            });
            
            set((state) => ({
                events: [...state.events, newEvent],
                isLoading: false
            }));

            devLog('Calendar event created successfully:', newEvent);
            showSuccessAlert('이벤트 생성 완료', '새 이벤트가 성공적으로 생성되었습니다.');
        } catch (error) {
            devError('Failed to create calendar event:', error);
            set({ isLoading: false });
            showErrorAlert('이벤트 생성 실패', '새 이벤트를 생성하는데 실패했습니다.');
        }
    },

    updateEvent: async (id, data) => {
        try {
            set({ isLoading: true });
            devLog('Updating calendar event:', id, data);
            const updatedEvent = await calendarApi.updateEvent(id, data);
            
            set((state) => ({
                events: state.events.map(e => e.id === id ? updatedEvent : e),
                isLoading: false
            }));

            devLog('Calendar event updated successfully:', updatedEvent);
            showSuccessAlert('이벤트 수정 완료', '이벤트가 성공적으로 수정되었습니다.');
        } catch (error) {
            devError('Failed to update calendar event:', error);
            set({ isLoading: false });
            showErrorAlert('이벤트 수정 실패', '이벤트를 수정하는데 실패했습니다.');
        }
    },

    deleteEvent: async (id) => {
        try {
            set({ isLoading: true });
            devLog('Deleting calendar event:', id);
            await calendarApi.deleteEvent(id);
            
            set((state) => ({
                events: state.events.filter(e => e.id !== id),
                isLoading: false
            }));

            devLog('Calendar event deleted successfully:', id);
            showSuccessAlert('이벤트 삭제 완료', '이벤트가 성공적으로 삭제되었습니다.');
        } catch (error) {
            devError('Failed to delete calendar event:', error);
            set({ isLoading: false });
            showErrorAlert('이벤트 삭제 실패', '이벤트를 삭제하는데 실패했습니다.');
        }
    },

    // 상태 초기화
    resetStore: () => {
        set({
            todos: [],
            events: [],
            dashboardData: null,
            isLoading: false,
            userName: "사용자"
        });
    }
}));

// 호환성을 위한 타입 별칭
export type { Release };