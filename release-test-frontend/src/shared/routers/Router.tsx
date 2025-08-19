import {Route, Routes} from "react-router-dom";
import React from "react";
import SignUp from "../../auth/pages/SignUp.tsx";
import ProtectedRoute from "../../auth/components/auth/ProtectedRoute.tsx";
import LoginRequired from "../../auth/pages/LoginRequired.tsx";
import MyPage from "../../auth/pages/MyPage.tsx";
import Dashboard from "../../home/components/dashboard/Dashboard.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }/>
                <Route path="/mypage" element={
                    <ProtectedRoute>
                        <MyPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/login-required" element={<LoginRequired/>}/>
            </Routes>
        </>
    );
}
export default Router