import { useState, useEffect } from 'react';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', overdue: false });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.overdue) params.append('overdue', 'true');
      const res = await axios.get(`/api/tasks?${params}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-wrap gap-4">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.overdue}
              onChange={(e) => setFilters({...filters, overdue: e.target.checked})}
            />
            Show Overdue
          </label>
          <button onClick={fetchTasks} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-lg group hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{task.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-500">
              <div>Project: {task.project?.name}</div>
              <div>Assignee: {task.assignee?.name || 'Unassigned'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;

