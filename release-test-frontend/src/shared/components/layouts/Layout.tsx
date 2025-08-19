import React, {type ReactNode, useState, useEffect} from "react";
import Header from "./header/Header.tsx";
// import Footer from "./Footer.tsx";
import LoginModal from "../../../auth/modals/LoginModal.tsx";
import {useAuth} from "../../../auth/hooks/useAuth.ts";
import {useLocation} from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const {isLoggedIn} = useAuth();
    const location = useLocation();
    
    const showLoginModal = () => {
        setLoginModalOpen(true);
    }
    const closeLoginModal = () => {
        setLoginModalOpen(false);
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
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
                <Header showLoginModal={showLoginModal}/>
                <main className="w-full">
                    {children}
                </main>
                {/*<Footer/>*/}
            </div>
        </>
    );
};

export default Layout;