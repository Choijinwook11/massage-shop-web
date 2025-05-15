import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          마사지샵 관리 시스템
        </Typography>
        <Box>
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
            to="/reservations"
            startIcon={<EventNoteIcon />}
          >
            예약 관리
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/therapists"
            startIcon={<PersonIcon />}
          >
            관리사 관리
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 