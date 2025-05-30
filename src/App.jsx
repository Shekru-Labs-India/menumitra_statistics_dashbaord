import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import "./assets/css/demo.css";
import "./assets/css/core.css";
import "./assets/css/theme-default.css";
import "./assets/css/menu.css";
import HomeScreen from './screen/HomeScreen'
import LoginScreen from './screen/LoginScreen'
import MyProfile from './screen/MyProfile'
import CompareOutlets from './screen/CompareOutlets'
import { ThemeProvider } from './components/ThemeContext'
import { DashboardProvider } from './context/DashboardContext'

import Header from './components/Header'
import ProductAnalysis from './components/ProductAnalysis';
import FoodTypeGraph from './components/FoodTypeGraph';
import Settings from './screen/Settings';
import MyActivity from './screen/MyActivity';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <DashboardProvider>
          <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
              {/* Routes */}
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginScreen />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<HomeScreen />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/settings" element={<Settings />} /> 
                <Route path="/compare-outlets" element={<CompareOutlets />} /> 
                
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
                <Route path="/my-activity" element={<MyActivity />} />
              </Routes>
            </div>
          </div>
        </DashboardProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
