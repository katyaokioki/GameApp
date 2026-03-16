// src/context/ResourceContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
// РАСКОММЕНТИРУЙТЕ ЭТИ ИМПОРТЫ:
import AuthService from '../api/AuthService';
import CacheManager from '../storage/CacheManager';
import LocalStorage from '../storage/LocalStorage';
import ApiClient from '../api/ApiClient';
import { API_ENDPOINTS } from '../api/endpoints';

// УДАЛИТЕ ЭТОТ БЛОК ЗАГЛУШЕК (строки 10-22):
// // ВРЕМЕННЫЕ ЗАГЛУШКИ для разработки
// const AuthService = {
//   checkAuth: async () => ({ isAuthenticated: false, user: null, token: null }),
//   login: async () => ({ success: false }),
//   register: async () => ({ success: false }),
//   logout: async () => {},
// };
// ...

const ResourceContext = createContext();

export const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResourceContext must be used within ResourceProvider');
  }
  return context;
};

export const ResourceProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ИСПРАВЛЕНО: Убираем window и navigator для React Native
  useEffect(() => {
    setIsOnline(true);
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const checkConnection = () => {
        setIsOnline(navigator.onLine);
      };

      window.addEventListener('online', checkConnection);
      window.addEventListener('offline', checkConnection);

      return () => {
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', checkConnection);
      };
    }
  }, []);

  // Инициализация ресурсов
  useEffect(() => {
    initializeResources();
  }, []);

  const initializeResources = async () => {
    try {
      setIsLoading(true);

      // Проверяем аутентификацию
      const authResult = await AuthService.checkAuth();
      setIsAuthenticated(authResult.isAuthenticated);
      
      if (authResult.isAuthenticated && authResult.user) {
        setUser(authResult.user);
        if (authResult.token) {
          ApiClient.setAuthToken(authResult.token);
        }
      }

      // Загружаем данные из локального хранилища
      const [storedGameStats, storedSettings] = await Promise.all([
        LocalStorage.getGameStats(),
        LocalStorage.getSettings(),
      ]);

      setGameStats(storedGameStats);
      setSettings(storedSettings);

      // Загружаем кэшированные данные
      const cachedLeaderboard = await CacheManager.getLeaderboard();
      setLeaderboard(cachedLeaderboard || []);

      // Если онлайн и есть аутентификация, синхронизируем с сервером
      if (isOnline && authResult.isAuthenticated) {
        await syncWithServer();
      }
    } catch (error) {
      console.error('Error initializing resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithServer = async () => {
    try {
      if (gameStats && gameStats.totalScore > 0) {
        await ApiClient.post(API_ENDPOINTS.GAME.SAVE_SCORE, gameStats);
        
        await CacheManager.invalidateCache('LEADERBOARD');
        const updatedLeaderboard = await CacheManager.getLeaderboard(true);
        setLeaderboard(updatedLeaderboard || []);
      }

      const userResponse = await ApiClient.get(API_ENDPOINTS.USER.PROFILE);
      if (userResponse.data) {
        setUser(userResponse.data);
        await LocalStorage.setItem('user_data', userResponse.data);
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const updateGameStats = async (newStats) => {
    try {
      const updatedStats = {
        ...gameStats,
        ...newStats,
      };
      
      await LocalStorage.saveGameStats(updatedStats);
      setGameStats(updatedStats);

      if (isOnline && isAuthenticated) {
        await ApiClient.post(API_ENDPOINTS.GAME.SAVE_SCORE, newStats);
        await CacheManager.invalidateCache('LEADERBOARD');
      }

      return { success: true, data: updatedStats };
    } catch (error) {
      console.error('Update game stats error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      
      await LocalStorage.saveSettings(updatedSettings);
      setSettings(updatedSettings);

      if (isOnline && isAuthenticated) {
        await ApiClient.put(API_ENDPOINTS.SETTINGS.UPDATE, updatedSettings);
      }

      return { success: true, data: updatedSettings };
    } catch (error) {
      console.error('Update settings error:', error);
      return { success: false, error: error.message };
    }
  };

  // Методы авторизации
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        await LocalStorage.setItem('user_data', result.user);
        
        if (result.token) {
          ApiClient.setAuthToken(result.token);
        }

        if (isOnline) {
          await syncWithServer();
        }

        return { success: true, user: result.user };
      }
      
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, username) => {
    try {
      setIsLoading(true);
      const result = await AuthService.register(email, password, username);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        await LocalStorage.setItem('user_data', result.user);
        
        if (result.token) {
          ApiClient.setAuthToken(result.token);
        }

        return { success: true, user: result.user };
      }
      
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      setGameStats(null);
      setLeaderboard([]);
      
      ApiClient.setAuthToken(null);
      await LocalStorage.removeItem('user_data');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const result = await AuthService.checkAuth();
      
      if (result.isAuthenticated && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        if (result.token) {
          ApiClient.setAuthToken(result.token);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const updatedLeaderboard = await CacheManager.getLeaderboard(true);
      setLeaderboard(updatedLeaderboard || []);
      return { success: true, data: updatedLeaderboard };
    } catch (error) {
      console.error('Refresh leaderboard error:', error);
      return { success: false, error: error.message };
    }
  };

  const clearAllData = async () => {
    try {
      await LocalStorage.clear();
      await CacheManager.invalidateAll();
      setUser(null);
      setGameStats(null);
      setLeaderboard([]);
      setSettings(null);
      setIsAuthenticated(false);
      ApiClient.setAuthToken(null);
      return { success: true };
    } catch (error) {
      console.error('Clear all data error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    gameStats,
    leaderboard,
    settings,
    isLoading,
    isOnline,
    isAuthenticated,
    updateGameStats,
    updateSettings,
    login,
    register,
    logout,
    checkAuth,
    refreshLeaderboard,
    clearAllData,
    syncWithServer,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};