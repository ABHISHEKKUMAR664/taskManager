"use client";
import { useState } from "react";
import { Typography, List, ListItem, ListItemButton, Checkbox, IconButton, Button, Box, Fade, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Task, Project, TaskStatus } from "../../types";
import { useActionVisibility } from "../../hooks/useActionVisibility";
import TaskStatusChip from "../ui/TaskStatusChip";
import TaskStatusFilter from "../ui/TaskStatusFilter";
import { isTaskCompleted, getNextStatus } from "../../utils/taskStatus";

interface TaskListProps {
  tasks: Task[];
  selectedProject: Project | null;
  selectedTaskIds: string[];
  onTaskSelect: (taskId: string, selected: boolean) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
  onDeleteSelected: () => void;
  onAddTaskClick: () => void;
}

export default function TaskList({
  tasks,
  selectedProject,
  selectedTaskIds,
  onTaskSelect,
  onTaskDelete,
  onTaskEdit,
  onTaskStatusChange,
  onDeleteSelected,
  onAddTaskClick,
}: TaskListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { shouldShowActions, handleItemHover, handleItemLeave } = useActionVisibility();
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);

  // Confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteSelectedConfirmOpen, setDeleteSelectedConfirmOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (statusFilter.length === 0) return true;
    return statusFilter.includes(task.status);
  });

  const statusCounts = {
    todo: tasks.filter(task => task.status === 'todo').length,
    inprogress: tasks.filter(task => task.status === 'inprogress').length,
    done: tasks.filter(task => task.status === 'done').length,
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onTaskStatusChange(task.id, newStatus);
  };

  const handleQuickStatusChange = (task: Task) => {
    const nextStatus = getNextStatus(task.status);
    onTaskStatusChange(task.id, nextStatus);
  };

  const handleDeleteClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      onTaskDelete(taskToDelete.id);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteSelectedClick = () => {
    setDeleteSelectedConfirmOpen(true);
  };

  const handleDeleteSelectedConfirm = () => {
    onDeleteSelected();
    setDeleteSelectedConfirmOpen(false);
  };

  const handleDeleteSelectedCancel = () => {
    setDeleteSelectedConfirmOpen(false);
  };

  if (!selectedProject) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="400px">
        <Typography variant="h6" color="text.secondary" mb={2}>
          Select a project to view tasks
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'stretch' : 'center'} mb={2} gap={2}>
        <Typography variant="h6" component="h2">
          Tasks for {selectedProject.name}
        </Typography>
        <Box display="flex" gap={1} flexDirection={isMobile ? 'row' : 'row'} alignItems="center">
          {selectedTaskIds.length > 0 && (
            <Fade in={selectedTaskIds.length > 0}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDeleteSelectedClick}
                size={isMobile ? 'small' : 'medium'}
              >
                Delete Selected ({selectedTaskIds.length})
              </Button>
            </Fade>
          )}
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={onAddTaskClick}
            size={isMobile ? 'small' : 'medium'}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Status Filter */}
      <Box mb={3}>
        <TaskStatusFilter
          selectedStatuses={statusFilter}
          onStatusChange={setStatusFilter}
          taskCounts={statusCounts}
        />
      </Box>

      {filteredTasks.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="200px">
          <Typography variant="body1" color="text.secondary">
            {statusFilter.length === 0 
              ? "No tasks yet. Create your first task!"
              : `No tasks found for selected statuses.`
            }
          </Typography>
        </Box>
      ) : (
        <List>
          {filteredTasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);
            const showActions = shouldShowActions(task.id) || isMobile;
            const isCompleted = isTaskCompleted(task.status);
            
            return (
              <ListItem
                key={task.id}
                disablePadding
                onMouseEnter={() => handleItemHover(task.id)}
                onMouseLeave={handleItemLeave}
                sx={{
                  mb: 1,
                  border: '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  bgcolor: isSelected ? 'action.selected' : 'background.paper',
                  opacity: isCompleted ? 0.7 : 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: isSelected ? 'action.selected' : 'action.hover',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ListItemButton
                  role={undefined}
                  onClick={() => onTaskSelect(task.id, !isSelected)}
                  dense
                  sx={{ 
                    p: isMobile ? 1 : 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    size={isMobile ? 'small' : 'medium'}
                    sx={{ p: 0, mr: 1 }}
                  />
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} gap={1} mb={0.5}>
                      <Typography 
                        variant="body1" 
                        component="span"
                        sx={{ 
                          fontWeight: 500,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          wordBreak: 'break-word',
                          flex: isMobile ? 'none' : 1,
                        }}
                      >
                        {task.title}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <TaskStatusChip
                          status={task.status}
                          editable={true}
                          onStatusChange={(newStatus) => handleStatusChange(task, newStatus)}
                          size="small"
                        />
                        
                        {!isCompleted && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(task);
                            }}
                            sx={{ 
                              minWidth: 'auto',
                              p: 0.5,
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                              },
                            }}
                            title={`Move to ${getNextStatus(task.status)}`}
                          >
                            {getNextStatus(task.status) === 'done' ? '✓' : '→'}
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Fade in={showActions}>
                    <Box 
                      display="flex" 
                      gap={0.5}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isMobile ? (
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // You can implement a menu here for mobile
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskEdit(task);
                            }}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleDeleteClick(task, e)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Fade>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="task-delete-dialog-title"
        aria-describedby="task-delete-dialog-description"
      >
        <DialogTitle id="task-delete-dialog-title">
          Delete Task
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="task-delete-dialog-description">
            Are you sure you want to delete the task "{taskToDelete?.title}"? 
            This action cannot be undone.
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

      {/* Delete Selected Confirmation Dialog */}
      <Dialog
        open={deleteSelectedConfirmOpen}
        onClose={handleDeleteSelectedCancel}
        aria-labelledby="delete-selected-dialog-title"
        aria-describedby="delete-selected-dialog-description"
      >
        <DialogTitle id="delete-selected-dialog-title">
          Delete Selected Tasks
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-selected-dialog-description">
            Are you sure you want to delete {selectedTaskIds.length} selected task{selectedTaskIds.length > 1 ? 's' : ''}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSelectedCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSelectedConfirm} color="error" variant="contained" autoFocus>
            Delete {selectedTaskIds.length} Task{selectedTaskIds.length > 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
