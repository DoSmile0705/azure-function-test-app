import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };
    
    fetchTasks();
  }, [role]);

  return (
    <div className="p-6 w-full bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
      <h2 className="text-xl mb-6 text-center">Role: {role}</h2>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task.id} className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;