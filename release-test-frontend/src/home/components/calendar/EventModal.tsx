import React, { useState, useEffect } from 'react';
import type {EventType, CalendarEvent} from '@/home/types/release';
import '@/home/style/calendar/EventModal.css';

interface EventModalProps {
    onClose: () => void;
    onSave: (data: { title: string; type: EventType }) => void;
    selectedDate: Date;
    editingEvent?: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, selectedDate, editingEvent }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('event');
    
    // 디버깅을 위한 로그
    console.log('EventModal rendered with selectedDate:', selectedDate, 'editingEvent:', editingEvent);
    console.log('Selected date details:', {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        date: selectedDate.getDate(),
        dateString: selectedDate.toISOString(),
        localString: selectedDate.toLocaleDateString('ko-KR')
    });

    // 안전한 날짜 포맷팅 함수
    const formatDisplayDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth()는 0부터 시작
        const day = date.getDate();
        const monthName = `${month}월`;
        return `${year}년 ${monthName} ${day}일`;
    };
    
    // 수정 모드일 때 기존 데이터로 초기화
    useEffect(() => {
        if (editingEvent) {
            setTitle(editingEvent.title);
            setType(editingEvent.type);
        } else {
            setTitle('');
            setType('event');
        }
    }, [editingEvent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('이벤트 제목을 입력해주세요.');
            return;
        }
        onSave({ title: title.trim(), type });
    };
    
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>
                    {formatDisplayDate(selectedDate)}
                    {editingEvent ? ' 이벤트 수정' : ' 이벤트 추가'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="event-title">이벤트 제목</label>
                        <input
                            id="event-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 팀 전체 회식, 중요한 미팅 등"
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
                        <button type="submit" className="btn-save">
                            {editingEvent ? '수정' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EventModal;