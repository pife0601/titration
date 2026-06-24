import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

export default function TitrationGraph({ data, currentVt, currentPh, hoverData, setHoverData }) {
  // Tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
          <p style={{ color: '#60a5fa', margin: 0 }}>투입량: {payload[0].payload.volume} mL</p>
          <p style={{ color: '#f8fafc', margin: 0 }}>pH: {payload[0].payload.pH}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel flex-col w-full" style={{ height: '400px' }}>
      <h2 className="mb-4">중화적정 곡선</h2>
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setHoverData(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoverData(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="volume" 
              type="number"
              domain={[0, 'dataMax']}
              stroke="#94a3b8" 
              label={{ value: '적정액 투입량 (mL)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
            />
            <YAxis 
              domain={[0, 14]} 
              stroke="#94a3b8"
              label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              ticks={[0, 2, 4, 6, 7, 8, 10, 12, 14]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 전체 예상 곡선 */}
            <Line 
              type="monotone" 
              dataKey="pH" 
              stroke="#4ade80" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#22c55e' }}
            />
            
            {/* 현재 위치를 나타내는 점 */}
            <ReferenceDot 
              x={hoverData ? hoverData.volume : currentVt} 
              y={hoverData ? hoverData.pH : currentPh} 
              r={8} 
              fill="#ef4444" 
              stroke="#fff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
