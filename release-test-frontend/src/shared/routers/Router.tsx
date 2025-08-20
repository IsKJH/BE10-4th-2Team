import {Route, Routes} from "react-router-dom";
import React from "react";
import NotFound from "@/shared/components/pages/NotFound";
import SignUp from "@/auth/pages/SignUp";
import ProtectedRoute from "@/auth/components/auth/ProtectedRoute";
import LoginRequired from "@/auth/pages/LoginRequired";
import MyPage from "@/auth/pages/MyPage";
import TodayView from "@/home/components/views/TodayView";
import TomorrowView from "@/home/components/views/TomorrowView";
import ImportantView from "@/home/components/views/ImportantView";
import CalendarView from "@/home/components/views/CalendarView";
import CompletedView from "@/home/components/views/CompletedView";
import DashboardHome from "@/home/components/dashboard/DashboardHome";

const Router: React.FC = () => {
    return (
        <Routes>
            {/* 로그인 필수 페이지들 */}
            <Route path="/" element={<ProtectedRoute><DashboardHome/></ProtectedRoute>}/>
            <Route path="/today" element={<ProtectedRoute><TodayView/></ProtectedRoute>}/>
            <Route path="/tomorrow" element={<ProtectedRoute><TomorrowView/></ProtectedRoute>}/>
            <Route path="/important" element={<ProtectedRoute><ImportantView/></ProtectedRoute>}/>
            <Route path="/calendar" element={<ProtectedRoute><CalendarView/></ProtectedRoute>}/>
            <Route path="/completed" element={<ProtectedRoute><CompletedView/></ProtectedRoute>}/>
            <Route path="/mypage" element={<ProtectedRoute><MyPage/></ProtectedRoute>}/>

            {/* 로그인 불필요 페이지들 */}
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login-required" element={<LoginRequired/>}/>

            {/* 404 페이지 */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default Router;