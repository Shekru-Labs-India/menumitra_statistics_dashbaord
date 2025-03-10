import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import "./assets/css/demo.css";
import "./assets/css/core.css";
import "./assets/css/theme-default.css";
import HomeScreen from './screen/HomeScreen'

import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Routes */}
          <Routes>
            {/* Default redirect to home */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard/Home route */}
            <Route path="/dashboard" element={<HomeScreen />} />

            {/* Add more routes here */}
            {/* Example:
            <Route path="/email" element={<EmailScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            */}

            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
