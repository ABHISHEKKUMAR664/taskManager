"use client";
import { useEffect, useState } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";
import { toast } from "react-toastify";
import { Project, Task, TaskStatus } from "../types";

export function useDashboard(token: string | null) {
  const { projects, setProjects, addProject, updateProject, removeProject } = useProjectStore();
  const { tasks, setTasks, addTask, updateTask, removeTask } = useTaskStore();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Fetch projects on mount
  useEffect(() => {
    if (!token) return;
    
    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => toast.error("Failed to load projects"));
  }, [token, setProjects]);

  // Fetch tasks when project selected
  useEffect(() => {
    if (!token || !selectedProject) {
      setTasks([]); // Clear tasks when no project is selected
      setSelectedTaskIds([]);
      return;
    }
    
    // Clear tasks immediately when switching projects
    setTasks([]);
    setSelectedTaskIds([]);
    
    fetch(`/api/tasks?projectId=${selectedProject.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const projectTasks = data.tasks || [];
        // Double-check filtering on frontend as well
        const filteredTasks = projectTasks.filter((task: Task) => task.projectId === selectedProject.id);
        setTasks(filteredTasks);
      })
      .catch(() => toast.error("Failed to load tasks"));
  }, [token, selectedProject, setTasks]);

  const handleAddProject = async (name: string) => {
    if (!token) return;
    
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await res.json();
    if (res.ok) {
      addProject(data.project);
      toast.success("Project added!");
    } else {
      toast.error(data.error || "Error adding project");
      throw new Error(data.error || "Error adding project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!token) return;
    
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ id }),
    });
    
    if (res.ok) {
      removeProject(id);
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
      toast.error("Project deleted!");
    } else {
      toast.error("Error deleting project");
    }
  };

  const handleEditProject = async (id: string, name: string) => {
    if (!token) return;
    
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ id, name }),
    });
    
    if (res.ok) {
      // Update project in store using the store's update method
      updateProject({ id, name });
      
      // Update selected project if it's the one being edited
      if (selectedProject?.id === id) {
        setSelectedProject({ ...selectedProject, name });
      }
      
      toast.success("Project updated!");
    } else {
      toast.error("Error updating project");
      throw new Error("Error updating project");
    }
  };

  const handleAddTask = async (title: string, status: TaskStatus = 'todo') => {
    if (!token || !selectedProject) return;
    
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ projectId: selectedProject.id, title, status }),
    });
    
    const data = await res.json();
    if (res.ok) {
      addTask(data.task);
      toast.success("Task added!");
    } else {
      toast.error(data.error || "Error adding task");
      throw new Error(data.error || "Error adding task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ id }),
    });
    
    if (res.ok) {
      removeTask(id);
      toast.success("Task deleted!");
    } else {
      toast.error("Error deleting task");
    }
  };

  const handleEditTask = async (id: string, title: string, completed: boolean, status?: TaskStatus) => {
    if (!token) return;
    
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ id, title, completed, status }),
    });
    
    if (res.ok) {
      // Update task in store using the store's update method
      updateTask({ 
        ...tasks.find(t => t.id === id)!, 
        title, 
        completed, 
        ...(status !== undefined ? { status } : {})
      });
      
      toast.success("Task updated!");
    } else {
      toast.error("Error updating task");
      throw new Error("Error updating task");
    }
  };

  const handleTaskStatusChange = async (id: string, status: TaskStatus) => {
    if (!token) return;
    
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ id, status }),
    });
    
    if (res.ok) {
      // Update task status in store using the store's update method
      const task = tasks.find(t => t.id === id);
      if (task) {
        updateTask({ ...task, status });
      }
      
      toast.success("Task status updated!");
    } else {
      toast.error("Error updating task status");
    }
  };

  const handleDeleteSelectedTasks = async () => {
    if (!token) return;
    
    for (const id of selectedTaskIds) {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id }),
      });
      removeTask(id);
    }
    setSelectedTaskIds([]);
    toast.error("Selected tasks deleted!");
  };

  const handleTaskSelect = (taskId: string, selected: boolean) => {
    setSelectedTaskIds(prev =>
      selected
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  return {
    // State
    projects,
    tasks,
    selectedProject,
    selectedTaskIds,
    
    // Actions
    setSelectedProject,
    handleAddProject,
    handleDeleteProject,
    handleEditProject,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleTaskStatusChange,
    handleDeleteSelectedTasks,
    handleTaskSelect,
  };
}
