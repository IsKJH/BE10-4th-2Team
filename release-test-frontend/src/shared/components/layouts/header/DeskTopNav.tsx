import React, {useCallback, useEffect, useState} from "react";
import {NAV_ITEMS} from "../../../constants/navigation.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

interface NavProps {
    showLoginModal: () => void;
}

const DeskTopNav: React.FC<NavProps> = ({showLoginModal}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const {isLoggedIn, logout} = useAuth();
    const [nickName, setNickname] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const routerNavigate = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    const updateNickname = useCallback(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setNickname(parsedUserInfo.nickname || "");
        } else {
            setNickname("");
        }
    }, []);

    useEffect(() => {
        // 초기 로드 시 닉네임 설정
        updateNickname();
        
        // localStorage 변경 감지 (다른 탭에서의 변경)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'userInfo') {
                updateNickname();
            }
        };
        
        // 커스텀 이벤트 리스너 (같은 탭 내에서의 변경 감지)
        const handleAuthChange = () => {
            updateNickname();
        };
        
        const handleUserInfoChange = () => {
            updateNickname();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('userInfoChange', handleUserInfoChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('userInfoChange', handleUserInfoChange);
        };
    }, [updateNickname]);

    const handleLogin = useCallback(() => {
        showLoginModal();
    }, [showLoginModal]);

    const toggleProfile = useCallback(() => {
        setIsProfileOpen(prev => !prev);
    }, []);

    const closeProfile = useCallback(() => {
        setIsProfileOpen(false);
    }, []);

    // ESC 키로 프로필 메뉴 닫기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isProfileOpen) {
                closeProfile();
            }
        };

        if (isProfileOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isProfileOpen, closeProfile]);
    return (
        <>
            <nav className="hidden items-center gap-8 md:flex">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <a key={index}
                           className={`text-lg font-medium transition-all hover:scale-105 relative group cursor-pointer ${
                               isActive 
                                   ? 'text-[#1993e5] font-semibold' 
                                   : 'text-gray-600 hover:text-gray-900'
                           }`}
                           onClick={() => routerNavigate(item.path)}>
                            {item.name}
                            <span
                                className={`absolute -bottom-1 left-0 h-0.5 bg-[#1993e5] transition-all ${
                                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </a>
                    );
                })}
            </nav>
            <div className="hidden md:flex items-center gap-4">
                {!isLoggedIn ? (
                    <>
                        <div className="flex items-center">
                            <a className="text-sm font-medium text-white bg-gradient-to-r from-[#1993e5] to-[#1976d2] px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                               onClick={handleLogin}>로그인</a>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-0.5">
                            <div className="relative">
                                <button
                                    onClick={toggleProfile}
                                    aria-label="프로필 메뉴 열기"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                    className="flex h-11 p-4 items-center justify-center rounded-full bg-gradient-to-r from-[#1993e5] to-[#1976d2] text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                                    {nickName}
                                </button>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10"
                                             onClick={closeProfile}></div>
                                        <div
                                            className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2">
                                            <a className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                               onClick={() => {
                                                   routerNavigate('/mypage');
                                                   closeProfile();
                                               }}>
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                                마이페이지
                                            </a>
                                            <hr className="my-2 border-gray-100"/>
                                            <a className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                               onClick={() => {
                                                   if (confirm('정말 로그아웃하시겠습니까?')) {
                                                       logout();
                                                       closeProfile();
                                                   }
                                               }}>
                                                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                                로그아웃
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default DeskTopNav;