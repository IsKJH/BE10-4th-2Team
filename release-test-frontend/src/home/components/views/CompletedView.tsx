import React, { useMemo, useEffect, useState } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { useAuth } from '@/auth/hooks/useAuth';
import type {Release} from '@/home/types/release';
import TodoList from '@/home/components/todo/TodoList';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import LoginRequired from '@/auth/pages/LoginRequired';
import '@/home/style/views/CommonView.css';

const CompletedView: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { deleteTodo: storeDeleteTodo, toggleTodo: storeToggleTodo, loadAllCompletedTodos } = useAppStore();
    const [completedTodos, setCompletedTodos] = useState<Release[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 로컬 상태 업데이트를 포함한 핸들러들  
    const handleDeleteTodo = async (id: number) => {
        await storeDeleteTodo(id);
        setCompletedTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleToggleTodo = async (id: number) => {
        await storeToggleTodo(id);
        // 완료 상태가 바뀌면 완료된 업무 목록에서 제거 (미완료로 변경된 경우)
        setCompletedTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    
    const completedTodosByDate = useMemo(() => {
        const completed = completedTodos.filter(t => t.completed);
        return completed.reduce((acc, todo) => {
            const date = todo.dueDate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(todo);
            return acc;
        }, {} as Record<string, Release[]>);
    }, [completedTodos]);

    const sortedDates = useMemo(() => Object.keys(completedTodosByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [completedTodosByDate]);

    // 로그인 상태일 때만 최근 완료된 할 일들을 로드
    useEffect(() => {
        const loadCompletedTodos = async () => {
            if (!isLoggedIn) {
                setIsLoading(false);
                setCompletedTodos([]);
                return;
            }

            try {
                setIsLoading(true);
                // 주간 차트와 동일한 방식으로 완료된 할일 로드
                const completed = await loadAllCompletedTodos();
                setCompletedTodos(completed);
            } catch (error) {
                console.error('Failed to load completed todos:', error);
                setCompletedTodos([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCompletedTodos();
    }, [isLoggedIn]);

    // 로그인되지 않은 경우 로그인 페이지 표시
    if (!isLoggedIn) {
        return <LoginRequired />;
    }

    if (isLoading) {
        return (
            <div className="view-container">
                <header className="view-header"><h1>완룈된 업무</h1></header>
                <div className="view-content">
                    <LoadingSpinner 
                        size="lg" 
                        color="primary" 
                        message="완료된 업무를 불러오는 중..."
                        className="min-h-64"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <header className="view-header"><h1>완료된 업무</h1></header>
            <div className={`view-content ${isLoading ? 'opacity-50' : ''}`}>
                {sortedDates.length > 0 ? (
                    sortedDates.map(date => (
                        <div key={date} className="date-group">
                            <h2>{new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</h2>
                            <TodoList todos={completedTodosByDate[date]} onEdit={() => {}} onRemove={handleDeleteTodo} onToggle={handleToggleTodo} />
                        </div>
                    ))
                ) : (
                    <p className="empty-message">아직 완료된 업무가 없습니다.</p>
                )}
            </div>
        </div>
    );
};
export default CompletedView;
