import React from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { User, Mail, Calendar, ClipboardList, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { tasks, checkins } = useAppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="fade-in">
      <PageHeader title="My Profile" subtitle="Manage your account and view summary stats." />

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        {/* Left - Profile Card */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '800',
            color: '#000',
            boxShadow: '0 0 30px var(--primary-glow)'
          }}>
            {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase()}
          </div>
          
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{currentUser?.displayName || 'Student'}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{currentUser?.email}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <Mail size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem' }}>{currentUser?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <User size={18} color="var(--secondary)" />
              <span style={{ fontSize: '0.9rem' }}>Student Account</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '3rem', color: 'var(--danger)', borderColor: 'rgba(255,59,59,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Right - Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Account Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center' }}>
                <Calendar size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Check-Ins</p>
                <h4 style={{ fontSize: '2rem' }}>{checkins.length}</h4>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center' }}>
                <ClipboardList size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tasks Managed</p>
                <h4 style={{ fontSize: '2rem' }}>{tasks.length}</h4>
              </div>
            </div>
          </div>

          <div className="glass-card">
             <h3 style={{ marginBottom: '1.5rem' }}>About MindMate</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
               MindMate was built to empower students by highlighting the critical link between wellbeing and academic performance. 
               By tracking your sleep, stress, and mood alongside your assignments, you gain the perspective needed to maintain a high-performance lifestyle without sacrificing your mental health.
             </p>
             <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>Version 1.0.0 (Production)</span>
                <span>Created with ❤️ for Students</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
