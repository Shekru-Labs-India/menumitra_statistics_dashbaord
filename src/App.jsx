import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import "./assets/css/demo.css";
// Import both CSS files but we'll disable one based on theme
import "./assets/css/theme-default.css";
import "./assets/css/menu.css";
import HomeScreen from './screen/HomeScreen'
import LoginScreen from './screen/LoginScreen'
import MyProfile from './screen/MyProfile'

import Header from './components/Header'
import TopSell from './components/TopSell';
import FoodTypeGraph from './components/FoodTypeGraph';
import Settings from './screen/Settings';
import { ThemeProvider } from './components/ThemeContext';
import ThemeLink from './components/ThemeLink';

// Add data-theme attribute to CSS links for core.css and core-dark.css
document.addEventListener('DOMContentLoaded', () => {
  // Create light theme link
  const lightThemeLink = document.createElement('link');
  lightThemeLink.rel = 'stylesheet';
  lightThemeLink.href = '/src/assets/css/core.css';
  lightThemeLink.setAttribute('data-theme', 'light');
  document.head.appendChild(lightThemeLink);
  
  // Create dark theme link (initially disabled)
  const darkThemeLink = document.createElement('link');
  darkThemeLink.rel = 'stylesheet';
  darkThemeLink.href = '/src/assets/css/core-dark.css';
  darkThemeLink.setAttribute('data-theme', 'dark');
  darkThemeLink.disabled = true; // Start with dark theme disabled
  document.head.appendChild(darkThemeLink);
});

function App() {
  return (
    <ThemeProvider>
      <ThemeLink />
      <Router>
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
    </ThemeProvider>
  )
}

export default App
