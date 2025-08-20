import React, { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiX } from 'react-icons/fi';
import type { CalendarEvent, EventType } from '@/home/types/release';
import EventModal from './EventModal';
import { showDeleteConfirmAlert } from '@/shared/utils/sweetAlert';
import '@/home/style/calendar/DayDetailModal.css';

interface DayDetailModalProps {
    selectedDate: Date;
    events: CalendarEvent[];
    onClose: () => void;
    onAddEvent: (data: { title: string; type: EventType }) => void;
    onUpdateEvent: (id: number, data: { title: string; type: EventType }) => void;
    onDeleteEvent: (id: number) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
    selectedDate,
    events,
    onClose,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent
}) => {
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
    };

    const handleAddEvent = () => {
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleDeleteEvent = async (event: CalendarEvent) => {
        const result = await showDeleteConfirmAlert(
            '이벤트 삭제',
            `"${event.title}" 이벤트를 삭제하시겠습니까?`
        );
        
        if (result.isConfirmed) {
            onDeleteEvent(event.id);
        }
    };

    const handleSaveEvent = (data: { title: string; type: EventType }) => {
        if (editingEvent) {
            onUpdateEvent(editingEvent.id, data);
        } else {
            onAddEvent(data);
        }
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleCloseEventModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const getEventTypeLabel = (type: EventType): string => {
        switch (type) {
            case 'meeting': return '회의';
            case 'holiday': return '휴가';
            case 'event': return '일반';
            default: return '일반';
        }
    };

    const getEventTypeColor = (type: EventType): string => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-800';
            case 'holiday': return 'bg-green-100 text-green-800';
            case 'event': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventBorderColor = (type: EventType): string => {
        switch (type) {
            case 'meeting': return '#3b82f6';
            case 'holiday': return '#10b981';
            case 'event': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <>
            <div className="day-detail-overlay" onClick={onClose}>
                <div className="day-detail-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="day-detail-header">
                        <div>
                            <h2>{formatDate(selectedDate)}</h2>
                            <p className="event-count">{events.length}개의 이벤트</p>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <FiX />
                        </button>
                    </div>

                    <div className="day-detail-content">
                        <div className="add-event-section">
                            <button className="add-event-btn" onClick={handleAddEvent}>
                                <FiPlus />
                                새 이벤트 추가
                            </button>
                        </div>

                        <div className="events-list">
                            {events.length === 0 ? (
                                <div className="empty-events">
                                    <p>이 날짜에 등록된 이벤트가 없습니다.</p>
                                    <p className="empty-subtext">위의 버튼을 눌러 새 이벤트를 추가해보세요.</p>
                                </div>
                            ) : (
                                events.map(event => (
                                    <div 
                                        key={event.id} 
                                        className="event-item"
                                        style={{ '--event-color': getEventBorderColor(event.type) } as React.CSSProperties}
                                    >
                                        <div className="event-content">
                                            <div className="event-title">{event.title}</div>
                                            <span className={`event-type-badge ${getEventTypeColor(event.type)}`}>
                                                {getEventTypeLabel(event.type)}
                                            </span>
                                        </div>
                                        <div className="event-actions">
                                            <button 
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditEvent(event)}
                                                title="수정"
                                            >
                                                <FiEdit3 />
                                            </button>
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteEvent(event)}
                                                title="삭제"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showEventModal && (
                <EventModal
                    onClose={handleCloseEventModal}
                    onSave={handleSaveEvent}
                    selectedDate={selectedDate}
                    editingEvent={editingEvent}
                />
            )}
        </>
    );
};

export default DayDetailModal;