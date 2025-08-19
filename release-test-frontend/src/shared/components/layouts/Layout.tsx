import React, {type ReactNode, useState, useEffect} from "react";
import Sidebar from "./sidebar/Sidebar.tsx";
import LoginModal from "../../../auth/modals/LoginModal.tsx";
import {useAuth} from "../../../auth/hooks/useAuth.ts";
import {useLocation} from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const {isLoggedIn} = useAuth();
    const location = useLocation();
    
    const showLoginModal = () => {
        setLoginModalOpen(true);
    }
    const closeLoginModal = () => {
        setLoginModalOpen(false);
    }
    
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    }
    
    // 로그인 상태가 변경되면 모달 닫기
    useEffect(() => {
        if (isLoggedIn) {
            setLoginModalOpen(false);
        }
    }, [isLoggedIn]);
    
    // 페이지가 회원가입 페이지로 변경되면 모달 닫기
    useEffect(() => {
        if (location.pathname === '/signup') {
            setLoginModalOpen(false);
        }
    }, [location.pathname]);
    
    return (
        <>
            {loginModalOpen && <LoginModal closeLoginModal={closeLoginModal}/>}
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar 
                    isCollapsed={sidebarCollapsed} 
                    onToggle={toggleSidebar}
                />
                <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                    sidebarCollapsed ? 'ml-0' : 'ml-0'
                }`}>
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;