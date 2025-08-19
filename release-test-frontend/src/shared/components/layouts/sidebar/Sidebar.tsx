import React, { useState, useEffect } from 'react';
import { FiGrid, FiSun, FiZap, FiCalendar, FiLogOut, FiUser, FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { showConfirmAlert } from '../../../utils/sweetAlert';
import './Sidebar.css';

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path?: string;
    requireAuth?: boolean;
}

const menuItems: MenuItem[] = [
    { name: '홈', icon: <FiGrid />, path: '/' },
    { name: '내일 할 일', icon: <FiSun />, path: '/tomorrow' },
    { name: '중요 업무', icon: <FiZap />, path: '/important' },
    { name: '캘린더', icon: <FiCalendar />, path: '/calendar' },
    { name: '마이페이지', icon: <FiUser />, path: '/mypage', requireAuth: true },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const [activeMenu, setActiveMenu] = useState<string>("홈");
    const { logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 경로에 따라 활성 메뉴 결정하는 함수
    const getActiveMenuFromPath = (pathname: string): string => {
        switch (pathname) {
            case '/':
                return '홈';
            case '/mypage':
                return '마이페이지';
            case '/tomorrow':
                return '내일 할 일';
            case '/important':
                return '중요 업무';
            case '/calendar':
                return '캘린더';
            case '/signup':
            case '/login-required':
                return ''; // 특별 페이지는 활성 메뉴 없음
            default:
                return '홈'; // 알 수 없는 경로는 홈으로
        }
    };

    // URL 변경 시 활성 메뉴 업데이트
    useEffect(() => {
        const activeMenuName = getActiveMenuFromPath(location.pathname);
        setActiveMenu(activeMenuName);
    }, [location.pathname]);

    // 로그인 상태 변경 시 홈으로 이동 및 홈 메뉴 활성화
    useEffect(() => {
        if (location.pathname !== '/signup' && location.pathname !== '/login-required') {
            const activeMenuName = getActiveMenuFromPath(location.pathname);
            setActiveMenu(activeMenuName);
        }
    }, [isLoggedIn, location.pathname]);

    const handleMenuClick = (item: MenuItem) => {
        if (item.path) {
            navigate(item.path);
            // navigate가 URL을 변경하면 useEffect에서 자동으로 activeMenu가 업데이트됨
        }
    };

    const handleLogout = async () => {
        const result = await showConfirmAlert('로그아웃', '정말 로그아웃하시겠습니까?');
        if (result.isConfirmed) {
            logout();
        }
    };

    // 메뉴 아이템 필터링 (로그인 필요한 메뉴)
    const filteredMenuItems = menuItems.filter(item => 
        !item.requireAuth || (item.requireAuth && isLoggedIn)
    );

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button 
                className="toggle-btn"
                onClick={onToggle}
                aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
                {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
            </button>
            <div className="sidebar-header">
                <div className="logo">O</div>
                {!isCollapsed && <span>Omagle</span>}
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {filteredMenuItems.map((item) => (
                        <li
                            key={item.name}
                            className={activeMenu === item.name && activeMenu !== '' ? 'active' : ''}
                            onClick={() => handleMenuClick(item)}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                {item.icon} 
                                {!isCollapsed && <span>{item.name}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            {isLoggedIn && (
                <div className="sidebar-footer">
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleLogout(); }}
                        title={isCollapsed ? "로그아웃" : undefined}
                    >
                        <FiLogOut /> 
                        {!isCollapsed && <span>로그아웃</span>}
                    </a>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;