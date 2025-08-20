import React from 'react';
import TodoListItem from '@/home/components/todo/TodoListItem';
import { EmptyState } from '@/shared/components/ui';
import '@/home/style/todo/TodoList.css';
import type {Release} from '@/home/types/release';
import { FiCheckSquare } from 'react-icons/fi';

interface TodoListProps {
    todos: Release[];
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (todo: Release) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemove, onToggle, onEdit }) => (
    <div className="TodoList">
        {todos.length > 0 ? (
            <div className="todo-items-container">
                {todos.map((todo) => (
                    <TodoListItem
                        todo={todo}
                        key={todo.id}
                        onRemove={onRemove}
                        onToggle={onToggle}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        ) : (
            <EmptyState
                icon={<FiCheckSquare size={48} />}
                title="할 일이 없습니다"
                description="새로운 할 일을 추가해보세요!"
                className="flex-1"
            />
        )}
    </div>
);
export default TodoList;