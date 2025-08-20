import React from 'react';
import { FiCheckSquare, FiSquare, FiEdit, FiTrash2 } from 'react-icons/fi';
import '@/home/style/todo/TodoListItem.css';
import type {Release} from '@/home/types/release';

interface TodoListItemProps {
    todo: Release;
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (todo: Release) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo, onRemove, onToggle, onEdit }) => {
    const { id, text, completed, priority } = todo;
    return (
        <div className={`todo-list-item priority-${priority?.toLowerCase()} ${completed ? 'completed' : ''}`}>
            <div className={`checkbox ${completed ? 'completed' : ''}`} onClick={() => onToggle(id)}>
                {completed ? <FiCheckSquare /> : <FiSquare />}
                <div className="text">{text}</div>
            </div>
            <div className="actions">
                <div className="priority-tag">{priority}</div>
                <button className="action-btn" onClick={() => onEdit(todo)} aria-label={`${text} 편집`}>
                    <FiEdit />
                </button>
                <button className="action-btn" onClick={() => onRemove(id)} aria-label={`${text} 삭제`}>
                    <FiTrash2 />
                </button>
            </div>
        </div>
    );
};
export default React.memo(TodoListItem);