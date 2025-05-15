import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 인증 상태 초기화 함수
  const resetAuth = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      
      if (!token || !role) {
        resetAuth();
        navigate('/login');
        return;
      }

      setUser({ role });
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const login = (token, role) => {
    resetAuth(); // 로그인 전에 기존 인증 정보 초기화
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    setUser({ role });
    navigate('/home');
  };

  const logout = () => {
    resetAuth();
    navigate('/login');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    return !!token && !!role && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 