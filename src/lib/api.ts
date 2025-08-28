// API Configuration for backend connection
const API_BASE_URL = 'https://f73a41b3fd90.ngrok-free.app';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health');
  }

  // Example business-related endpoints
  async getBusinessData(businessId: string) {
    return this.get(`/api/businesses/${businessId}`);
  }

  async updateBusinessSettings(businessId: string, settings: any) {
    return this.put(`/api/businesses/${businessId}/settings`, settings);
  }

  async getMenuData(businessId: string) {
    return this.get(`/api/businesses/${businessId}/menu`);
  }

  async processOrder(businessId: string, orderData: any) {
    return this.post(`/api/businesses/${businessId}/orders`, orderData);
  }

  // Chat/AI endpoints
  async sendChatMessage(businessId: string, message: string) {
    return this.post(`/api/businesses/${businessId}/chat`, { message });
  }

  async getAnalytics(businessId: string, timeframe: string) {
    return this.get(`/api/businesses/${businessId}/analytics?timeframe=${timeframe}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the base URL for direct use if needed
export { API_BASE_URL };