import React, {useState, useEffect} from "react";
import type {Release, Priority} from "@/home/types/release";
import { showErrorAlert } from '@/shared/utils/sweetAlert';

interface TodoModalProps {
    onClose: () => void;
    onSave: (data: { text: string; priority: Priority }) => void;
    todoToEdit: Release | null;
}

const TodoModal: React.FC<TodoModalProps> = ({onClose, onSave, todoToEdit}) => {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const isEditing = !!todoToEdit;

    useEffect(() => {
        if (isEditing) {
            setText(todoToEdit.text);
            setPriority(todoToEdit.priority);
        }
    }, [todoToEdit, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            showErrorAlert('입력 오류', '할 일을 입력해 주세요.');
            return;
        }
        onSave({ text, priority });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isEditing ? '할 일 수정' : '새 할 일 추가'}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="todo-text" className="input-label">할 일</label>
                            <input
                                id="todo-text"
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="예: 프로젝트 기획 회의"
                                className="input input-default input-md input-full"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="todo-priority" className="input-label">중요도</label>
                            <select
                                id="todo-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="input input-default input-md input-full"
                            >
                                <option value="CRITICAL">CRITICAL</option>
                                <option value="HIGH">HIGH</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="LOW">LOW</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost btn-md" onClick={onClose}>취소</button>
                        <button type="submit" className="btn btn-primary btn-md">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal;