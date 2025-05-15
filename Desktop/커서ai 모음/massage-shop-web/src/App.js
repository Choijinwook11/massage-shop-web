import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from 'src/contexts/AuthContext';
import ProtectedRoute from 'src/components/ProtectedRoute';
import Navbar from 'src/components/Navbar';
import Login from 'src/pages/Login';
import CustomerManagement from 'src/pages/CustomerManagement';
import ReservationManagement from 'src/pages/ReservationManagement';
import TherapistManagement from 'src/pages/TherapistManagement';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ReservationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Navbar />
                  <CustomerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/therapists"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Navbar />
                  <TherapistManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 