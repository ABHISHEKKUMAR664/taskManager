"use client";
import { Button, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

interface DashboardHeaderProps {
  username: string | null;
  onSignOut: () => void;
}

export default function DashboardHeader({ username, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Typography variant="h4">Welcome, {username || 'User'}</Typography>
      <Button 
        variant="outlined" 
        color="error" 
        startIcon={<LogoutIcon />} 
        onClick={onSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}
