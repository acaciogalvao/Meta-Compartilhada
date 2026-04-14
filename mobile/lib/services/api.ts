import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para erros
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Goals
  async getAllGoals() {
    const response = await this.client.get('/goals');
    return response.data;
  }

  async getGoalById(id: string) {
    const response = await this.client.get(`/goals/${id}`);
    return response.data;
  }

  async createGoal(data: any) {
    const response = await this.client.post('/goals', data);
    return response.data;
  }

  async updateGoal(id: string, data: any) {
    const response = await this.client.put(`/goals/${id}`, data);
    return response.data;
  }

  async deleteGoal(id: string) {
    const response = await this.client.delete(`/goals/${id}`);
    return response.data;
  }

  async addPaymentToGoal(id: string, payment: any) {
    const response = await this.client.post(`/goals/${id}/payments`, payment);
    return response.data;
  }

  async getGoalProgress(id: string) {
    const response = await this.client.get(`/goals/${id}/progress`);
    return response.data;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error' };
    }
  }
}

export const apiService = new ApiService();
