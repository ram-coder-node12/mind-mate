import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BurnoutCard = ({ score, level, message }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (score) => {
    if (score >= 70) return 'var(--danger)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--success)';
  };

  const color = getColor(score);

  return (
    <div className="glass-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h3 style={{ marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Burnout Risk</h3>
      
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="var(--card-border)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '800', color: color }}>{score}%</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{level}</span>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: `${color}10`, 
        borderRadius: '12px',
        border: `1px solid ${color}30`
      }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{message}</p>
      </div>
    </div>
  );
};

export default BurnoutCard;
