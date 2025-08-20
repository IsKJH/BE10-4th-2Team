import React, { useState, useEffect } from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import '@/home/style/dashboard/ProgressCircle.css';

interface ProgressCircleProps {
    percentage: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({percentage}) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const [previousPercentage, setPreviousPercentage] = useState(0);
    
    // 부드러운 애니메이션 효과
    useEffect(() => {
        const startTime = Date.now();
        const duration = 800; // 0.8초 애니메이션
        const startValue = previousPercentage;
        const targetValue = percentage;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutCubic 애니메이션 함수
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);
            
            // 시작값에서 목표값으로 보간
            const currentValue = Math.round(startValue + (targetValue - startValue) * easedProgress);
            
            setAnimatedPercentage(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setPreviousPercentage(percentage);
            }
        };
        
        requestAnimationFrame(animate);
    }, [percentage, previousPercentage]);

    const data = [
        {value: animatedPercentage},
        {value: 100 - animatedPercentage}
    ];

    return (
        <div className="progress-circle-container">
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie 
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        animationBegin={0}
                        animationDuration={1000}
                        animationEasing="ease-out"
                    >
                        <Cell fill="var(--secondary-600, #8b5cf6)"/>
                        <Cell fill="var(--gray-200, #e5e7eb)"/>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="progress-circle-label">{animatedPercentage}%</div>
        </div>
    );
};
export default ProgressCircle;