// src/api/AuthService.js
import LocalStorage from '../storage/LocalStorage';

class AuthService {
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email });
      
      // Получаем список пользователей
      const users = await LocalStorage.getItem('users') || [];
      console.log('Existing users:', users);
      
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        if (existingUser.password === password) {
          const token = 'token_' + Date.now();
          const userData = {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            createdAt: existingUser.createdAt
          };
          
          // ИСПРАВЛЕНО: передаем только значение, без доп. параметров
          await LocalStorage.setItem('authToken', token);
          await LocalStorage.setItem('user_data', userData);
          
          console.log('Login successful for:', email);
          return {
            success: true,
            user: userData,
            token: token
          };
        } else {
          return {
            success: false,
            error: 'Неверный пароль'
          };
        }
      } else {
        return {
          success: false,
          error: 'Пользователь не найден'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  async register(email, password, username) {
    try {
      console.log('Attempting registration with:', { email, username });
      
      // ИСПРАВЛЕНО: получаем массив пользователей или пустой массив
      const users = await LocalStorage.getItem('users') || [];
      console.log('Existing users:', users);
      
      // Проверяем, существует ли пользователь
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        console.log('User already exists:', email);
        return {
          success: false,
          error: 'Пользователь с таким email уже существует'
        };
      }

      // Создаем нового пользователя
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        username,
        createdAt: new Date().toISOString()
      };

      // Добавляем пользователя в список
      users.push(newUser);
      
      // ИСПРАВЛЕНО: сохраняем массив пользователей
      await LocalStorage.setItem('users', users);
      console.log('Users saved successfully:', users);
      
      // Создаем токен и данные для входа
      const token = 'token_' + Date.now();
      const userData = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt
      };
      
      // ИСПРАВЛЕНО: сохраняем токен и данные пользователя
      await LocalStorage.setItem('authToken', token);
      await LocalStorage.setItem('user_data', userData);
      
      console.log('Registration successful for:', email);
      return {
        success: true,
        user: userData,
        token: token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  async logout() {
    try {
      await LocalStorage.removeItem('authToken');
      await LocalStorage.removeItem('user_data');
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async checkAuth() {
    try {
      const token = await LocalStorage.getItem('authToken');
      const userData = await LocalStorage.getItem('user_data');
      
      if (token && userData) {
        console.log('Auth check: authenticated');
        return {
          isAuthenticated: true,
          user: userData,
          token: token
        };
      }
      
      console.log('Auth check: not authenticated');
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    } catch (error) {
      console.error('Check auth error:', error);
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
  }
}

export default new AuthService();