// src/api/AuthService.js
import ApiClient from './ApiClient';
import { API_ENDPOINTS } from './endpoints';
import LocalStorage from '../storage/LocalStorage';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
  }

  async login(email, password) {
    try {
      const response = await ApiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, refreshToken, user } = response;
      
      // Сохраняем токены
      await LocalStorage.setItem('auth_token', token);
      await LocalStorage.setItem('refresh_token', refreshToken);
      await LocalStorage.setItem('user_data', JSON.stringify(user));
      
      this.isAuthenticated = true;
      this.user = user;
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка входа' 
      };
    }
  }

  async register(userData) {
    try {
      const response = await ApiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка регистрации' 
      };
    }
  }

  async logout() {
    try {
      await ApiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearSession();
    }
  }

  async clearSession() {
    await LocalStorage.removeItem('auth_token');
    await LocalStorage.removeItem('refresh_token');
    await LocalStorage.removeItem('user_data');
    this.isAuthenticated = false;
    this.user = null;
  }

  async checkAuth() {
    try {
      const token = await LocalStorage.getItem('auth_token');
      const userData = await LocalStorage.getItem('user_data');
      
      if (token && userData) {
        this.isAuthenticated = true;
        this.user = JSON.parse(userData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = await LocalStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await ApiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });

      await LocalStorage.setItem('auth_token', response.token);
      return response.token;
    } catch (error) {
      await this.clearSession();
      throw error;
    }
  }

  getCurrentUser() {
    return this.user;
  }
}

export default new AuthService();