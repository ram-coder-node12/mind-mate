import React from 'react';

const StatCard = ({ label, value, unit, icon: Icon, color, trend }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          background: `${color}15`, 
          color: color, 
          padding: '10px', 
          borderRadius: '12px',
          display: 'flex'
        }}>
          {React.createElement(Icon, { size: 20 })}
        </div>
        {trend && (
          <span style={{ fontSize: '0.75rem', color: trend > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
