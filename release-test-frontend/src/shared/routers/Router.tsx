import {Route, Routes} from "react-router-dom";
import React from "react";
import SignUp from "../../auth/pages/SignUp.tsx";
import ProtectedRoute from "../../auth/components/auth/ProtectedRoute.tsx";
import LoginRequired from "../../auth/pages/LoginRequired.tsx";
import MyPage from "../../auth/pages/MyPage.tsx";
import TodayView from "../../home/components/views/TodayView.tsx";
import TomorrowView from "../../home/components/views/TomorrowView.tsx";
import ImportantView from "../../home/components/views/ImportantView.tsx";
import CalendarView from "../../home/components/views/CalendarView.tsx";
import CompletedView from "../../home/components/views/CompletedView.tsx";
import DashboardHome from "../../home/components/dashboard/DashboardHome.tsx";

const Router: React.FC = () => {
    return (
        <Routes>
            {/* 로그인 필수 페이지들 */}
            <Route path="/" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/today" element={<ProtectedRoute><TodayView /></ProtectedRoute>} />
            <Route path="/tomorrow" element={<ProtectedRoute><TomorrowView /></ProtectedRoute>} />
            <Route path="/important" element={<ProtectedRoute><ImportantView /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/completed" element={<ProtectedRoute><CompletedView /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

            {/* 로그인 불필요 페이지들 */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login-required" element={<LoginRequired />} />
        </Routes>
    );
}

export default Router;