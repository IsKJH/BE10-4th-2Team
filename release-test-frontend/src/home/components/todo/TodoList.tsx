import React from 'react';
import TodoListItem from './TodoListItem';
import '../../style/todo/TodoList.css';
import type {Release} from '../../types/release';

interface TodoListProps {
    todos: Release[];
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({todos, onRemove, onToggle}) => (
    <div className="TodoList">
        {todos.map((todo) => <TodoListItem todo={todo} key={todo.id} onRemove={onRemove} onToggle={onToggle}/>)}
    </div>
);
export default TodoList;
