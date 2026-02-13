// AppContext.js - обновленная версия
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Состояние статистики пользователя
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    currentLevel: 1,
    completedLevels: 0,
    totalLevels: 25,
    gamesPlayed: 0,
    winRate: 0,
    bestScore: 0,
    currentGameScore: 0,
    currentGameLevel: 1,
  });

  // Состояние настроек приложения
  const [settings, setSettings] = useState({
    soundEnabled: true,
    notificationsEnabled: true,
    vibrationEnabled: true,
    difficulty: 'Средний',
    username: 'Игрок',
  });

  const [isLoading, setIsLoading] = useState(true);

  // Загружаем сохраненные данные при запуске
  useEffect(() => {
    loadSavedData();
  }, []);

  // Сохраняем данные при изменении
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [userStats, settings, isLoading]);

  const loadSavedData = async () => {
    try {
      // Загружаем статистику
      const savedStats = await AsyncStorage.getItem('userStats');
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        setUserStats(parsedStats);
      }

      // Загружаем настройки
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      // Сохраняем статистику
      await AsyncStorage.setItem('userStats', JSON.stringify(userStats));
      
      // Сохраняем настройки
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }
  };

  // Функции для игры
  const startNewGame = () => {
    setUserStats(prev => ({
      ...prev,
      currentGameScore: 0,
      currentGameLevel: 1,
    }));
  };

  const addGameScore = (points) => {
    setUserStats(prev => ({
      ...prev,
      currentGameScore: prev.currentGameScore + points,
    }));
  };

  const completeGameLevel = (score) => {
    setUserStats(prev => {
      const newTotalScore = prev.totalScore + score;
      const newBestScore = Math.max(prev.bestScore, score);
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newCurrentLevel = prev.currentGameLevel + 1;
      
      return {
        ...prev,
        totalScore: newTotalScore,
        gamesPlayed: newGamesPlayed,
        bestScore: newBestScore,
        currentGameLevel: newCurrentLevel,
        currentLevel: Math.max(prev.currentLevel, newCurrentLevel),
        completedLevels: prev.completedLevels + 1,
      };
    });
  };

  const addScore = (points) => {
    setUserStats(prev => {
      const newTotalScore = prev.totalScore + points;
      const newBestScore = Math.max(prev.bestScore, points);
      const newGamesPlayed = prev.gamesPlayed + 1;
      
      return {
        ...prev,
        totalScore: newTotalScore,
        gamesPlayed: newGamesPlayed,
        bestScore: newBestScore,
      };
    });
  };

  const completeLevel = (levelNumber, score) => {
    setUserStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      currentLevel: Math.max(prev.currentLevel, levelNumber + 1),
      completedLevels: prev.completedLevels + 1,
    }));
  };

  const resetProgress = () => {
    setUserStats({
      totalScore: 0,
      currentLevel: 1,
      completedLevels: 0,
      totalLevels: 25,
      gamesPlayed: 0,
      winRate: 0,
      bestScore: 0,
      currentGameScore: 0,
      currentGameLevel: 1,
    });
  };

  // Функции для обновления настроек
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings({
      soundEnabled: true,
      notificationsEnabled: true,
      vibrationEnabled: true,
      difficulty: 'Средний',
      username: 'Игрок',
    });
  };

  return (
    <AppContext.Provider value={{
      // Статистика и функции
      userStats,
      addScore,
      addGameScore,
      startNewGame,
      completeLevel,
      completeGameLevel,
      resetProgress,
      
      // Настройки и функции
      settings,
      updateSettings,
      resetSettings,
      
      // Состояние загрузки
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};