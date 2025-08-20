import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { useAuth } from '@/auth/hooks/useAuth';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import DayDetailModal from '@/home/components/calendar/DayDetailModal';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import LoginRequired from '@/auth/pages/LoginRequired';
import '@/home/style/views/CalendarView.css';
import type {CalendarEvent} from '@/home/types/release';

const CalendarView: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { events, addEvent, updateEvent, deleteEvent, loadCalendarEvents, isLoading } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const formatDateToString = useCallback((date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    const parseStringToDate = useCallback((dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }, []);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleDateClick = useCallback((day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const clickedDate = new Date(year, month, day);
        setSelectedDate(clickedDate);
        setIsDayDetailModalOpen(true);
    }, [currentDate]);

    const handleAddEvent = (data: { title: string; type: 'event' | 'holiday' | 'meeting' }) => {
        if (selectedDate) {
            const dateString = formatDateToString(selectedDate);
            addEvent({ ...data, date: dateString });
        }
    };

    const handleUpdateEvent = (id: number, data: { title: string; type: 'event' | 'holiday' | 'meeting' }) => {
        updateEvent(id, data);
    };

    const handleDeleteEvent = (id: number) => {
        deleteEvent(id);
    };

    const closeDayDetailModal = useCallback(() => {
        setIsDayDetailModalOpen(false);
        setSelectedDate(null);
    }, []);

    // 캘린더 그리드 생성 (Hook 순서 유지를 위해 조건부 렌더링 이전에 선언)
    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const grid = [];
        let day = 1;

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    // 첫 주의 빈 칸들
                    week.push(<td key={`${i}-${j}`} className="empty"></td>);
                } else if (day > lastDate) {
                    // 마지막 날짜를 넘은 빈 칸들
                    week.push(<td key={`${i}-${j}`} className="empty"></td>);
                } else {
                    // 실제 날짜가 있는 칸들
                    const currentDay = day; // day 값을 미리 저장
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateStr);
                    const isToday = new Date().toDateString() === new Date(year, month, currentDay).toDateString();
                    
                    // 이벤트 표시를 더 깔끔하게
                    const eventCount = dayEvents.length;

                    week.push(
                        <td key={`${i}-${j}`} className={`calendar-cell ${isToday ? 'today' : ''} ${eventCount > 0 ? 'has-events' : ''}`} onClick={() => handleDateClick(currentDay)}>
                            <div className="date-number">{currentDay}</div>
                            {eventCount > 0 && (
                                <div className="event-indicator">
                                    <div className="event-dots">
                                        {dayEvents.slice(0, 3).map((event, index) => (
                                            <div 
                                                key={event.id} 
                                                className={`event-dot ${event.type}`}
                                                style={{ zIndex: 3 - index }}
                                            />
                                        ))}
                                    </div>
                                    {eventCount > 3 && (
                                        <div className="event-count">+{eventCount - 3}</div>
                                    )}
                                    {eventCount <= 3 && eventCount > 0 && (
                                        <div className="event-count">{eventCount}</div>
                                    )}
                                </div>
                            )}
                        </td>
                    );
                    day++; // day 증가는 실제 날짜 셀을 만든 후에만
                }
            }
            grid.push(<tr key={i}>{week}</tr>);
            if (day > lastDate) break;
        }
        return grid;
    }, [currentDate, events, handleDateClick]);

    // 로그인 상태일 때만 캘린더 이벤트 로드
    useEffect(() => {
        if (isLoggedIn) {
            loadCalendarEvents();
        }
    }, [isLoggedIn, loadCalendarEvents]);

    // 로그인되지 않은 경우 로그인 페이지 표시
    if (!isLoggedIn) {
        return <LoginRequired />;
    }

    if (isLoading && events.length === 0) {
        return (
            <div className="view-container">
                <header className="view-header"><h1>캘린더</h1></header>
                <div className="view-content">
                    <LoadingSpinner 
                        size="lg" 
                        color="primary" 
                        message="캘린더 데이터를 불러오는 중..."
                        className="min-h-64"
                    />
                </div>
            </div>
        );
    }

    // 선택된 날짜의 이벤트들 가져오기
    const getSelectedDateEvents = (): CalendarEvent[] => {
        if (!selectedDate) return [];
        const dateStr = formatDateToString(selectedDate);
        return events.filter(e => e.date === dateStr);
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <div className="header-content">
                    <div className="header-left">
                        <FiCalendar className="header-icon" />
                        <h1>캘린더</h1>
                    </div>
                    <div className="header-stats">
                        <span className="event-total">총 {events.length}개 이벤트</span>
                    </div>
                </div>
            </header>
            <div className="view-content">
                <div className={`calendar-full-container ${isLoading ? 'opacity-50' : ''}`}>
                    <div className="calendar-navigation">
                        <button onClick={handlePrevMonth} title="이전 달" className="nav-btn">
                            <FiChevronLeft />
                        </button>
                        <h2 className="current-month">
                            {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                        </h2>
                        <button onClick={handleNextMonth} title="다음 달" className="nav-btn">
                            <FiChevronRight />
                        </button>
                    </div>
                    <div className="calendar-table-container">
                        <table className="calendar-table">
                            <thead>
                                <tr>
                                    {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                                </tr>
                            </thead>
                            <tbody>{calendarGrid}</tbody>
                        </table>
                    </div>
                    
                    <div className="calendar-legend">
                        <div className="legend-item">
                            <div className="legend-dot meeting"></div>
                            <span>회의</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot holiday"></div>
                            <span>휴가</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot event"></div>
                            <span>일반</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {isDayDetailModalOpen && selectedDate && (
                <DayDetailModal
                    selectedDate={selectedDate}
                    events={getSelectedDateEvents()}
                    onClose={closeDayDetailModal}
                    onAddEvent={handleAddEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}
        </div>
    );
};
export default CalendarView;
