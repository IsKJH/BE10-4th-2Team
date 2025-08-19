import React, { useState } from 'react';
import type {EventType} from '../../../types/release';
import '../../style/calendar/EventModal.css';

interface EventModalProps {
    onClose: () => void;
    onSave: (data: { title: string; type: EventType }) => void;
    selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('event');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('이벤트 제목을 입력해주세요.');
            return;
        }
        onSave({ title, type });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 이벤트 추가</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="event-title">이벤트 제목</label>
                        <input
                            id="event-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 팀 전체 회식"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="event-type">종류</label>
                        <select
                            id="event-type"
                            value={type}
                            onChange={(e) => setType(e.target.value as EventType)}
                        >
                            <option value="event">일반</option>
                            <option value="meeting">회의</option>
                            <option value="holiday">휴가</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
                        <button type="submit" className="btn-save">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EventModal;