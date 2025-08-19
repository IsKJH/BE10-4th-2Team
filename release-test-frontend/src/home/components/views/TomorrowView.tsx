import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore'; // 경로 수정
import type { Release, Priority } from '@/types/release'; // 경로 수정
import TodoList from '@/home/components/todo/TodoList'; // 경로 수정
import TodoModal from '@/home/components/todo/TodoModal'; // 경로 수정
import '@/home/style/views/CommonView.css'; // 경로 수정

const TomorrowView: React.FC = () => {
    // (내용은 이전과 동일)
    const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);

    const tomorrowString = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    const tomorrowTodos = useMemo(() => todos.filter(t => t.dueDate === tomorrowString), [todos, tomorrowString]);

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

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>내일 할 일 (백로그)</h1>
                <button className="add-task-btn" onClick={() => openModal()}>+ 내일 할 일 추가</button>
            </header>
            <TodoList todos={tomorrowTodos} onEdit={openModal} onRemove={deleteTodo} onToggle={toggleTodo} />
            {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} todoToEdit={editingTodo} />}
        </div>
    );
};
export default TomorrowView;