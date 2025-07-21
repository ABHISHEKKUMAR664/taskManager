"use client";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import { TaskStatus } from "../../types";
import TaskStatusChip from "../ui/TaskStatusChip";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, status: TaskStatus) => Promise<void>;
}

export default function AddTaskDialog({ open, onClose, onAdd }: AddTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!taskTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await onAdd(taskTitle, status);
      setTaskTitle("");
      setStatus('todo');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTaskTitle("");
    setStatus('todo');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <TextField 
          label="Task Title" 
          value={taskTitle} 
          onChange={e => setTaskTitle(e.target.value)} 
          fullWidth
          margin="dense"
          autoFocus
        />
        
        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 1 }}>
            <strong>Initial Status:</strong>
          </Box>
          <TaskStatusChip
            status={status}
            editable
            onStatusChange={setStatus}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          disabled={!taskTitle.trim() || isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
