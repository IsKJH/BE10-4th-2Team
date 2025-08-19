import React, {useState} from 'react';
import '../../style/dashboard/CalendarWidget.css';

const CalendarWidget: React.FC = () => {
    const [date] = useState(new Date());
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const calendarDates = [...Array(firstDay).fill(null), ...Array.from({length: lastDate}, (_, i) => i + 1)];
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                {year}년 {month + 1}월
            </div>
            <div className="calendar-grid">
                {days.map((day) => <div key={day} className="day-name">{day}</div>)}
                {calendarDates.map((d, i) => <div key={i}
                                                  className={`date ${d === new Date().getDate() ? 'today' : ''}`}>{d}</div>)}
            </div>
        </div>
    );
};
export default CalendarWidget;