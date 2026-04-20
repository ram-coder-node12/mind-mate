import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, Cell
} from 'recharts';

const Analytics = () => {
  const { checkins, tasks } = useAppData();

  const chartData = useMemo(() => {
    return [...checkins].reverse().map(c => ({
      date: new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: c.mood,
      stress: c.stress,
      energy: c.energy,
      sleep: c.sleepHours,
      study: c.studyHours
    }));
  }, [checkins]);

  const taskStats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;

    return [
      { name: 'Pending', value: pending, fill: 'var(--text-muted)' },
      { name: 'In Progress', value: inProgress, fill: 'var(--secondary)' },
      { name: 'Completed', value: completed, fill: 'var(--success)' },
    ];
  }, [tasks]);

  if (checkins.length === 0) {
    return (
      <div className="fade-in">
        <PageHeader title="Analytics" subtitle="Insights into your wellbeing and productivity." />
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem' }}>
          <h3>Not enough data</h3>
          <p style={{ color: 'var(--text-muted)' }}>Complete a few daily check-ins to see your trends visualized here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader title="Analytics" subtitle="Insights into your wellbeing and productivity." />

      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Wellbeing Trends */}
        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Wellbeing Trends</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 5]} />
              <Tooltip 
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '0.8rem' }}
              />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)' }} />
              <Line type="monotone" dataKey="stress" stroke="var(--danger)" strokeWidth={2} dot={{ fill: 'var(--danger)' }} />
              <Line type="monotone" dataKey="energy" stroke="var(--secondary)" strokeWidth={2} dot={{ fill: 'var(--secondary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Balance: Sleep vs Study */}
        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Sleep vs. Study Balance</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="sleep" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Sleep (Hrs)" />
              <Bar dataKey="study" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Study (Hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         <div className="glass-card" style={{ height: '350px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Stress Intensity (Area)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="stress" stroke="var(--danger)" fillOpacity={1} fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>

         <div className="glass-card" style={{ height: '350px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Task Distribution</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={taskStats} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} width={80} />
                    <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {taskStats.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
