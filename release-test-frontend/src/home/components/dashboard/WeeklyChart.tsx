import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import type {WeeklyData} from '@/home/types/release';

interface WeeklyChartProps {
    data: WeeklyData[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({data}) => (
    <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="저번주" stroke="#8884d8"/>
            <Line type="monotone" dataKey="이번주" stroke="#82ca9d"/>
        </LineChart>
    </ResponsiveContainer>
);
export default WeeklyChart;