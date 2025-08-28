import { useBackendConnection } from '@/hooks/useBackendConnection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export const BackendStatus = () => {
  const { isConnected, isLoading, error, lastChecked, retry } = useBackendConnection();

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking connection...';
    if (isConnected) return 'Backend Connected';
    return 'Backend Disconnected';
  };

  const getStatusColor = () => {
    if (isConnected) return 'text-green-600';
    if (error) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {lastChecked && (
          <span className="text-sm text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={retry}
          disabled={isLoading}
          className="ml-auto"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to connect to backend: {error}
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully connected to your ngrok backend at https://f73a41b3fd90.ngrok-free.app
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};