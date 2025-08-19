import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import TodayView from '../components/views/TodayView';
import TomorrowView from '../components/views/TomorrowView';
import ImportantView from '../components/views/ImportantView';
import CalendarView from '../components/views/CalendarView';
import CompletedView from '../components/views/CompletedView';

export type ViewType = 'DASHBOARD' | 'TODAY' | 'TOMORROW' | 'IMPORTANT' | 'CALENDAR' | 'COMPLETED';

const DashboardPage: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');

    const renderView = () => {
        switch (activeView) {
            case 'DASHBOARD': return <DashboardHome setActiveView={setActiveView} />;
            case 'TODAY': return <TodayView />;
            case 'TOMORROW': return <TomorrowView />;
            case 'IMPORTANT': return <ImportantView />;
            case 'CALENDAR': return <CalendarView />;
            case 'COMPLETED': return <CompletedView />;
            default: return <DashboardHome setActiveView={setActiveView} />;
        }
    };

    return (
        <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
            {renderView()}
        </DashboardLayout>
    );
};
export default DashboardPage;