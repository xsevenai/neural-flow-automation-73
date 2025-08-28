// Configuration file for different environments

interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'production';
  features: {
    enableChat: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
  };
}

const isDevelopment = import.meta.env.DEV;

const config: Config = {
  apiBaseUrl: isDevelopment 
    ? 'https://f73a41b3fd90.ngrok-free.app' // Your ngrok URL for development
    : 'https://your-railway-app.railway.app', // Your Railway URL for production
  
  environment: isDevelopment ? 'development' : 'production',
  
  features: {
    enableChat: true,
    enableAnalytics: true,
    enableNotifications: isDevelopment ? false : true, // Disable notifications in dev
  },
};

export default config;