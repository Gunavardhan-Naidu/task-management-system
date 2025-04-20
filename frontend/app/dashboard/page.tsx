"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "@/app/utils/axios";
import { useAuth } from "@/app/providers/Sessionprovider";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <DashboardStyled>
        <div className="loading">Loading...</div>
      </DashboardStyled>
    );
  }

  return (
    <DashboardStyled>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Task Management Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {error && <div className="error-message">{error}</div>}
          
          <div className="tasks-section">
            <h2>Your Tasks</h2>
            {tasks.length === 0 ? (
              <p>No tasks found. Create your first task!</p>
            ) : (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <span className={`status ${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;

    h1 {
      font-size: 2rem;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .logout-btn {
        padding: 0.5rem 1rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #c82333;
        }
      }
    }
  }

  .dashboard-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tasks-section {
    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .tasks-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .task-card {
      background-color: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #ddd;

      h3 {
        margin-bottom: 0.5rem;
        color: #333;
      }

      p {
        color: #666;
        margin-bottom: 1rem;
      }

      .status {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;

        &.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        &.in-progress {
          background-color: #cce5ff;
          color: #004085;
        }

        &.completed {
          background-color: #d4edda;
          color: #155724;
        }
      }
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 1.5rem;
    color: #666;
  }

  .error-message {
    padding: 1rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
`;

export default DashboardPage; 