import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import type { Release, Priority } from '@/home/types/release';
import TodoList from '@/home/components/todo/TodoList';
import TodoModal from '@/home/components/todo/TodoModal';
import '@/home/style/views/CommonView.css';

const TomorrowView: React.FC = () => {
    const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, loadTodosByDate, isLoading } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);

    const tomorrowString = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    const tomorrowTodos = useMemo(() => todos.filter(t => t.dueDate === tomorrowString), [todos, tomorrowString]);

    // 컴포넌트 마운트 시 내일의 할 일 로드
    useEffect(() => {
        loadTodosByDate(tomorrowString);
    }, [loadTodosByDate, tomorrowString]);

    const openModal = (todo: Release | null = null) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleSaveTodo = (data: { text: string; priority: Priority }) => {
        if (editingTodo) {
            updateTodo(editingTodo.id, data);
        } else {
            addTodo({ ...data, dueDate: tomorrowString });
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
                        <p className="text-gray-500">내일의 할 일을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>내일 할 일 (백로그)</h1>
                <button className="add-task-btn" onClick={() => openModal()}>+ 내일 할 일 추가</button>
            </header>
            <div className={`view-content ${isLoading ? 'opacity-50' : ''}`}>
                <TodoList todos={tomorrowTodos} onEdit={openModal} onRemove={deleteTodo} onToggle={toggleTodo} />
            </div>
            {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} todoToEdit={editingTodo} />}
        </div>
    );
};
export default TomorrowView;