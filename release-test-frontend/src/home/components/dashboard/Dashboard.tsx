import React, { useState, useMemo } from 'react';
import StatCard from './StatCard';
import WeeklyChart from './WeeklyChart';
import ProgressCircle from './ProgressCircle';
import CalendarWidget from './CalendarWidget';
import TodoList from '../todo/TodoList';
import TodoModal from '../todo/TodoModal';
import '../../style/dashboard/Dashboard.css';
import { useAppStore } from '../../../store/useAppStore'; // 👈 중앙 창고만 import!
import type { Priority } from '../../../types/release';

const Dashboard: React.FC = () => {
    const { todos: allTodos, addTodo, deleteTodo, toggleTodo } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // 중앙 데이터(allTodos)가 바뀔 때마다, 이 컴포넌트는 자동으로 다시 렌더링된다.
    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
    const tomorrowString = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    const todaysTodos = useMemo(() => allTodos.filter(t => t.dueDate === todayString), [allTodos, todayString]);
    const tomorrowsTodos = useMemo(() => allTodos.filter(t => t.dueDate === tomorrowString), [allTodos, tomorrowString]);

    const todaysCompletedCount = useMemo(() => todaysTodos.filter(t => t.completed).length, [todaysTodos]);
    const todaysTotalCount = todaysTodos.length;
    const todaysProgress = todaysTotalCount > 0 ? Math.round((todaysCompletedCount / todaysTotalCount) * 100) : 0;

    const weeklyChartData = [
        { name: '월', 저번주: 20, 이번주: 25 }, { name: '화', 저번주: 30, 이번주: 28 },
    ];

    const handleSave = (data: { text: string; priority: Priority }) => {
        addTodo({ ...data, dueDate: todayString });
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="dashboard-grid">
                <header className="dashboard-header">
                    <div><h2>Hello Roger</h2><p>Welcome back!</p></div>
                    <div className="header-actions">
                        <input type="search" placeholder="Search" />
                        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                            + Add a new task
                        </button>
                    </div>
                </header>
                <section className="main-stats">
                    <StatCard title="오늘 진행률" value={`${todaysProgress}%`} description={`${todaysCompletedCount} / ${todaysTotalCount} 완료`} />
                    <StatCard title="내일 할 일" value={`${tomorrowsTodos.length}개`} description="알림" />
                </section>
                <section className="todo-list-section">
                    <h3>오늘의 프로젝트</h3>
                    <TodoList
                        todos={todaysTodos}
                        onRemove={deleteTodo}
                        onToggle={toggleTodo}
                        onEdit={() => {}}
                    />
                </section>
                <section className="weekly-chart-section">
                    <h3>주간 업무 비교</h3>
                    <WeeklyChart data={weeklyChartData} />
                </section>
                <aside className="right-sidebar">
                    <div className="progress-widget"><h4>오늘 진행률</h4><ProgressCircle percentage={todaysProgress}/></div>
                    <div className="calendar-widget"><h4>캘린더</h4><CalendarWidget /></div>
                </aside>
            </div>

            {isModalOpen && (
                <TodoModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    todoToEdit={null}
                />
            )}
        </>
    );
};
export default Dashboard;
