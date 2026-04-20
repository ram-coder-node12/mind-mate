import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { addCheckin, updateCheckin, deleteCheckin } from '../services/checkinService';
import { Calendar, Trash2, Edit3, Smile, Frown, Meh, Zap, Moon, Activity } from 'lucide-react';

const DailyCheckIn = () => {
  const { currentUser } = useAuth();
  const { checkins } = useAppData();
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 3,
    stress: 3,
    energy: 3,
    sleepHours: 7,
    studyHours: 4,
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCheckin(isEditing, formData);
        setIsEditing(null);
      } else {
        await addCheckin(currentUser.uid, formData);
      }
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        stress: 3,
        energy: 3,
        sleepHours: 7,
        studyHours: 4,
        note: ''
      });
    } catch (error) {
      console.error('Failed to save check-in', error);
    }
  };

  const handleEdit = (checkin) => {
    setFormData({
      date: checkin.date,
      mood: checkin.mood,
      stress: checkin.stress,
      energy: checkin.energy,
      sleepHours: checkin.sleepHours,
      studyHours: checkin.studyHours,
      note: checkin.note || ''
    });
    setIsEditing(checkin.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this check-in?')) {
      try {
        await deleteCheckin(id);
      } catch (error) {
        console.error('Failed to delete check-in', error);
      }
    }
  };

  const getMoodIcon = (mood) => {
    if (mood >= 4) return <Smile color="var(--success)" />;
    if (mood >= 2) return <Meh color="var(--warning)" />;
    return <Frown color="var(--danger)" />;
  };

  return (
    <div className="fade-in">
      <PageHeader 
        title="Wellbeing Check-In" 
        subtitle="Track your daily signals to prevent burnout."
      />

      <div className="checkin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column - History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Check-In History</h3>
          {checkins.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)' }}>No check-ins yet. Start tracking today!</p>
            </div>
          ) : (
            checkins.map(checkin => (
              <div key={checkin.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {new Date(checkin.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                      {new Date(checkin.date).toLocaleDateString('en-US', { day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getMoodIcon(checkin.mood)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Stress: {checkin.stress}/5</span>
                      <span style={{ color: 'var(--text-muted)' }}>Energy: {checkin.energy}/5</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Sleep: {checkin.sleepHours}h</span>
                      <span style={{ color: 'var(--text-muted)' }}>Study: {checkin.studyHours}h</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleEdit(checkin)} style={{ color: 'var(--secondary)' }}><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(checkin.id)} style={{ color: 'var(--danger)' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column - Form */}
        <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Check-In' : 'New Check-In'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required 
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem' }}>Mood</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{formData.mood}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                className="input-field" 
                value={formData.mood} 
                onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>Awful</span>
                <span>Great</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem' }}>Stress</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{formData.stress}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                className="input-field" 
                value={formData.stress} 
                onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem' }}>Energy</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{formData.energy}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                className="input-field" 
                value={formData.energy} 
                onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Sleep (Hrs)</label>
                <input 
                  type="number" className="input-field" 
                  value={formData.sleepHours} 
                  onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Study (Hrs)</label>
                <input 
                  type="number" className="input-field" 
                  value={formData.studyHours} 
                  onChange={(e) => setFormData({...formData, studyHours: parseFloat(e.target.value)})}
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Notes (Optional)</label>
              <textarea 
                className="input-field" 
                style={{ height: '100px', resize: 'none' }}
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {isEditing && (
                <button type="button" onClick={() => {
                  setIsEditing(null);
                  setFormData({
                    date: new Date().toISOString().split('T')[0],
                    mood: 3, stress: 3, energy: 3,
                    sleepHours: 7, studyHours: 4, note: ''
                  });
                }} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              )}
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                {isEditing ? 'Update Check-In' : 'Save Check-In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
