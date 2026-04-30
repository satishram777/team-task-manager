import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || '/api'}/auth/signup`, formData);
      // Login automatically after signup
      const loginRes = await axios.post(`${import.meta.env.VITE_API_BASE || '/api'}/auth/login`, { email: formData.email, password: formData.password });
      login(loginRes.data.token, loginRes.data.user || { id: res.data._id });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;

