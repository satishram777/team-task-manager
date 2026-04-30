import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';

const API_BASE = '/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = newToken;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">TaskManager</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link to="/projects" className="text-gray-700 hover:text-blue-600">Projects</Link>
                <Link to="/tasks" className="text-gray-700 hover:text-blue-600">Tasks</Link>
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Login</Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Signup</Link>
              </div>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<div className="text-center py-20"><h1 className="text-4xl font-bold">Welcome to TaskManager</h1><p>Team Task & Project Management</p></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

