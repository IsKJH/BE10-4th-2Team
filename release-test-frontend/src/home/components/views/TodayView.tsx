import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { type Release, type Priority, priorityOrder } from '@/home/types/release';
import TodoList from '@/home/components/todo/TodoList';
import TodoModal from '@/home/components/todo/TodoModal';
import '@/home/style/views/CommonView.css';

const TodayView: React.FC = () => {
    const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, loadTodosByDate, isLoading } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    const todayTodos = useMemo(() => todos.filter(t => t.dueDate === todayString), [todos, todayString]);
    const sortedTodos = useMemo(() => [...todayTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]), [todayTodos]);

    // 컴포넌트 마운트 시 오늘의 할 일 로드
    useEffect(() => {
        loadTodosByDate(todayString);
    }, [loadTodosByDate, todayString]);

    const openModal = (todo: Release | null = null) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleSaveTodo = (data: { text: string; priority: Priority }) => {
        if (editingTodo) {
            updateTodo(editingTodo.id, data);
        } else {
            addTodo({ ...data, dueDate: todayString });
        }
        setIsModalOpen(false);
        setEditingTodo(null);
    };

    if (isLoading && todos.length === 0) {
        return (
            <div className="view-container">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">오늘의 할 일을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>오늘 할 일</h1>
                <button className="add-task-btn" onClick={() => openModal()}>+ 새 할 일 추가</button>
            </header>
            <div className={`view-content ${isLoading ? 'opacity-50' : ''}`}>
                <TodoList todos={sortedTodos} onEdit={openModal} onRemove={deleteTodo} onToggle={toggleTodo} />
            </div>
            {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} todoToEdit={editingTodo} />}
        </div>
    );
};
export default TodayView;