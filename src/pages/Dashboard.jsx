import React, { useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import BurnoutCard from '../components/BurnoutCard';
import TaskCard from '../components/TaskCard';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import useBurnoutScore from '../hooks/useBurnoutScore';
import useRecommendations from '../hooks/useRecommendations';
import { updateTask } from '../services/taskService';
import { Moon, Zap, Activity, ListChecks, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, loading } = useAppData();
  const burnoutData = useBurnoutScore();
  const recommendations = useRecommendations(burnoutData);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const upcomingPriorityTasks = [...pendingTasks]
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task', error);
    }
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  }

  return (
    <div className="fade-in">
      <PageHeader 
        title={`Welcome back, ${currentUser?.displayName || 'Student'}`}
        subtitle="Here is your wellbeing and study overview."
        action={
          <Link to="/check-in" className="btn-primary">Daily Check-In</Link>
        }
      />

      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard 
          label="Pending Tasks" 
          value={pendingTasks.length} 
          unit="tasks" 
          icon={ListChecks} 
          color="var(--secondary)" 
        />
        <StatCard 
          label="Sleep Hours" 
          value={burnoutData.latestMetrics?.sleep || 0} 
          unit="hrs" 
          icon={Moon} 
          color="var(--primary)" 
        />
        <StatCard 
          label="Stress Level" 
          value={burnoutData.latestMetrics?.stress || 0} 
          unit="/ 5" 
          icon={Activity} 
          color={burnoutData.latestMetrics?.stress > 3 ? 'var(--danger)' : 'var(--warning)'} 
        />
        <StatCard 
          label="Energy Level" 
          value={burnoutData.latestMetrics?.energy || 0} 
          unit="/ 5" 
          icon={Zap} 
          color="var(--primary)" 
        />
      </div>

      <div className="responsive-grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem' }}>
        {/* Left Column - Burnout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BurnoutCard 
            score={burnoutData.score}
            level={burnoutData.level}
            message={burnoutData.message}
          />
          
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} color="var(--warning)" /> Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.map(rec => (
                <div key={rec.id} style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${rec.type === 'danger' ? 'var(--danger)' : rec.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`
                }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{rec.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>High Priority Tasks</h3>
              <Link to="/tasks" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingPriorityTasks.length > 0 ? (
                upcomingPriorityTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onEdit={() => {}} // Placeholder
                    onDelete={() => {}} // Placeholder
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <p>All caught up! No pending priority tasks.</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div className="glass-card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Completed Today</p>
                <h4 style={{ fontSize: '2rem', color: 'var(--success)' }}>{completedTasks.length}</h4>
             </div>
             <div className="glass-card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Study Time</p>
                <h4 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{burnoutData.latestMetrics?.study || 0}h</h4>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
