import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          마사지샵 관리
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<EventNoteIcon />}
          >
            예약 관리
          </Button>
          {hasRole('admin') && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/customers"
                startIcon={<PeopleIcon />}
              >
                고객 관리
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/therapists"
                startIcon={<PersonIcon />}
              >
                관리사 관리
              </Button>
            </>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 