import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TodoList from '@/home/components/todo/TodoList';
import TodoModal from '@/home/components/todo/TodoModal';
import StatCard from '@/home/components/dashboard/StatCard';
import WeeklyChart from '@/home/components/dashboard/WeeklyChart';
import ProgressCircle from '@/home/components/dashboard/ProgressCircle';
import CalendarWidget from '@/home/components/dashboard/CalendarWidget';
import '@/home/style/dashboard/DashboardHome.css';
import type { Priority } from '@/types/release';

const DashboardHome: React.FC = () => {
    const { todos: allTodos, addTodo, deleteTodo, toggleTodo, userName } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

    const todaysTodos = useMemo(() => allTodos.filter(t => t.dueDate === todayString), [allTodos, todayString]);
    const todaysCompletedCount = useMemo(() => todaysTodos.filter(t => t.completed).length, [todaysTodos]);
    const todaysTotalCount = todaysTodos.length;
    const todaysProgress = todaysTotalCount > 0 ? Math.round((todaysCompletedCount / todaysTotalCount) * 100) : 0;

    const weeklyChartData = [
        { name: '월', 저번주: 20, 이번주: 25 }, { name: '화', 저번주: 30, 이번주: 28 },
        { name: '수', 저번주: 22, 이번주: 35 }, { name: '목', 저번주: 40, 이번주: 38 },
        { name: '금', 저번주: 50, 이번주: 45 },
    ];

    const handleSave = (data: { text: string; priority: Priority }) => {
        addTodo({ ...data, dueDate: todayString });
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="dashboard-grid">
                <header className="dashboard-header">
                    <div>
                        <h2>Hello {userName}</h2><p>Welcome back!</p>
                    </div>
                    <div className="header-actions">
                        <input type="search" placeholder="Search" />
                        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>+ Add a new task</button>
                    </div>
                </header>
                <section className="main-stats">
                    <StatCard title="오늘의 할 일" value={`${todaysTodos.length}개`} description={`${todaysCompletedCount}개 완료`} type="progress"/>
                    <StatCard title="전체 진행률" value={`${todaysProgress}%`} type="tasks" />
                </section>
                <section className="project-list-section">
                    <h3>오늘의 프로젝트</h3>
                    <TodoList todos={todaysTodos} onRemove={deleteTodo} onToggle={toggleTodo} onEdit={() => {}}/>
                </section>
                <section className="weekly-chart-section">
                    <h3>주간 업무 비교</h3><WeeklyChart data={weeklyChartData} />
                </section>
                <aside className="right-sidebar">
                    <div className="progress-widget"><h4>전체 진행률</h4><ProgressCircle percentage={89} /></div>
                    <div className="calendar-widget"><h4>캘린더</h4><CalendarWidget /></div>
                </aside>
            </div>
            {isModalOpen && (<TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSave} todoToEdit={null}/>)}
        </>
    );
};
export default DashboardHome;