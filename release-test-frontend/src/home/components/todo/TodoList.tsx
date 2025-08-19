import React from 'react';
import TodoListItem from './TodoListItem';
import '../../style/todo/TodoList.css';
import type {Release} from '../../../types/release';

interface TodoListProps {
    todos: Release[];
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (todo: Release) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemove, onToggle, onEdit }) => (
    <div className="TodoList">
        {todos.length > 0 ? (
            todos.map((todo) => (
                <TodoListItem
                    todo={todo}
                    key={todo.id}
                    onRemove={onRemove}
                    onToggle={onToggle}
                    onEdit={onEdit}
                />
            ))
        ) : (
            <p className="empty-message">오늘 할 일이 없습니다!</p>
        )}
    </div>
);
export default TodoList;