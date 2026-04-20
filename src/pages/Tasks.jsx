import React, { useState, useCallback, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import TaskCard from '../components/TaskCard';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { addTask, updateTask, deleteTask } from '../services/taskService';
import { Plus, Search, Filter, X } from 'lucide-react';

const Tasks = () => {
  const { currentUser } = useAuth();
  const { tasks } = useAppData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const titleInputRef = useRef(null);

  // Auto-focus title input when modal opens
  useEffect(() => {
    if (showAddModal && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showAddModal]);
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    deadline: '',
    priority: 'medium',
    estimatedHours: 1
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      subject: '',
      deadline: '',
      priority: 'medium',
      estimatedHours: 1
    });
    setIsEditing(null);
    setShowAddModal(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTask(isEditing, formData);
      } else {
        await addTask(currentUser.uid, formData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  }, [isEditing, formData, currentUser, resetForm]);

  const handleEdit = useCallback((task) => {
    setFormData({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline || '',
      priority: task.priority,
      estimatedHours: task.estimatedHours
    });
    setIsEditing(task.id);
    setShowAddModal(true);
  }, []);

  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task', error);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = !searchQuery ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fade-in">
      <PageHeader 
        title="Task Planner" 
        subtitle="Organize your academic workload efficiently."
        action={
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Add Task
          </button>
        }
      />

      <div className="task-toolbar" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="task-filter-row" style={{ display: 'flex', gap: '1rem' }}>
          {['all', 'pending', 'in-progress', 'completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                background: filter === f ? 'var(--primary-glow)' : 'var(--glass)',
                color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--glass-border)'}`,
                textTransform: 'capitalize',
                transition: 'all 0.3s ease'
              }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="task-search" style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search tasks..." className="input-field" style={{ paddingLeft: '3rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="task-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <p>No tasks found for this filter.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card task-modal" style={{ width: '500px', padding: '2.5rem', position: 'relative' }}>
            <button onClick={resetForm} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Task Title</label>
                <input 
                  ref={titleInputRef}
                  type="text" 
                  className="input-field" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Subject</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Deadline</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Priority</label>
                  <select 
                    className="input-field" 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Est. Hours</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({...formData, estimatedHours: parseFloat(e.target.value)})}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                {isEditing ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
