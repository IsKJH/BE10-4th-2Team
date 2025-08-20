import React, { useMemo, useEffect, useState } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { useAuth } from '@/auth/hooks/useAuth';
import { todoApi } from '@/shared/utils/api/todoApi';
import TodoList from '@/home/components/todo/TodoList';
import TodoModal from '@/home/components/todo/TodoModal';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import LoginRequired from '@/auth/pages/LoginRequired';
import '@/home/style/views/CommonView.css';
import { priorityOrder, type Release, type Priority } from '@/home/types/release';

const ImportantView: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { updateTodo: storeUpdateTodo, deleteTodo: storeDeleteTodo, toggleTodo: storeToggleTodo } = useAppStore();
    const [allTodos, setAllTodos] = useState<Release[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);

    // 로컬 상태 업데이트를 포함한 핸들러들
    const handleUpdateTodo = async (id: number, data: { text: string; priority: Priority }) => {
        await storeUpdateTodo(id, data);
        setAllTodos(prev => 
            prev.map(todo => 
                todo.id === id ? { ...todo, ...data } : todo
            )
        );
    };

    const handleDeleteTodo = async (id: number) => {
        await storeDeleteTodo(id);
        setAllTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleToggleTodo = async (id: number) => {
        await storeToggleTodo(id);
        setAllTodos(prev => 
            prev.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    const tomorrowString = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);
    
    const importantTodos = useMemo(() =>
            allTodos.filter(t => !t.completed && (t.priority === 'CRITICAL' || t.priority === 'HIGH'))
                .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
        [allTodos]);

    // 로그인 상태일 때만 오늘과 내일의 중요한 할 일들 로드
    useEffect(() => {
        const loadImportantTodos = async () => {
            if (!isLoggedIn) {
                setIsLoading(false);
                setAllTodos([]);
                return;
            }

            try {
                setIsLoading(true);
                // 오늘과 내일의 할 일들 로드
                const [todayTodos, tomorrowTodos] = await Promise.all([
                    todoApi.getTodosByDate(todayString),
                    todoApi.getTodosByDate(tomorrowString)
                ]);
                
                const combined = [...todayTodos, ...tomorrowTodos];
                setAllTodos(combined);
            } catch (error) {
                console.error('Failed to load important todos:', error);
                setAllTodos([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadImportantTodos();
    }, [isLoggedIn, todayString, tomorrowString]);

    const openModal = (todo: Release) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleSaveTodo = (data: { text: string; priority: Priority }) => {
        if (editingTodo) {
            handleUpdateTodo(editingTodo.id, data);
        }
        setIsModalOpen(false);
        setEditingTodo(null);
    };

    // 로그인되지 않은 경우 로그인 페이지 표시
    if (!isLoggedIn) {
        return <LoginRequired />;
    }

    if (isLoading) {
        return (
            <div className="view-container">
                <header className="view-header"><h1>중요 업무</h1></header>
                <div className="view-content">
                    <LoadingSpinner 
                        size="lg" 
                        color="secondary" 
                        message="중요 업무를 불러오는 중..."
                        className="min-h-64"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <header className="view-header"><h1>중요 업무</h1></header>
            <div className={`view-content ${isLoading ? 'opacity-50' : ''}`}>
                <TodoList todos={importantTodos} onEdit={openModal} onRemove={handleDeleteTodo} onToggle={handleToggleTodo} />
            </div>
            {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} todoToEdit={editingTodo} />}
        </div>
    );
};
export default ImportantView;