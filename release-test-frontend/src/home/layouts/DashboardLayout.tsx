import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import type {ViewType} from '../pages/DashboardPage';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ activeView, setActiveView, children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="main-content">{children}</main>
        </div>
    );
};
export default DashboardLayout;
