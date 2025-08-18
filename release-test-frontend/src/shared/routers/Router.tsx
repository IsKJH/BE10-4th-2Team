import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../home/pages/Home.tsx";
import SignUp from "../components/pages/SignUp.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import LoginRequired from "../components/pages/LoginRequired.tsx";
import MyPage from "../components/pages/MyPage.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home/>
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