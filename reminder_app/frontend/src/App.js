import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AccueilDashboard from './components/AccueilDashboard';
import AjoutMedicament from './components/AjoutMedicament';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsAuthenticated(true);
      const userData = JSON.parse(user);
      setCurrentUser(userData.email);
    }
  }, []);

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setCurrentUser(email);    
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path="/login"
            element={
              isAuthenticated ?
               <Navigate to
            }
          <Route exact path="/" component={Home} />


}