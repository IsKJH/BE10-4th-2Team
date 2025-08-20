import React, {useState, useEffect} from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '@/home/style/dashboard/CalendarWidget.css';

const CalendarWidget: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const { events, loadCalendarEvents } = useAppStore();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const calendarDates = [...Array(firstDay).fill(null), ...Array.from({length: lastDate}, (_, i) => i + 1)];

    // 캘린더 이벤트 로드
    useEffect(() => {
        loadCalendarEvents();
    }, [loadCalendarEvents]);

    // 월 이동 함수들
    const handlePrevMonth = () => {
        setDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setDate(new Date());
    };

    // 특정 날짜의 이벤트 가져오기
    const getEventsForDate = (day: number) => {
        if (!day) return [];
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr);
    };
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth} className="nav-button" title="이전 달">
                    <FiChevronLeft />
                </button>
                <div className="month-year" onClick={handleToday} title="오늘로 이동">
                    {year}년 {month + 1}월
                </div>
                <button onClick={handleNextMonth} className="nav-button" title="다음 달">
                    <FiChevronRight />
                </button>
            </div>
            <div className="calendar-grid">
                {days.map((day) => <div key={day} className="day-name">{day}</div>)}
                {calendarDates.map((d, i) => {
                    const dayEvents = d ? getEventsForDate(d) : [];
                    const isToday = d === new Date().getDate() && 
                                   month === new Date().getMonth() && 
                                   year === new Date().getFullYear();
                    
                    return (
                        <div key={i} className={`date ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                            {d && (
                                <>
                                    <div className="date-number">{d}</div>
                                    {dayEvents.length > 0 && (
                                        <div className="event-indicators">
                                            {dayEvents.slice(0, 2).map((event, idx) => (
                                                <div 
                                                    key={event.id} 
                                                    className={`event-dot ${event.type}`}
                                                    title={event.title}
                                                />
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="event-more" title={`+${dayEvents.length - 2}개 더`}>
                                                    +{dayEvents.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default CalendarWidget;