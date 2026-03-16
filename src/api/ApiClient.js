// src/api/ApiClient.js
import axios from 'axios';

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Интерцептор для добавления токена
    this.client.interceptors.request.use(
      (config) => {
        const token = this.token; // Используем this.token вместо localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setAuthToken(token) {
    this.token = token;
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }
}

// СОЗДАЕМ ЭКЗЕМПЛЯР И ЭКСПОРТИРУЕМ ЕГО
const apiClient = new ApiClient('https://api.your-game.com/v1');
export default apiClient;