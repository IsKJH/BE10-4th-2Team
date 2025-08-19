import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EventModal from '../calendar/EventModal';
import '../../style/views/CalendarView.css';
import type {CalendarEvent} from '../../../types/release';

const CalendarView: React.FC = () => {
    const { events, addEvent } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleDateClick = (day: number) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setIsModalOpen(true);
    };

    const handleSaveEvent = (data: Omit<CalendarEvent, 'id' | 'date'>) => {
        if (selectedDate) {
            addEvent({ ...data, date: selectedDate.toISOString().split('T')[0] });
        }
        setIsModalOpen(false);
        setSelectedDate(null);
    };

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
                if ((i === 0 && j < firstDay) || day > lastDate) {
                    week.push(<td key={`${i}-${j}`} className="empty"></td>);
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateStr);
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                    week.push(
                        <td key={`${i}-${j}`} className={isToday ? 'today' : ''} onClick={() => handleDateClick(day)}>
                            <div className="date-number">{day}</div>
                            <div className="events-container">
                                {dayEvents.map(event => (
                                    <div key={event.id} className={`event-dot ${event.type}`}>{event.title}</div>
                                ))}
                            </div>
                        </td>
                    );
                    day++;
                }
            }
            grid.push(<tr key={i}>{week}</tr>);
            if (day > lastDate) break;
        }
        return grid;
    }, [currentDate, events]);

    return (
        <div className="view-container">
            <header className="view-header"><h1>캘린더</h1></header>
            <div className="calendar-full-container">
                <div className="calendar-navigation">
                    <button onClick={handlePrevMonth}><FiChevronLeft /></button>
                    <h2>{currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}</h2>
                    <button onClick={handleNextMonth}><FiChevronRight /></button>
                </div>
                <table className="calendar-table">
                    <thead><tr>{daysOfWeek.map(day => <th key={day}>{day}</th>)}</tr></thead>
                    <tbody>{calendarGrid}</tbody>
                </table>
            </div>
            {isModalOpen && selectedDate && <EventModal onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} selectedDate={selectedDate}/>}
        </div>
    );
};
export default CalendarView;
