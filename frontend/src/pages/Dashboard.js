import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks when the component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasks();
                setTasks(tasks);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Handle task creation
    const handleCreateTask = async (task) => {
        try {
            const newTask = await createTask(task);
            setTasks([...tasks, newTask]);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    // Handle task update
    const handleUpdateTask = async (taskId, updatedTask) => {
        try {
            const updated = await updateTask(taskId, updatedTask);
            setTasks(tasks.map((task) => (task.id === taskId ? updated : task)));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {user?.username}!</h1>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            <h2>Create a New Task</h2>
            <TaskForm onSubmit={handleCreateTask} />

            <h2>Your Tasks</h2>
            <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
};

export default Dashboard;