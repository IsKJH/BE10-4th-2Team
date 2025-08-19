import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import './DashboardLayout.css';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
