"use client";
import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Project } from "../../types";

interface EditProjectDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onEdit: (id: string, name: string) => Promise<void>;
}

export default function EditProjectDialog({ open, project, onClose, onEdit }: EditProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
    }
  }, [project]);

  const handleEdit = async () => {
    if (!projectName.trim() || !project) return;
    
    setIsLoading(true);
    try {
      await onEdit(project.id, projectName);
      handleClose();
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
      <DialogTitle>Edit Project</DialogTitle>
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
          onClick={handleEdit} 
          variant="contained" 
          disabled={!projectName.trim() || isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
