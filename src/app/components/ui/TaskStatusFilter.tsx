"use client";
import { Box, ToggleButton, ToggleButtonGroup, Typography, Badge } from "@mui/material";
import { TaskStatus } from "../../types";
import { getStatusConfig, getStatusOptions } from "../../utils/taskStatus";

interface TaskStatusFilterProps {
  selectedStatuses: TaskStatus[];
  onStatusChange: (statuses: TaskStatus[]) => void;
  taskCounts?: Record<TaskStatus, number>;
}

export default function TaskStatusFilter({ 
  selectedStatuses, 
  onStatusChange,
  taskCounts 
}: TaskStatusFilterProps) {
  const statusOptions = getStatusOptions();

  const handleStatusToggle = (
    event: React.MouseEvent<HTMLElement>,
    newStatuses: TaskStatus[]
  ) => {
    onStatusChange(newStatuses);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Filter by Status:
      </Typography>
      <ToggleButtonGroup
        value={selectedStatuses}
        onChange={handleStatusToggle}
        aria-label="task status filter"
        size="small"
      >
        {statusOptions.map((option) => {
          const config = getStatusConfig(option.value);
          const count = taskCounts?.[option.value] || 0;
          
          return (
            <ToggleButton
              key={option.value}
              value={option.value}
              sx={{
                px: 2,
                py: 0.5,
                border: `1px solid ${config.color}40`,
                color: config.color,
                '&.Mui-selected': {
                  backgroundColor: config.bgColor,
                  color: config.color,
                  border: `1px solid ${config.color}`,
                  '&:hover': {
                    backgroundColor: config.bgColor,
                  }
                },
                '&:hover': {
                  backgroundColor: `${config.bgColor}80`,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{option.icon}</span>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {option.label}
                </Typography>
                {count > 0 && (
                  <Badge 
                    badgeContent={count} 
                    color="primary" 
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: 16,
                        minWidth: 16
                      }
                    }}
                  />
                )}
              </Box>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}
