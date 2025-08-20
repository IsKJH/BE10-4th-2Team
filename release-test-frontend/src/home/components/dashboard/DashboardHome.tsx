import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/home/store/useAppStore';
import { useAuth } from '@/auth/hooks/useAuth';
import TodoList from '@/home/components/todo/TodoList';
import TodoModal from '@/home/components/todo/TodoModal';
import StatCard from '@/home/components/dashboard/StatCard';
import WeeklyChart from '@/home/components/dashboard/WeeklyChart';
import ProgressCircle from '@/home/components/dashboard/ProgressCircle';
import CalendarWidget from '@/home/components/dashboard/CalendarWidget';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import LoginRequired from '@/auth/pages/LoginRequired';
import '@/home/style/dashboard/DashboardHome.css';
import type { Priority, Release, WeeklyData } from '@/home/types/release';

interface UserInfo {
    nickname: string;
    email: string;
    loginType: string;
    isNewUser: boolean;
}

const DashboardHome: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const { 
        dashboardData,
        todos,
        addTodo,
        updateTodo,
        deleteTodo, 
        toggleTodo, 
        userName, 
        loadDashboardData, 
        loadTodosByDate,
        loadAllCompletedTodos,
        isLoading 
    } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTodo, setEditingTodo] = useState<Release | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [allCompletedTodos, setAllCompletedTodos] = useState<Release[]>([]);

    const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

    // 사용자 정보 로드
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
            } catch (error) {
                console.error('Failed to parse user info:', error);
            }
        }
    }, []);

    // 로그인 상태일 때만 데이터 로드
    useEffect(() => {
        if (isLoggedIn) {
            loadDashboardData();
            loadTodosByDate(todayString);
        }
    }, [isLoggedIn, loadDashboardData, loadTodosByDate, todayString]);

    // 주간 차트용 완료된 할일 데이터 로드
    useEffect(() => {
        if (isLoggedIn) {
            const loadWeeklyData = async () => {
                try {
                    const completedTodos = await loadAllCompletedTodos();
                    setAllCompletedTodos(completedTodos);
                } catch (error) {
                    console.error('Failed to load weekly chart data:', error);
                }
            };
            loadWeeklyData();
        }
    }, [isLoggedIn, loadAllCompletedTodos]);

    // 로그인 상태 변경 감지
    useEffect(() => {
        const handleAuthChange = () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                try {
                    const parsedUserInfo = JSON.parse(storedUserInfo);
                    setUserInfo(parsedUserInfo);
                    // 로그인 후에만 데이터 새로고침
                    if (isLoggedIn) {
                        loadDashboardData();
                        loadTodosByDate(todayString);
                    }
                } catch (error) {
                    console.error('Failed to parse user info:', error);
                }
            } else {
                setUserInfo(null);
            }
        };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('userInfoChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('userInfoChange', handleAuthChange);
        };
    }, [isLoggedIn, loadDashboardData, loadTodosByDate, todayString]);

    const getGreetingMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "좋은 아침입니다";
        if (hour < 18) return "좋은 오후입니다";
        return "좋은 저녁입니다";
    };

    const displayName = userInfo?.nickname || userName || '사용자';

    // 실제 todos에서 오늘 날짜 할 일들 추출
    const allTodaysTodos = todos || [];
    
    // 통계 계산
    const todaysCompletedCount = allTodaysTodos.filter(todo => todo.completed).length;
    const todaysTotalCount = allTodaysTodos.length;
    const todaysProgress = todaysTotalCount > 0 ? Math.round((todaysCompletedCount / todaysTotalCount) * 100) : 0;
    
    // 실시간 진행률 사용 (대시보드 데이터보다 우선)
    const overallProgress = todaysProgress;
    
    // 실제 완료된 업무 데이터를 기반으로 한 주간 데이터 생성
    const weeklyChartData: WeeklyData[] = useMemo(() => {
        // 로드된 완료된 할일 데이터를 사용하여 주간 차트 생성
        const currentDate = new Date();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        
        // 이번주와 저번주 시작일 계산
        const thisWeekStart = new Date(currentDate);
        thisWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);
        
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);
        
        return weekdays.map((dayName, dayIndex) => {
            // 이번주 해당 요일
            const thisWeekDay = new Date(thisWeekStart);
            thisWeekDay.setDate(thisWeekStart.getDate() + dayIndex);
            
            // 저번주 해당 요일  
            const lastWeekDay = new Date(lastWeekStart);
            lastWeekDay.setDate(lastWeekStart.getDate() + dayIndex);
            
            // 날짜 문자열 생성 (YYYY-MM-DD 형식)
            const thisWeekDateStr = thisWeekDay.toISOString().split('T')[0];
            const lastWeekDateStr = lastWeekDay.toISOString().split('T')[0];
            
            // 로드된 완료된 할일 데이터에서 해당 날짜의 완료된 할일 개수 계산
            const thisWeekCompleted = allCompletedTodos.filter(todo => 
                todo.dueDate === thisWeekDateStr
            ).length;
            
            const lastWeekCompleted = allCompletedTodos.filter(todo => 
                todo.dueDate === lastWeekDateStr
            ).length;
            
            // 개발환경에서만 데이터 확인 로그
            if (import.meta.env.DEV && dayIndex === 0) {
                console.log(`[주간차트] 전체 완료된 todos: ${allCompletedTodos.length}개`);
                console.log(`[주간차트] 이번주 ${dayName}(${thisWeekDateStr}): ${thisWeekCompleted}개 완료`);
                console.log(`[주간차트] 저번주 ${dayName}(${lastWeekDateStr}): ${lastWeekCompleted}개 완료`);
            }
            
            return {
                name: dayName,
                저번주: lastWeekCompleted,
                이번주: thisWeekCompleted,
            };
        });
    }, [allCompletedTodos]);

    // 검색된 할 일 목록 필터링
    const todaysTodos = useMemo(() => {
        if (!searchQuery.trim()) {
            return allTodaysTodos;
        }
        return allTodaysTodos.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allTodaysTodos, searchQuery]);

    const openModal = (todo: Release | null = null) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleSave = (data: { text: string; priority: Priority }) => {
        if (editingTodo) {
            updateTodo(editingTodo.id, data);
        } else {
            addTodo({ ...data, dueDate: todayString });
        }
        setIsModalOpen(false);
        setEditingTodo(null);
    };

    // 할 일 토글 시 주간 차트 데이터 업데이트
    const handleToggleTodo = async (id: number) => {
        await toggleTodo(id);
        
        // 주간 차트 데이터 새로고침
        try {
            const completedTodos = await loadAllCompletedTodos();
            setAllCompletedTodos(completedTodos);
        } catch (error) {
            console.error('Failed to refresh weekly chart data:', error);
        }
    };

    // 로그인되지 않은 경우 로그인 페이지 표시
    if (!isLoggedIn) {
        return <LoginRequired />;
    }

    if (isLoading && !dashboardData) {
        return (
            <div className="dashboard-grid">
                <LoadingSpinner 
                    size="lg" 
                    color="primary" 
                    message="대시보드 데이터를 불러오는 중..."
                    className="min-h-96"
                />
            </div>
        );
    }

    return (
        <>
            <div className={`dashboard-grid ${isLoading ? 'loading' : ''}`}>
                <header className="dashboard-header">
                    <div>
                        <h2>안녕하세요, {displayName}님!</h2>
                        <p>{getGreetingMessage()} 오늘도 화이팅하세요! 🎉</p>
                        {userInfo && (
                            <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                                    {userInfo.loginType}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">{userInfo.email}</span>
                            </div>
                        )}
                    </div>
                    <div className="header-actions">
                        <input 
                            type="search" 
                            placeholder="오늘의 할 일 검색..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button className="add-task-btn" onClick={() => openModal()}>
                            + 새 할 일 추가
                        </button>
                    </div>
                </header>
                <section className="main-stats">
                    <StatCard title="오늘의 할 일" value={`${todaysTotalCount}개`} description={`${todaysCompletedCount}개 완료`} type="progress"/>
                    <StatCard title="전체 진행률" value={`${todaysProgress}%`} type="tasks" />
                </section>
                <section className="project-list-section">
                    <h3>
                        오늘의 프로젝트
                        {searchQuery && (
                            <span className="search-result-info">
                                "{searchQuery}" 검색결과 ({todaysTodos.length}개)
                            </span>
                        )}
                    </h3>
                    <TodoList todos={todaysTodos} onRemove={deleteTodo} onToggle={handleToggleTodo} onEdit={openModal}/>
                </section>
                <section className="weekly-chart-section">
                    <h3>주간 업무 비교</h3><WeeklyChart data={weeklyChartData} />
                </section>
                <aside className="right-sidebar">
                    <div className="progress-widget">
                        <h4>전체 진행률</h4>
                        <ProgressCircle percentage={overallProgress} />
                    </div>
                    <div className="calendar-widget"><h4>캘린더</h4><CalendarWidget /></div>
                </aside>
            </div>
            {isModalOpen && (<TodoModal onClose={() => setIsModalOpen(false)} onSave={handleSave} todoToEdit={editingTodo}/>)}
        </>
    );
};
export default DashboardHome;