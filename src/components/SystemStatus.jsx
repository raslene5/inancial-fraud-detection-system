import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Chip } from '@mui/material';
import { checkApiHealth } from '../FraudService';

const SystemStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkSystemStatus = async () => {
    try {
      const health = await checkApiHealth();
      setBackendStatus(health.status === 'UP' ? 'online' : 'offline');
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      setBackendStatus('offline');
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Backend Online';
      case 'offline': return 'Backend Offline';
      default: return 'Checking...';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {backendStatus === 'offline' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Backend service is not available. Please ensure the backend server is running on port 8089.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          label={getStatusText(backendStatus)}
          color={getStatusColor(backendStatus)}
          variant="outlined"
          icon={backendStatus === 'checking' ? <CircularProgress size={16} /> : undefined}
        />
        {lastCheck && (
          <Typography variant="caption" color="text.secondary">
            Last checked: {lastCheck}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SystemStatus;