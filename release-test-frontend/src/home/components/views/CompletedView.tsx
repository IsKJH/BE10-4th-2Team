import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import type {Release} from '../../../types/release';
import TodoList from '../todo/TodoList';
import '../../style/views/CommonView.css';

const CompletedView: React.FC = () => {
    const { todos, deleteTodo, toggleTodo } = useAppStore();

    const completedTodosByDate = useMemo(() => {
        const completed = todos.filter(t => t.completed);
        return completed.reduce((acc, todo) => {
            const date = todo.dueDate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(todo);
            return acc;
        }, {} as Record<string, Release[]>);
    }, [todos]);

    const sortedDates = useMemo(() => Object.keys(completedTodosByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [completedTodosByDate]);

    return (
        <div className="view-container">
            <header className="view-header"><h1>완료된 업무</h1></header>
            {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                    <div key={date} className="date-group">
                        <h2>{new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</h2>
                        <TodoList todos={completedTodosByDate[date]} onEdit={() => {}} onRemove={deleteTodo} onToggle={toggleTodo} />
                    </div>
                ))
            ) : (
                <p className="empty-message">아직 완료된 업무가 없습니다.</p>
            )}
        </div>
    );
};
export default CompletedView;
