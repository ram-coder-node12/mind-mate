import React, { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CalendarCheck, 
  BarChart3, 
  User, 
  LogOut,
  BrainCircuit,
  Menu,
  X
} from 'lucide-react';

const AppShell = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }, [logout, navigate]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
    { name: 'Check-In', path: '/check-in', icon: CalendarCheck },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const sidebarContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={32} color="var(--primary)" />
          <h1 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>MindMate</h1>
        </div>
        {/* Close button visible only on mobile */}
        <button
          onClick={closeSidebar}
          className="sidebar-close-btn"
          aria-label="Close menu"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={22} />
        </button>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item.name} style={{ marginBottom: '8px' }}>
              <NavLink 
                to={item.path}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.3s ease'
                })}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', padding: '0 8px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            color: '#000',
            flexShrink: 0
          }}>
            {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.displayName || 'Student'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.email}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--danger)',
            transition: 'all 0.3s ease'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Mobile top bar */}
        <header className="mobile-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{ color: 'var(--text-main)', padding: '4px' }}
          >
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={22} color="var(--primary)" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '600', fontSize: '1.1rem' }}>MindMate</span>
          </div>
          <div style={{ width: 32 }} /> {/* spacer for centering */}
        </header>

        <main className="main-content">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
