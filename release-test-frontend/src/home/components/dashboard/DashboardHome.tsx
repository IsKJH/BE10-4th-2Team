import React, {useMemo} from 'react';
import {useAppStore} from '../../../store/useAppStore';
import type {ViewType} from '../../pages/DashboardPage';
import WeeklyChart from './WeeklyChart';
import ProgressCircle from './ProgressCircle';
import CalendarWidget from './CalendarWidget';
import TodoList from '../todo/TodoList';
import '../../style/dashboard/Dashboard.css';
import { priorityOrder } from '../../../types/release';

interface DashboardHomeProps { setActiveView: (view: ViewType) => void; }

const DashboardHome: React.FC<DashboardHomeProps> = ({ setActiveView }) => {
    const { todos: allTodos, userName, deleteTodo, toggleTodo } = useAppStore();

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    const tomorrowsTodosCount = useMemo(() => allTodos.filter(t => t.dueDate > todayString && !t.completed).length, [allTodos, todayString]);

    const todaysUncompletedTodos = useMemo(() => allTodos.filter(t => t.dueDate === todayString && !t.completed), [allTodos, todayString]);
    const sortedTodayTodos = useMemo(() => [...todaysUncompletedTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]), [todaysUncompletedTodos]);

    const todaysCompletedCount = useMemo(() => allTodos.filter(t => t.dueDate === todayString && t.completed).length, [allTodos, todayString]);
    const todaysTotalCount = todaysUncompletedTodos.length + todaysCompletedCount;
    const todaysProgress = todaysTotalCount > 0 ? Math.round((todaysCompletedCount / todaysTotalCount) * 100) : 0;

    const weeklyChartData = [{ name: '월', 저번주: 20, 이번주: 25 }, { name: '화', 저번주: 30, 이번주: 28 }];

    return (
        <div className="view-container">
            <header className="view-header">
                <div>
                    <h1>{userName}님, 어서오세요!</h1>
                    <p className="subtitle">오늘도 파이팅👊</p>
                </div>
            </header>
            <div className="dashboard-home-grid">
                <div className="stat-card-large stat-card-today">
                    <h3>오늘 진행률</h3>
                    <p className="progress-percent">{todaysProgress}%</p>
                    <span className="progress-detail">{todaysCompletedCount} / {todaysTotalCount} 완료</span>
                </div>
                <div className="stat-card-large stat-card-tomorrow">
                    <h3>내일 할 일</h3>
                    <p className="task-count">{tomorrowsTodosCount}개</p>
                    <span className="progress-detail">미리 계획해보세요!</span>
                </div>
                <div className="project-list-section">
                    <h3>오늘의 프로젝트 (중요도 순)</h3>
                    <TodoList todos={sortedTodayTodos} onRemove={deleteTodo} onToggle={toggleTodo} onEdit={() => setActiveView('TODAY')} />
                </div>
                <div className="weekly-chart-section">
                    <h3>주간 업무 비교</h3>
                    <WeeklyChart data={weeklyChartData} />
                </div>
                <aside className="right-sidebar">
                    <div className="progress-widget"><h4>오늘 진행률</h4><ProgressCircle percentage={todaysProgress}/></div>
                    <div className="calendar-widget"><h4>캘린더</h4><CalendarWidget /></div>
                </aside>
            </div>
        </div>
    );
};
export default DashboardHome;