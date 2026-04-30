import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.projects || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalTasks || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">{stats.overdueTasks || 0}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Tasks by Status</h2>
        <div className="grid grid-cols-3 gap-4">
          {['todo', 'in-progress', 'done'].map(status => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className={`text-2xl font-bold ${
                status === 'done' ? 'text-green-600' :
                status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {stats.tasksByStatus?.[status] || 0}
              </p>
              <p className="capitalize text-sm text-gray-500">{status.replace('-', ' ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <Link to="/projects" className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium">
          Manage Projects
        </Link>
        <Link to="/tasks" className="bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 font-medium">
          View All Tasks
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

