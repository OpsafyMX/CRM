import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

const SalesChart = () => {
    // Mock data for the last 6 months
    const data = [
        { month: 'Jun', value: 45000 },
        { month: 'Jul', value: 52000 },
        { month: 'Ago', value: 48000 },
        { month: 'Sep', value: 61000 },
        { month: 'Oct', value: 55000 },
        { month: 'Nov', value: 67000 }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value / 1000}K`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        fontSize: '12px'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SalesChart;
