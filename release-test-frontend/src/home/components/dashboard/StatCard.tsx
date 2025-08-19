import React from 'react';
import '../../style/dashboard/StatCard.css';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
}

export const StatCard: React.FC<StatCardProps> = ({title, value, description}) => (
    <div className="stat-card">
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{description}</span>
    </div>
);
export default StatCard;
