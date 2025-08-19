import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import '../../style/dashboard/ProgressCircle.css';

interface ProgressCircleProps {
    percentage: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({percentage}) => {
    const data = [
        {value: percentage},
        {value: 100 - percentage}];

    return (
        <div className="progress-circle-container">
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={data}
                         cx="50%"
                         cy="50%"
                         innerRadius={40}
                         outerRadius={60}
                         dataKey="value"
                         startAngle={90}
                         endAngle={-270}>

                        <Cell fill="#8884d8"/>
                        <Cell fill="#f0f0f0"/>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="progress-circle-label">{percentage}%</div>
        </div>
    );
};
export default ProgressCircle;