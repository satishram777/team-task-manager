import { useState, useEffect } from 'react';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', newProject);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Create Project
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Owner: {project.owner?.name}</span>
              {project.members?.length > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {project.members.length} members
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;

