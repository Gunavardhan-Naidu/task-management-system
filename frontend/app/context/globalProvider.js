"use client";
import React, { createContext, useState, useContext } from "react";
import themes from "./themes";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/providers/Sessionprovider";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { token, user } = useAuth(); // Get user from session

  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);

  const theme = themes[selectedTheme];

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const collapseMenu = () => {
    setCollapsed(!collapsed);
  };

  const allTasks = async () => {
    if (!token) {
      console.log("No token available");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sorted = res.data.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setTasks(sorted);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        console.log("Authentication failed. Please login again.");
        // You might want to redirect to login here
      }
      setTasks([]); // Clear tasks on error
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task deleted");
      allTasks();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateTask = async (task) => {
    try {
      await axios.put(`/api/tasks/${task.id}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task updated");
      allTasks();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const completedTasks = tasks.filter((task) => task.is_completed === true);
  const importantTasks = tasks.filter((task) => task.is_important === true);
  const incompleteTasks = tasks.filter((task) => task.is_completed === false);

  React.useEffect(() => {
    if (user && token) {
      allTasks();
    } else {
      setTasks([]); // Clear tasks when not authenticated
    }
  }, [user, token]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        tasks,
        deleteTask,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
        updateTask,
        modal,
        openModal,
        closeModal,
        allTasks,
        collapsed,
        collapseMenu,
      }}
    >
      <GlobalUpdateContext.Provider value={{}}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);