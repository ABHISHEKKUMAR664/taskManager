"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, List, ListItem, ListItemButton, Checkbox, IconButton } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DashboardPage() {
  const { token, username, signOut } = useAuthStore();
  const { projects, setProjects, addProject, removeProject } = useProjectStore();
  const { tasks, setTasks, addTask, updateTask, removeTask } = useTaskStore();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  
  useEffect(() => {
    if (!token) return;
    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, [token, setProjects]);

  // Fetch tasks when project selected
  useEffect(() => {
    if (!token || !selectedProject) return;
    fetch(`/api/tasks?projectId=${selectedProject.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []));
    
    setSelectedTaskIds([]);
  }, [token, selectedProject, setTasks]);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newProjectName }),
    });
    const data = await res.json();
    if (res.ok) {
      addProject(data.project);
      setNewProjectName("");
      setProjectDialogOpen(false);
      toast.success("Project added!");
    } else {
      toast.error(data.error || "Error adding project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      removeProject(id);
      setSelectedProject(null);
      toast.success("Project deleted!");
    } else {
      toast.error("Error deleting project");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId: selectedProject.id, title: newTaskTitle }),
    });
    const data = await res.json();
    if (res.ok) {
      addTask(data.task);
      setNewTaskTitle("");
      setTaskDialogOpen(false);
      toast.success("Task added!");
    } else {
      toast.error(data.error || "Error adding task");
    }
  };


  const handleDeleteTask = async (id: string) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      removeTask(id);
      toast.success("Task deleted!");
    } else {
      toast.error("Error deleting task");
    }
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
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Welcome, {username}</Typography>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={signOut}>
          Sign Out
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Projects List */}
        <div className="w-full md:w-1/3">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="h6">Projects</Typography>
            <IconButton color="primary" onClick={() => setProjectDialogOpen(true)}><AddIcon /></IconButton>
          </div>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDeleteProject(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={selectedProject?.id === project.id}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
        {/* Tasks List */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="h6">Tasks {selectedProject && `for ${selectedProject.name}`}</Typography>
            {selectedProject && (
              <IconButton color="primary" onClick={() => setTaskDialogOpen(true)}><AddIcon /></IconButton>
            )}
          </div>
          {/* Show Delete Selected button if any tasks are selected */}
          {selectedTaskIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              className="mb-2"
              onClick={async () => {
                for (const id of selectedTaskIds) {
                  await fetch("/api/tasks", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ id }),
                  });
                  removeTask(id);
                }
                setSelectedTaskIds([]);
                toast.error("Selected tasks deleted!");
              }}
            >
              Delete Selected ({selectedTaskIds.length})
            </Button>
          )}
          <List>
            {tasks
              .filter((task) => selectedProject && task.projectId === selectedProject.id)
              .map((task) => (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton>
                    <Checkbox
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={e => {
                        setSelectedTaskIds(prev =>
                          e.target.checked
                            ? [...prev, task.id]
                            : prev.filter(id => id !== task.id)
                        );
                      }}
                    />
                    <span>{task.title}</span>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </div>
      </div>
      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProject} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField label="Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
