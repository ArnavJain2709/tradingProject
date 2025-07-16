import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import {
  Header,
  Sidebar,
  Dashboard,
  Trading,
  Portfolio,
  Watchlist,
  News,
  Settings
} from './components';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />;
      case 'trading':
        return <Trading darkMode={darkMode} />;
      case 'portfolio':
        return <Portfolio darkMode={darkMode} />;
      case 'watchlist':
        return <Watchlist darkMode={darkMode} />;
      case 'news':
        return <News darkMode={darkMode} />;
      case 'analytics':
        return <Dashboard darkMode={darkMode} />;
      case 'settings':
        return <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Background Images */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1709954000490-47ab632f6e7d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldHxlbnwwfHx8Ymx1ZXwxNzUyNjkwMzQ2fDA&ixlib=rb-4.1.0&q=85')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'}`} />
        </div>

        {/* Main App */}
        <div className="relative z-10">
          <Header 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          
          <div className="flex">
            <Sidebar 
              darkMode={darkMode} 
              isOpen={sidebarOpen}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
            
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
              <div className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderActiveComponent()}
                </motion.div>
              </div>
            </main>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;