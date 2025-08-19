import React, {useCallback, useState, useEffect} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {NAV_ITEMS} from '../../../constants/navigation.ts';
import {useAuth} from "../../../../auth/hooks/useAuth.ts";
import {useNavigate, useLocation} from 'react-router-dom';

interface NavProps {
    showLoginModal: () => void;
}

export const MobileNav: React.FC<NavProps> = ({showLoginModal}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {isLoggedIn, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const routerNavigate = useCallback((path: string) => {
        navigate(path);
        setIsMenuOpen(false); // 메뉴 닫기
    }, [navigate]);

    const handleLogin = useCallback(() => {
        showLoginModal();
    }, [showLoginModal]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    // ESC 키로 모바일 메뉴 닫기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen, closeMenu]);
    return (
        <>
            <button
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            >
                {isMenuOpen ? <CloseIcon/> : <MenuIcon/>}
            </button>
            {isMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                    <nav className="px-4 py-6 space-y-4">
                        {NAV_ITEMS.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <a key={index}
                                   className={`block text-lg font-medium py-2 transition-colors cursor-pointer ${
                                       isActive 
                                           ? 'text-[#1993e5] font-semibold bg-blue-50 px-2 rounded-md' 
                                           : 'text-gray-600 hover:text-gray-900'
                                   }`}
                                   onClick={() => routerNavigate(item.path)}>
                                    {item.name}
                                </a>
                            );
                        })}
                        {!isLoggedIn ? (
                            <>
                                <hr className="my-4 border-gray-200"/>
                                <div className="space-y-3">
                                    <a className="block text-center text-sm font-medium text-white bg-gradient-to-r from-[#1993e5] to-[#1976d2] px-6 py-3 rounded-full cursor-pointer"
                                       onClick={handleLogin}>로그인</a>
                                </div>
                            </>) : (
                            <>
                                <hr className="my-4 border-gray-200"/>
                                <div className="space-y-2">
                                    <a className="block text-sm text-gray-700 hover:text-gray-900 py-2 transition-colors cursor-pointer"
                                       onClick={() => routerNavigate('/mypage')}>마이페이지</a>
                                    <a className="block text-sm text-red-600 hover:text-red-700 py-2 transition-colors cursor-pointer"
                                       onClick={() => {
                                           if (confirm('정말 로그아웃하시겠습니까?')) {
                                               logout();
                                           }
                                       }}>로그아웃</a>
                                </div>
                            </>)}
                    </nav>
                </div>
            )}
        </>
    );
}

export default MobileNav;