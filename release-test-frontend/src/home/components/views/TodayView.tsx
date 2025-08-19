import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import {type Release, type Priority, priorityOrder } from '../../../types/release';
import TodoList from '../todo/TodoList';
import TodoModal from '../todo/TodoModal';
import '../../style/views/CommonView.css';

const TodayView: React.FC = () => {
    const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    const todayTodos = useMemo(() => todos.filter(t => t.dueDate === todayString), [todos, todayString]);
    const sortedTodos = useMemo(() => [...todayTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]), [todayTodos]);

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

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>오늘 할 일</h1>
                <button className="add-task-btn" onClick={() => openModal()}>+ 새 할 일 추가</button>
            </header>
            <TodoList todos={sortedTodos} onEdit={openModal} onRemove={deleteTodo} onToggle={toggleTodo} />
            {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTodo} todoToEdit={editingTodo} />}
        </div>
    );
};
export default TodayView;
