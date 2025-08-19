import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import DashboardLayout from "../layouts/DashboardLayout";

const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout>
            <Dashboard />
        </DashboardLayout>
    );
};

export default DashboardPage;