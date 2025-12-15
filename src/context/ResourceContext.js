// src/context/ResourceContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../api/AuthService';
import CacheManager from '../storage/CacheManager';
import LocalStorage from '../storage/LocalStorage';
import ApiClient from '../api/ApiClient';
import { API_ENDPOINTS } from '../api/endpoints';

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
  const [resources, setResources] = useState({
    user: null,
    gameStats: null,
    leaderboard: null,
    settings: null,
  });

  // Проверка подключения к сети
  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Инициализация ресурсов
  useEffect(() => {
    initializeResources();
  }, []);

  const initializeResources = async () => {
    try {
      setIsLoading(true);

      // Загружаем данные из локального хранилища
      const [user, gameStats, settings] = await Promise.all([
        LocalStorage.getItem('user_data'),
        LocalStorage.getGameStats(),
        LocalStorage.getSettings(),
      ]);

      // Проверяем аутентификацию
      const isAuthenticated = await AuthService.checkAuth();

      // Загружаем кэшированные данные
      const leaderboard = await CacheManager.getLeaderboard();

      setResources({
        user: user ? JSON.parse(user) : null,
        gameStats,
        leaderboard,
        settings,
        isAuthenticated,
      });

      // Если онлайн и есть аутентификация, синхронизируем с сервером
      if (isOnline && isAuthenticated) {
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
      const { gameStats } = resources;
      
      // Синхронизируем игровую статистику
      if (gameStats && gameStats.totalScore > 0) {
        await ApiClient.post(API_ENDPOINTS.GAME.SAVE_SCORE, gameStats);
        
        // Обновляем кэш лидерборда
        await CacheManager.invalidateCache('LEADERBOARD');
        const updatedLeaderboard = await CacheManager.getLeaderboard(true);
        
        setResources(prev => ({
          ...prev,
          leaderboard: updatedLeaderboard,
        }));
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const updateGameStats = async (newStats) => {
    try {
      // Обновляем локально
      const updatedStats = {
        ...resources.gameStats,
        ...newStats,
      };
      
      await LocalStorage.saveGameStats(updatedStats);
      
      setResources(prev => ({
        ...prev,
        gameStats: updatedStats,
      }));

      // Если онлайн, синхронизируем с сервером
      if (isOnline) {
        await ApiClient.post(API_ENDPOINTS.GAME.SAVE_SCORE, newStats);
      }

      return { success: true };
    } catch (error) {
      console.error('Update game stats error:', error);
      return { success: false, error };
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = {
        ...resources.settings,
        ...newSettings,
      };
      
      await LocalStorage.saveSettings(updatedSettings);
      
      setResources(prev => ({
        ...prev,
        settings: updatedSettings,
      }));

      return { success: true };
    } catch (error) {
      console.error('Update settings error:', error);
      return { success: false, error };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        setResources(prev => ({
          ...prev,
          user: result.user,
          isAuthenticated: true,
        }));

        // Загружаем данные пользователя с сервера
        if (isOnline) {
          await syncWithServer();
        }
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setResources({
      user: null,
      gameStats: null,
      leaderboard: null,
      settings: null,
      isAuthenticated: false,
    });
  };

  const refreshLeaderboard = async () => {
    try {
      const leaderboard = await CacheManager.getLeaderboard(true);
      setResources(prev => ({
        ...prev,
        leaderboard,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearAllData = async () => {
    try {
      await LocalStorage.clear();
      await CacheManager.invalidateAll();
      setResources({
        user: null,
        gameStats: null,
        leaderboard: null,
        settings: null,
        isAuthenticated: false,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        ...resources,
        isLoading,
        isOnline,
        updateGameStats,
        updateSettings,
        login,
        logout,
        refreshLeaderboard,
        clearAllData,
        syncWithServer,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};