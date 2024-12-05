import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/login`, { username, password });

      // Add console.log to debug the response
      console.log('Login response:', response.data);

      if (response.data && response.data.token && response.data.role) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        // Verify items were set correctly
        console.log('Stored token:', localStorage.getItem('token'));
        console.log('Stored role:', localStorage.getItem('role'));

        navigate('/dashboard');
      } else {
        console.error('Missing token or role in response:', response.data);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  useEffect(() => {

  }, [username])

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Login
        </button>
      </form>
    </div>

  );
}

export default Login;