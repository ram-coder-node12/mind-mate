import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end',
      marginBottom: '2.5rem',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default PageHeader;
