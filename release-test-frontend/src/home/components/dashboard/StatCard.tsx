import React from 'react';

import '@/home/style/dashboard/StatCard.css';

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    type: 'progress' | 'tasks';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, type }) => {
    const cardClassName = `stat-card ${type}`;

    return (
        <div className={cardClassName}>
            <div className="stat-card-header">
                <h3 className="stat-card-title">{title}</h3>
            </div>
            <p className="stat-card-value">{value}</p>
            {description && <span className="stat-card-description">{description}</span>}
        </div>
    );
};

export default StatCard;