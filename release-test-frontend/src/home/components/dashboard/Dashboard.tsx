import React, {useState, useEffect} from 'react';
import axios from 'axios';
import StatCard from './StatCard';
import WeeklyChart from './WeeklyChart';
import ProgressCircle from './ProgressCircle';
import CalendarWidget from './CalendarWidget';
import TodoList from '../todo/TodoList';
import TodoModal from '../todo/TodoModal';
import '../../style/dashboard/Dashboard.css';
import type {DashboardData, Release} from '../../types/release';

const DASHBOARD_API_URL = 'http://localhost:8080/api/dashboard';
const TODO_API_URL = 'http://localhost:8080/api/todos';

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<DashboardData>(DASHBOARD_API_URL);
                setDashboardData(response.data);
            } catch (err) {
                setError('API 연결 실패! 샘플 데이터로 표시합니다.');
                setDashboardData({
                    todaysTodos: [
                        {
                            id: 1,
                            text: 'UI/UX 디자인 컨셉 확정',
                            completed: false,
                            priority: 'HIGH',
                            userId: 1,
                            dueDate: '2025-08-18'
                        },
                        {
                            id: 2,
                            text: '백엔드 API 명세서 작성',
                            completed: true,
                            priority: 'HIGH',
                            userId: 1,
                            dueDate: '2025-08-18'
                        },
                        {
                            id: 3,
                            text: 'DB 스키마 디자인',
                            completed: false,
                            priority: 'MEDIUM',
                            userId: 1,
                            dueDate: '2025-08-18'
                        },
                    ],
                    todaysCompletedCount: 1,
                    todaysTotalCount: 3,
                    overallProgress: 89,
                    weeklyChartData: [
                        {name: '월', 저번주: 20, 이번주: 25}, {name: '화', 저번주: 30, 이번주: 28},
                        {name: '수', 저번주: 22, 이번주: 35}, {name: '목', 저번주: 27, 이번주: 29},
                        {name: '금', 저번주: 18, 이번주: 40}, {name: '토', 저번주: 23, 이번주: 15},
                        {name: '일', 저번주: 10, 이번주: 12},
                    ],
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // 할 일 추가 버튼을 눌렀을 때 실행
    const handleInsert = async (text: string) => {
        if (!text || !dashboardData) return;
        try {
            const response = await axios.post<Release>(TODO_API_URL, {text});

            setDashboardData({
                ...dashboardData,
                todaysTodos: [...dashboardData.todaysTodos, response.data],
                todaysTotalCount: dashboardData.todaysTotalCount + 1,
            });
            setIsLoading(false); // 추가 후 모달 닫기
        } catch (err) {
            console.error("투두 추가 실패: ", err);
            alert("할 일 추가에 실패했습니다.")
        }
    };

    if (isLoading) return <div className="loading-message">대시보드 데이터를 불러오는 중입니다...</div>;
    if (!dashboardData) return <div className="error-message">{error}</div>;

    const {todaysTodos, todaysCompletedCount, todaysTotalCount, overallProgress, weeklyChartData} = dashboardData;
    const todaysProgress = todaysTotalCount > 0 ? Math.round((todaysCompletedCount / todaysTotalCount) * 100) : 0;

    return (
        <>
            <div className="dashboard-grid">
                <header className="dashboard-header">
                    <div><h2>Hello Roger</h2><p>Welcome back!</p></div>
                    <div className="header-actions">
                        <input type="search" placeholder="Search"/>
                        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                            + Add a new task
                        </button>
                    </div>
                </header>
                <section className="main-stats">
                    <StatCard title="오늘 할 일" value={todaysTotalCount.toString()} description="중요도 순으로 정렬됨"/>
                    <StatCard title="오늘 끝낸 일" value={`${todaysCompletedCount} / ${todaysTotalCount}`}
                              description={`${todaysProgress}% 달성`}/>
                </section>
                <section className="todo-list-section">
                    <h3>오늘의 프로젝트</h3>
                    <TodoList todos={todaysTodos} onRemove={() => {
                    }} onToggle={() => {
                    }}/>
                </section>
                <section className="weekly-chart-section">
                    <h3>주간 업무 비교</h3>
                    <WeeklyChart data={weeklyChartData}/>
                </section>
                <aside className="right-sidebar">
                    <div className="progress-widget"><h4>전체 진행률</h4><ProgressCircle percentage={overallProgress}/></div>
                    <div className="calendar-widget"><h4>캘린더</h4><CalendarWidget/></div>
                </aside>
            </div>

            {/* 모달이 열려있을 때만 렌더링 */}
            {isModalOpen && (
                <TodoModal onClose={() => setIsModalOpen(false)} onInsert={handleInsert}/>
            )}
        </>
    );
};
export default Dashboard;