import React, { useState, useEffect } from 'react';
import { FiGrid, FiSun, FiZap, FiCalendar, FiLogOut, FiUser, FiMenu, FiChevronLeft, FiCheckSquare, FiHome } from 'react-icons/fi';
import { useAuth } from '@/auth/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { showConfirmAlert } from '@/shared/utils/sweetAlert';
import './Sidebar.css';

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path?: string;
    requireAuth?: boolean;
}

const menuItems: MenuItem[] = [
    { name: '대시보드', icon: <FiHome />, path: '/' },
    { name: '오늘 할 일', icon: <FiGrid />, path: '/today' },
    { name: '내일 할 일', icon: <FiSun />, path: '/tomorrow' },
    { name: '중요 업무', icon: <FiZap />, path: '/important' },
    { name: '캘린더', icon: <FiCalendar />, path: '/calendar' },
    { name: '완료된 업무', icon: <FiCheckSquare />, path: '/completed' },
    { name: '마이페이지', icon: <FiUser />, path: '/mypage', requireAuth: true },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const [activeMenu, setActiveMenu] = useState<string>("대시보드");
    const { logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveMenuFromPath = (pathname: string): string => {
        const menuItem = menuItems.find(item => item.path === pathname);
        if (menuItem) {
            return menuItem.name;
        }
        if (['/signup', '/login-required'].includes(pathname)) {
            return '';
        }
        return '대시보드';
    };

    useEffect(() => {
        const activeMenuName = getActiveMenuFromPath(location.pathname);
        setActiveMenu(activeMenuName);
    }, [location.pathname]);


    const handleMenuClick = (item: MenuItem) => {
        if (item.path) {
            navigate(item.path);
        }
    };

    const handleLogout = async () => {
        const result = await showConfirmAlert('로그아웃', '정말 로그아웃하시겠습니까?');
        if (result.isConfirmed) {
            logout();
        }
    };

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
                {!isCollapsed && <span>지건오피스</span>}
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