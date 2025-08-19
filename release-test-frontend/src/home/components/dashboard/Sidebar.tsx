import React, { useState } from 'react';
import { FiGrid, FiSun, FiZap, FiCalendar, FiLogOut } from 'react-icons/fi';
import '../../style/dashboard/Sidebar.css';

interface MenuItem {
    name: string;
    icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
    { name: '오늘 할 일', icon: <FiGrid /> },
    { name: '내일 할 일', icon: <FiSun /> },
    { name: '중요 업무', icon: <FiZap /> },
    { name: '캘린더', icon: <FiCalendar /> },
];

const Sidebar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string>("오늘 할 일");

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">O</div>
                <span>Omagle</span>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            className={activeMenu === item.name ? 'active' : ''}
                            onClick={() => setActiveMenu(item.name)}
                        >
                            <a href="#">{item.icon} {item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <a href="#"><FiLogOut /> 로그아웃</a>
            </div>
        </aside>
    );
};
export default Sidebar;