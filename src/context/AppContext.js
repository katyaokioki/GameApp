// src/context/AppContext.js
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
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    currentLevel: 1,
    completedLevels: 0,
    totalLevels: 25,
    gamesPlayed: 0,
    winRate: 0,
    bestScore: 0,
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
  }, [userStats, isLoading]);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userStats');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserStats(parsedData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify(userStats));
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }
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
    });
  };

  return (
    <AppContext.Provider value={{
      userStats,
      addScore,
      completeLevel,
      resetProgress,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};