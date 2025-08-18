import React from 'react';
import { MdCheckBoxOutlineBlank, MdCheckBox, MdRemoveCircleOutline, MdEdit } from 'react-icons/md';
import '../style/ReleaseListItem.css';
import type {Release} from "../types/release";

interface ReleaseListItemProps {
    release: Release;
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
}

const ReleaseListItem: React.FC<ReleaseListItemProps> = ({ release, onRemove, onToggle }) => {
    const { id, text, completed } = release;
    return (
        <div className="ReleaseListItem">
            <div className={`checkbox ${completed ? 'completed' : ''}`} onClick={() => onToggle(id)}>
                {completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                <div className="text">{text}</div>
            </div>
            <div className="actions">
                <div className="edit"><MdEdit /></div>
                <div className="remove" onClick={() => onRemove(id)}><MdRemoveCircleOutline /></div>
            </div>
        </div>
    );
};
export default ReleaseListItem;