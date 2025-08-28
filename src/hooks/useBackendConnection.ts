import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface ConnectionStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useBackendConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null,
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.healthCheck();
      setStatus({
        isConnected: true,
        isLoading: false,
        error: null,
        lastChecked: new Date(),
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    checkConnection,
    retry: checkConnection,
  };
};