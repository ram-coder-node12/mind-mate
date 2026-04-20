import React from 'react';
import { Clock, Tag, MoreVertical, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={20} color="var(--success)" />;
      case 'in-progress': return <PlayCircle size={20} color="var(--secondary)" />;
      default: return <Circle size={20} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="glass-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      opacity: task.status === 'completed' ? 0.7 : 1,
      background: task.status === 'completed' ? 'rgba(255,255,255,0.02)' : 'var(--card-bg)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => {
            const nextStatus = task.status === 'pending' ? 'in-progress' : 
                               task.status === 'in-progress' ? 'completed' : 'pending';
            onStatusChange(task.id, nextStatus);
          }}>
            {getStatusIcon(task.status)}
          </button>
          <div>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '4px',
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)'
            }}>
              {task.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={12} /> {task.subject}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {task.estimatedHours}h
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            fontWeight: '700',
            color: getPriorityColor(task.priority),
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${getPriorityColor(task.priority)}15`
          }}>
            {task.priority}
          </span>
        </div>
      </div>

      {task.deadline && (
        <div style={{ 
          fontSize: '0.85rem', 
          color: new Date(task.deadline) < new Date() && task.status !== 'completed' ? 'var(--danger)' : 'var(--text-muted)',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onEdit(task)} style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Edit</button>
            <button onClick={() => onDelete(task.id)} style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
