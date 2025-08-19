import React from 'react';
import {MdCheckBoxOutlineBlank, MdCheckBox, MdRemoveCircleOutline, MdEdit} from 'react-icons/md';
import '../../style/todo/TodoListItem.css';
import type {Release} from '../../types/release';

interface TodoListItemProps {
    todo: Release;
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({todo, onRemove, onToggle}) => {
    const {id, text, completed, priority} = todo;
    return (
        <div className={`TodoListItem priority-${priority?.toLowerCase()}`}>
            <div className={`checkbox ${completed ? 'completed' : ''}`} onClick={() => onToggle(id)}>
                {completed ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
                <div className="text">{text}</div>
            </div>
            <div className="actions">
                <div className="edit"><MdEdit/></div>
                <div className="remove" onClick={() => onRemove(id)}><MdRemoveCircleOutline/></div>
            </div>
        </div>
    );
};
export default React.memo(TodoListItem);