import React, { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TodoList from '@/home/components/todo/TodoList';
import '@/home/style/views/CommonView.css';
import { priorityOrder } from '@/types/release';

const ImportantView: React.FC = () => {
    const { todos, deleteTodo, toggleTodo } = useAppStore();

    const importantTodos = useMemo(() =>
            todos.filter(t => !t.completed && (t.priority === 'CRITICAL' || t.priority === 'HIGH'))
                .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
        [todos]);

    return (
        <div className="view-container">
            <header className="view-header"><h1>중요 업무</h1></header>
            <TodoList todos={importantTodos} onEdit={() => {}} onRemove={deleteTodo} onToggle={toggleTodo} />
        </div>
    );
};
export default ImportantView;