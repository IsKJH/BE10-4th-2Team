import { create } from 'zustand';
import type { Release, Priority, CalendarEvent } from '../types/release';

const getTodayString = () => new Date().toISOString().split('T')[0];
const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

const initialTodos: Release[] = [
    { id: 1, text: 'UI/UX 디자인 컨셉 확정', completed: false, priority: 'HIGH', userId: 1, dueDate: getTodayString() },
    { id: 2, text: '백엔드 API 명세서 작성', completed: true, priority: 'CRITICAL', userId: 1, dueDate: getTodayString() },
    { id: 3, text: 'DB 스키마 디자인', completed: false, priority: 'MEDIUM', userId: 1, dueDate: getTodayString() },
    { id: 4, text: '팀 주간 회고 준비', completed: false, priority: 'LOW', userId: 1, dueDate: getTodayString() },
    { id: 5, text: '내일 발표 자료 초안 작성', completed: false, priority: 'HIGH', userId: 1, dueDate: getTomorrowString() },
    { id: 6, text: '프로젝트 배포 계획 수립', completed: false, priority: 'MEDIUM', userId: 1, dueDate: getTomorrowString() },
    { id: 7, text: '지난 주 버그 수정', completed: true, priority: 'HIGH', userId: 1, dueDate: '2025-08-18' },
];
const initialEvents: CalendarEvent[] = [
    { id: 1, date: getTodayString(), title: '주간 팀 미팅', type: 'meeting' },
    { id: 2, date: '2025-08-25', title: '여름 휴가', type: 'holiday' },
];

interface AppState {
    todos: Release[];
    events: CalendarEvent[];
    userName: string;
    checkAndMoveTodos: () => void;
    addTodo: (data: { text: string; priority: Priority; dueDate: string }) => void;
    updateTodo: (id: number, data: { text: string; priority: Priority }) => void;
    deleteTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
    todos: initialTodos,
    events: initialEvents,
    userName: "Roger",
    checkAndMoveTodos: () => {
        const today = getTodayString();
        set((state) => ({
            todos: state.todos.map(todo =>
                (todo.dueDate < today && !todo.completed) ? { ...todo, dueDate: today } : todo
            ),
        }));
    },
    addTodo: (data) => set((state) => ({ todos: [...state.todos, { ...data, id: Date.now(), completed: false, userId: 1 }] })),
    updateTodo: (id, data) => set((state) => ({ todos: state.todos.map(t => t.id === id ? { ...t, ...data } : t) })),
    deleteTodo: (id) => set((state) => ({ todos: state.todos.filter(t => t.id !== id) })),
    toggleTodo: (id) => set((state) => ({ todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),
    addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: Date.now() }] })),
}));