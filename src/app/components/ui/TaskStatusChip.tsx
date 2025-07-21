"use client";
import { Chip, Select, MenuItem, FormControl, Box, Typography } from "@mui/material";
import { TaskStatus } from "../../types";
import { getStatusConfig, getStatusOptions } from "../../utils/taskStatus";

interface TaskStatusChipProps {
  status: TaskStatus;
  editable?: boolean;
  size?: 'small' | 'medium';
  onStatusChange?: (newStatus: TaskStatus) => void;
}

export default function TaskStatusChip({ 
  status, 
  editable = false, 
  size = 'small',
  onStatusChange 
}: TaskStatusChipProps) {
  const config = getStatusConfig(status);
  const statusOptions = getStatusOptions();

  if (!editable) {
    return (
      <Chip
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span>{config.icon}</span>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {config.label}
            </Typography>
          </Box>
        }
        size={size}
        sx={{
          backgroundColor: config.bgColor,
          color: config.color,
          border: `1px solid ${config.color}20`,
          fontWeight: 500,
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={status}
        onChange={(e) => onStatusChange?.(e.target.value as TaskStatus)}
        variant="outlined"
        sx={{
          backgroundColor: config.bgColor,
          color: config.color,
          border: `1px solid ${config.color}20`,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-select': {
            py: 0.5,
            px: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{option.icon}</span>
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
