import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import "./assets/css/demo.css";
import "./assets/css/core.css";
import "./assets/css/theme-default.css";
import HomeScreen from './screen/HomeScreen'
import LoginScreen from './screen/LoginScreen'

import Header from './components/Header'
import TopSell from './components/TopSell';

function App() {
  return (
    <Router>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Routes */}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<HomeScreen />} />
            
            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Add more routes here */}
            {/* Example:
            <Route path="/email" element={<EmailScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            */}

            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
