"use client";
import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { useDashboard } from "../hooks/useDashboard";
import { Project, Task } from "../types";

// Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectList from "../components/projects/ProjectList";
import AddProjectDialog from "../components/projects/AddProjectDialog";
import EditProjectDialog from "../components/projects/EditProjectDialog";
import TaskList from "../components/tasks/TaskList";
import AddTaskDialog from "../components/tasks/AddTaskDialog";
import EditTaskDialog from "../components/tasks/EditTaskDialog";

export default function DashboardPage() {
  const { token, username, signOut } = useAuthStore();
  const {
    projects,
    tasks,
    selectedProject,
    selectedTaskIds,
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
  } = useDashboard(token);

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  
  // Edit states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setEditProjectDialogOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setEditTaskDialogOpen(true);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Typography variant="h5">Please login to access the dashboard.</Typography>
        <Button
          variant="contained"
          color="primary"
          className="mt-4"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <DashboardHeader username={username} onSignOut={signOut} />
      
      <div className="flex flex-col md:flex-row gap-8">
        <ProjectList
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={setSelectedProject}
          onProjectDelete={handleDeleteProject}
          onProjectEdit={handleProjectEdit}
          onAddProjectClick={() => setProjectDialogOpen(true)}
        />
        
        <TaskList
          tasks={tasks}
          selectedProject={selectedProject}
          selectedTaskIds={selectedTaskIds}
          onTaskSelect={handleTaskSelect}
          onTaskDelete={handleDeleteTask}
          onTaskEdit={handleTaskEdit}
          onTaskStatusChange={handleTaskStatusChange}
          onDeleteSelected={handleDeleteSelectedTasks}
          onAddTaskClick={() => setTaskDialogOpen(true)}
        />
      </div>

      {/* Dialogs */}
      <AddProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onAdd={handleAddProject}
      />
      
      <EditProjectDialog
        open={editProjectDialogOpen}
        project={editingProject}
        onClose={() => {
          setEditProjectDialogOpen(false);
          setEditingProject(null);
        }}
        onEdit={handleEditProject}
      />
      
      <AddTaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onAdd={handleAddTask}
      />
      
      <EditTaskDialog
        open={editTaskDialogOpen}
        task={editingTask}
        onClose={() => {
          setEditTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onEdit={handleEditTask}
      />

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
