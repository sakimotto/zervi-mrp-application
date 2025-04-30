import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDivisions, setUserDivisions] = useState([]);
  const [currentDivision, setCurrentDivision] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          // Token is still valid
          setCurrentUser(decoded);
          setIsAuthenticated(true);
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Load user divisions
          loadUserDivisions(decoded.id);
        } else {
          // Token expired, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    
    setIsLoading(false);
  }, []);

  const loadUserDivisions = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}/divisions`);
      setUserDivisions(response.data);
      
      // Set current division to the first one if not already set
      if (response.data.length > 0 && !currentDivision) {
        setCurrentDivision(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading user divisions:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      const decoded = jwt_decode(token);
      setCurrentUser(decoded);
      setIsAuthenticated(true);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Load user divisions
      loadUserDivisions(decoded.id);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserDivisions([]);
    setCurrentDivision(null);
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const switchDivision = (divisionId) => {
    const division = userDivisions.find(div => div.id === divisionId);
    if (division) {
      setCurrentDivision(division);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    userDivisions,
    currentDivision,
    login,
    logout,
    switchDivision
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
