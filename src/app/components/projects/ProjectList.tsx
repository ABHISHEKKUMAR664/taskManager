"use client";
import { useState } from "react";
import { Typography, List, ListItem, ListItemButton, IconButton, Box, Fade, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Project } from "../../types";
import { useActionVisibility } from "../../hooks/useActionVisibility";

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onProjectDelete: (id: string) => void;
  onProjectEdit: (project: Project) => void;
  onAddProjectClick: () => void;
}

export default function ProjectList({ 
  projects, 
  selectedProject, 
  onProjectSelect, 
  onProjectDelete,
  onProjectEdit, 
  onAddProjectClick 
}: ProjectListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleItemHover, handleItemLeave, handleItemClick, shouldShowActions } = useActionVisibility();
  
  // Confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    onProjectSelect(project);
    if (isMobile) {
      handleItemClick(project.id);
    }
  };

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      onProjectDelete(projectToDelete.id);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="w-full md:w-1/3">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h6">Projects</Typography>
        <IconButton color="primary" onClick={onAddProjectClick}>
          <AddIcon />
        </IconButton>
      </div>
      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            onMouseEnter={() => !isMobile && handleItemHover(project.id)}
            onMouseLeave={() => !isMobile && handleItemLeave()}
            secondaryAction={
              <Fade in={shouldShowActions(project.id) || isMobile} timeout={200}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isMobile && !shouldShowActions(project.id) ? (
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(project.id);
                      }}
                      size="small"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton 
                        edge="end" 
                        color="primary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectEdit(project);
                        }}
                        sx={{ mr: 0.5 }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        color="error" 
                        onClick={(e) => handleDeleteClick(project, e)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Fade>
            }
            sx={{
              borderRadius: 1,
              mb: 0.5,
              transition: 'all 0.2s ease',
              backgroundColor: shouldShowActions(project.id) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemButton
              selected={selectedProject?.id === project.id}
              onClick={() => handleProjectClick(project)}
              sx={{
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: selectedProject?.id === project.id ? 600 : 400 }}>
                {project.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the project "{projectToDelete?.name}"? 
            This will also delete all tasks associated with this project. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
