import React from 'react';
import '../../style/dashboard/StatCard.css';

interface StatCardProps {
    title: string;
    value: string;
    type: 'progress' | 'tasks';
    description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type, description }) => {
    const cardClassName = `stat-card ${type}`;

    return (
        <div className={cardClassName}>
            <h3>{title}</h3>
            <p>{value}</p>
            {description && <span>{description}</span>}
        </div>
    );
};

export default StatCard;
