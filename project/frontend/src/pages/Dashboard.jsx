import { useEffect, useMemo, useState } from 'react'; 
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';

function priorityLabel(priority) {
  if (!priority) return 'No set';
  if (priority === 1) return 'Low';
  if (priority === 2) return 'Medium';
  if (priority === 3) return 'High';
  return 'Very High';
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString();
}

export default function Dashboard() {
  // RECIBIMOS EL sortBy DEL LAYOUT
  const context = useOutletContext();
  const sortBy = context ? context.sortBy : 'type'; 

  const [tasks, setTasks] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ESTADO DE FILTRO 
  const [statusFilter, setStatusFilter] = useState('all'); 

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 1, task_type_id: 1, finished_at: '',   new_type_name: ''
  });

  // ESTADOS DE EDICIÓN
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editFinishedAt, setEditFinishedAt] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [tasksRes, typesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/task-types'),
      ]);
      setTasks(tasksRes.data || []);
      setTypes(typesRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'priority' || name === 'task_type_id') ? Number(value) : value
    });
  };

  const handleAddTask = async (e) => {
  e.preventDefault();
  if (!formData.title.trim()) {
    alert("Título obligatorio");
    return;
  }

  try {
    let taskTypeId = formData.task_type_id;
    if (formData.new_type_name && formData.new_type_name.trim() !== '') {
      const res = await api.post('/task-types', {
        name: formData.new_type_name.trim()
      });
      taskTypeId = res.data.id;
    }

    await api.post('/tasks', {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      finished_at: formData.finished_at,
      task_type_id: taskTypeId
    });

    await fetchTasks();
    setFormData({
      title: '',
      description: '',
      priority: 1,
      task_type_id: taskTypeId || 1,
      finished_at: '',
      new_type_name: ''
    });
  } catch (err) {
    alert("Error: " + (err.response?.data?.error || err.message));
  }
};


  const handleDelete = async (id) => {
    if (!confirm('¿Borrar tarea?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleToggleCompleted = async (task) => {
    await api.put(`/tasks/${task.id}`, { completed: !task.completed });
    fetchTasks();
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || '');
    setEditFinishedAt(task.finished_at ? task.finished_at.slice(0, 10) : '');
  };

  const handleSaveEdit = async (task) => {
    try {
        await api.put(`/tasks/${task.id}`, {
            title: editTitle, description: editDescription,
            priority: Number(editPriority), finished_at: editFinishedAt || null,
            completed: task.completed, task_type_id: task.task_type_id
        });
        setEditingTaskId(null);
        fetchTasks();
    } catch(err) { console.error(err); }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null); setEditTitle(''); setEditDescription(''); setEditPriority(''); setEditFinishedAt('');
  };

  // LÓGICA DE VISTA 
  const processedData = useMemo(() => {
    let filtered = tasks.filter(t => {
        if (statusFilter === 'completed') return t.completed;
        if (statusFilter === 'pending') return !t.completed;
        return true;
    });

    if (sortBy === 'type') {
      const map = new Map();
      filtered.forEach((task) => {
        const typeName = task.type_name || types.find(t => t.id === task.task_type_id)?.name || 'Otros';
        if (!map.has(typeName)) map.set(typeName, []);
        map.get(typeName).push(task);
      });
      return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    } else if (sortBy === 'priority_desc') {
      const map = new Map();
      filtered.forEach((task) => {
        const plabel = priorityLabel(task.priority);
        if (!map.has(plabel)) map.set(plabel, []);
        map.get(plabel).push(task);
      });
      const order = ['Very High', 'High', 'Medium', 'Low', 'No set'];
      return Array.from(map.entries()).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    } else {
      let sorted = [...filtered];
      if (sortBy === 'alpha_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
      if (sortBy === 'date_prox') {
        sorted.sort((a, b) => {
            if (!a.finished_at) return 1;
            if (!b.finished_at) return -1;
            return new Date(a.finished_at) - new Date(b.finished_at);
        });
      }
      return [['All Tasks', sorted]];
    }
  }, [tasks, statusFilter, sortBy, types]);

  const getStatusBtnStyle = (status) => ({
    ...chipStyle,
    backgroundColor: statusFilter === status ? '#0099ff' : 'white',
    color: statusFilter === status ? 'white' : '#666',
    borderColor: statusFilter === status ? '#0099ff' : '#ddd'
  });

  return (
    <div style={dashboardContainerStyle}>
      
      {/* HEADER */}
      <div style={headerContainerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Tasks</h1>          
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666', alignSelf: 'center', marginRight: '5px' }}>Status:</span>
            <button onClick={() => setStatusFilter('all')} style={getStatusBtnStyle('all')}>All</button>
            <button onClick={() => setStatusFilter('pending')} style={getStatusBtnStyle('pending')}>Pending</button>
            <button onClick={() => setStatusFilter('completed')} style={getStatusBtnStyle('completed')}>Completed</button>
        </div>
      </div>


      {/* FORMULARIO */}
      <section style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1f2937' }}>Add new task</h3>
        {error && <div style={{color:'red', marginBottom:'10px'}}>{error}</div>}
        
        <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '15px' }}>
            <div style={{ gridColumn: '1 / 2' }}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} name="title" value={formData.title} onChange={handleChange} placeholder="Task title..." />
            </div>
            <div>
                <label style={labelStyle}>Task type</label>
                <select style={inputStyle} name="task_type_id" value={formData.task_type_id} onChange={handleChange} >
                {types.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
                  ))}
                </select>

  <small style={{ fontSize: '11px', color: '#6b7280' }}>
    Or write a new type:
  </small>
  <input
    style={{ ...inputStyle, marginTop: '4px' }}
    type="text"
    name="new_type_name"
    value={formData.new_type_name || ''}
    onChange={handleChange}
    placeholder="New task type..."
  />
            </div>
            <div>
                <label style={labelStyle}>Priority</label>
                <select style={inputStyle} name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="1">Low</option><option value="2">Medium</option><option value="3">High</option><option value="5">Critical</option>
                </select>
            </div>
            <div>
                <label style={labelStyle}>End date</label>
                <input style={inputStyle} type="date" name="finished_at" value={formData.finished_at} onChange={handleChange} />
            </div>
            <div style={{ gridColumn: '1 / 4' }}>
                <label style={labelStyle}>Description</label>
                <input style={inputStyle} name="description" value={formData.description} onChange={handleChange} placeholder="Description..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button type="submit" style={primaryBtnStyle}>+ Add</button>
            </div>
        </form>
      </section>

      {/* RENDERIZADO */}
      <section style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {loading && <p>Cargando tareas...</p>}
        {!loading && processedData.length === 0 && <p style={{color:'#666', width:'100%', textAlign:'center'}}>No hay tareas.</p>}

        {!loading && processedData.map(([groupName, groupTasks]) => (
            <div key={groupName} style={{ 
                flex: (sortBy === 'type' || sortBy === 'priority_desc') ? '1 1 300px' : '1 1 100%', 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                padding: '15px' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #f3f4f6' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#111' }}>{groupName}</h3>
                    <span style={{ marginLeft: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {groupTasks.length} items
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {groupTasks.map(task => (
                        <TaskRow 
                            key={task.id} 
                            task={task} 
                            isEditing={editingTaskId === task.id}
                            editState={{editTitle, setEditTitle, editDescription, setEditDescription, editPriority, setEditPriority, editFinishedAt, setEditFinishedAt}}
                            actions={{handleStartEdit, handleSaveEdit, handleCancelEdit, handleDelete, handleToggleCompleted}}
                        />
                    ))}
                </div>
            </div>
        ))}
      </section>
    </div>
  );
}

// COMPONENTE TaskRow
function TaskRow({ task, isEditing, editState, actions }) {
    if (isEditing) {
        return (
            <div style={taskCardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input style={inputStyle} value={editState.editTitle} onChange={e => editState.setEditTitle(e.target.value)} />
                    <input style={inputStyle} value={editState.editDescription} onChange={e => editState.setEditDescription(e.target.value)} />
                    <div style={{display:'flex', gap:'5px'}}>
                        <input type="date" style={inputStyle} value={editState.editFinishedAt} onChange={e => editState.setEditFinishedAt(e.target.value)} />
                        <select style={inputStyle} value={editState.editPriority} onChange={e => editState.setEditPriority(e.target.value)}>
                            <option value="1">Low</option><option value="2">Medium</option><option value="3">High</option><option value="4">Very High</option>
                        </select>
                    </div>
                    <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                        <button onClick={() => actions.handleSaveEdit(task)} style={{...primaryBtnStyle, padding:'5px 10px', fontSize:'12px'}}>Save</button>
                        <button onClick={actions.handleCancelEdit} style={{...secondaryBtnStyle, padding:'5px 10px', fontSize:'12px'}}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={taskCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>{task.title}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ backgroundColor: getPriorityColor(task.priority), padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>
                        {priorityLabel(task.priority)}
                    </span>
                    <span style={{ backgroundColor: task.completed ? '#dcfce7' : '#fef9c3', color: task.completed ? '#166534' : '#854d0e', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        {task.completed ? 'Done' : 'Pending'}
                    </span>
                </div>
            </div>
            {task.description && <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0' }}>{task.description}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                <span>{formatDate(task.finished_at)}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => actions.handleStartEdit(task)} style={iconBtnStyle}>✏️</button>
                    <button onClick={() => actions.handleToggleCompleted(task)} style={iconBtnStyle}>✅</button>
                    <button onClick={() => actions.handleDelete(task.id)} style={{...iconBtnStyle, color:'red'}}>✕</button>
                </div>
            </div>
        </div>
    )
}

//ESTILOS
const dashboardContainerStyle = { padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif' };
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const chipStyle = { border: '1px solid #e5e7eb', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const taskCardStyle = { border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', backgroundColor: '#fff', transition: 'transform 0.1s', ':hover': { transform: 'translateY(-2px)' } };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const primaryBtnStyle = { backgroundColor: '#0099ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' };
const secondaryBtnStyle = { backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px', opacity: 0.7 };
function getPriorityColor(p) { if(p >= 4) return '#ef4444'; if(p === 3) return '#f59e0b'; if(p === 2) return '#3b82f6'; return '#10b981'; }
