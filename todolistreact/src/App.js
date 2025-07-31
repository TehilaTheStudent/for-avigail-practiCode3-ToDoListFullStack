import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import Login from './Login';
import Register from './Register';
import { isAuthenticated, logout } from './authService';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]); // debug log messages
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [dbStatus, setDbStatus] = useState('Unknown');

  // Add a log message to the debug panel
  const addLog = (msg, type = 'info') => {
    setLogs(logs => [...logs, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  // Health check polling
  useEffect(() => {
    let lastStatus = null;
    let lastDbStatus = null;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) {
          const data = await res.json();
          setDbStatus(data.dbStatus || 'Unknown');
          if (data.dbStatus !== 'Healthy' && lastDbStatus !== data.dbStatus) {
            addLog(`MySQL DB status: ${data.dbStatus}`, 'error');
          }
          if (lastStatus !== true) addLog('Backend healthy', 'success');
          setBackendHealthy(true);
          lastStatus = true;
          lastDbStatus = data.dbStatus;
        } else {
          if (lastStatus !== false) addLog('Backend unhealthy', 'error');
          setBackendHealthy(false);
          setDbStatus('Unknown');
          lastStatus = false;
          lastDbStatus = null;
        }
      } catch (e) {
        if (lastStatus !== false) addLog('Backend unreachable', 'error');
        setBackendHealthy(false);
        setDbStatus('Unreachable');
        lastStatus = false;
        lastDbStatus = null;
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated
    setIsLoggedIn(isAuthenticated());
    setLoading(false);
    addLog('App loaded. Auth checked.', 'debug');
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    addLog('User logged in', 'success');
  };

  const handleRegister = (token) => {
    setIsLoggedIn(true);
    addLog('User registered and logged in', 'success');
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    addLog('User logged out', 'info');
  };

  if (loading) {
    return (
      <div className="App">
        <BackendStatusIndicator healthy={backendHealthy} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
        <DebugPanel logs={logs} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="App">
        <BackendStatusIndicator healthy={backendHealthy} />
        {showRegister ? (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegister(false)}
            addLog={addLog}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
            addLog={addLog}
          />
        )}
        <DebugPanel logs={logs} />
      </div>
    );
  }

  return (
    <div className="App">
      <BackendStatusIndicator healthy={backendHealthy} />
      <TodoList onLogout={handleLogout} addLog={addLog} />
      <DebugPanel logs={logs} />
    </div>
  );
}

// Backend connection indicator
function BackendStatusIndicator({ healthy, dbStatus }) {
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 20,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(30,30,30,0.85)',
      padding: '4px 12px',
      borderRadius: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      color: healthy && dbStatus === 'Healthy' ? '#7fff7f' : dbStatus !== 'Healthy' && healthy ? '#ffd27f' : '#ff7f7f',
      fontWeight: 600,
      fontSize: '1rem',
      border: healthy && dbStatus === 'Healthy' ? '1.5px solid #7fff7f' : dbStatus !== 'Healthy' && healthy ? '1.5px solid #ffd27f' : '1.5px solid #ff7f7f',
      transition: 'all 0.3s'
    }}
    title={
      healthy
        ? dbStatus === 'Healthy'
          ? 'Backend and MySQL connected'
          : `Backend up, DB issue: ${dbStatus}`
        : 'Backend connection lost'
    }
  >
      <span style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: healthy && dbStatus === 'Healthy' ? '#7fff7f' : dbStatus !== 'Healthy' && healthy ? '#ffd27f' : '#ff7f7f',
        marginRight: 6,
        boxShadow: healthy && dbStatus === 'Healthy' ? '0 0 6px #7fff7f' : dbStatus !== 'Healthy' && healthy ? '0 0 6px #ffd27f' : '0 0 6px #ff7f7f',
        border: '1px solid #333',
      }} />
      {healthy
        ? dbStatus === 'Healthy'
          ? 'Connected'
          : 'DB Issue'
        : 'No Connection'}
      {healthy && dbStatus !== 'Healthy' && (
        <span style={{ color: '#ffd27f', marginLeft: 8, fontWeight: 400, fontSize: '0.95em' }}>
          ({dbStatus})
        </span>
      )}
    </div>
  );
}

// DebugPanel component
function DebugPanel({ logs }) {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100vw',
      maxHeight: '30vh',
      overflowY: 'auto',
      background: 'rgba(30,30,30,0.98)',
      color: '#fff',
      fontSize: '0.85rem',
      zIndex: 9999,
      borderTop: '2px solid #764ba2',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{padding: '4px 10px', fontWeight: 600, letterSpacing: 1, background: '#764ba2'}}>Debug & Log Panel</div>
      <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
        {logs.map((log, i) => (
          <li key={i} style={{
            padding: '2px 10px',
            color: log.type === 'error' ? '#ff7f7f' : log.type === 'success' ? '#7fff7f' : log.type === 'debug' ? '#7fd7ff' : '#fff',
            borderBottom: '1px solid #333',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            [{log.time}] {log.type.toUpperCase()} - {log.msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

