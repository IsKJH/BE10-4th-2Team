import React from 'react';
import { FiHome, FiGrid, FiSun, FiZap, FiCalendar, FiCheckSquare, FiLogOut } from 'react-icons/fi';
import type {ViewType} from '../../pages/DashboardPage';
import '../../style/dashboard/Sidebar.css';

interface SidebarProps { activeView: ViewType; setActiveView: (view: ViewType) => void; }

const menuItems = [
    { view: 'DASHBOARD', name: '홈', icon: <FiHome /> },
    { view: 'TODAY', name: '오늘 할 일', icon: <FiGrid /> },
    { view: 'TOMORROW', name: '내일 할 일', icon: <FiSun /> },
    { view: 'IMPORTANT', name: '중요 업무', icon: <FiZap /> },
    { view: 'CALENDAR', name: '캘린더', icon: <FiCalendar /> },
    { view: 'COMPLETED', name: '완료된 업무', icon: <FiCheckSquare /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header"><div className="logo">O</div><span>Omagle</span></div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.view} className={activeView === item.view ? 'active' : ''} onClick={() => setActiveView(item.view as ViewType)}>
                            <a href="#">{item.icon} {item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer"><a href="#"><FiLogOut /> 로그아웃</a></div>
        </aside>
    );
};
export default Sidebar;