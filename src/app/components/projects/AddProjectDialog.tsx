"use client";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string) => Promise<void>;
}

export default function AddProjectDialog({ open, onClose, onAdd }: AddProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!projectName.trim()) return;
    
    setIsLoading(true);
    try {
      await onAdd(projectName);
      setProjectName("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProjectName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <TextField 
          label="Project Name" 
          value={projectName} 
          onChange={e => setProjectName(e.target.value)} 
          fullWidth
          margin="dense"
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          disabled={!projectName.trim() || isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
