"use client";
import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControlLabel, Checkbox, Box } from "@mui/material";
import { Task, TaskStatus } from "../../types";
import TaskStatusChip from "../ui/TaskStatusChip";
import { isTaskCompleted } from "../../utils/taskStatus";

interface EditTaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (id: string, title: string, completed: boolean, status: TaskStatus) => Promise<void>;
}

export default function EditTaskDialog({ open, task, onClose, onEdit }: EditTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setCompleted(task.completed);
      setStatus(task.status || 'todo'); // Default to 'todo' for backward compatibility
    }
  }, [task]);

  // Sync completed state with status
  useEffect(() => {
    setCompleted(isTaskCompleted(status));
  }, [status]);

  const handleEdit = async () => {
    if (!taskTitle.trim() || !task) return;
    
    setIsLoading(true);
    try {
      await onEdit(task.id, taskTitle, isTaskCompleted(status), status);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTaskTitle("");
    setCompleted(false);
    setStatus('todo');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField 
          label="Task Title" 
          value={taskTitle} 
          onChange={e => setTaskTitle(e.target.value)} 
          fullWidth
          margin="dense"
          autoFocus
        />
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <strong>Status:</strong>
          </Box>
          <TaskStatusChip
            status={status}
            editable
            onStatusChange={setStatus}
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              disabled // Controlled by status
            />
          }
          label="Completed (automatically set when status is 'Done')"
          sx={{ mt: 1, opacity: 0.7 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleEdit} 
          variant="contained" 
          disabled={!taskTitle.trim() || isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
