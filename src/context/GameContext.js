// src/context/GameContext.js
import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    currentScore: 0,
    currentLevel: 1,
    targets: [],
    timeLeft: 0,
    gameHistory: [],
    isPaused: false,
  });

  // Начать игру
  const startGame = (level = 1, time = 30) => {
    setGameState({
      ...gameState,
      isPlaying: true,
      isPaused: false,
      currentScore: 0,
      currentLevel: level,
      timeLeft: time,
      targets: [],
    });
  };

  // Закончить игру
  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      gameHistory: [
        ...prev.gameHistory,
        {
          score: prev.currentScore,
          level: prev.currentLevel,
          date: new Date().toISOString(),
        },
      ],
    }));
  };

  // Поставить на паузу
  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  };

  // Возобновить игру
  const resumeGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  };

  // Обновить счет
  const updateScore = (points) => {
    setGameState(prev => ({
      ...prev,
      currentScore: prev.currentScore + points,
    }));
  };

  // Обновить таймер
  const updateTimeLeft = (time) => {
    setGameState(prev => ({
      ...prev,
      timeLeft: time,
    }));
  };

  // Добавить цель
  const addTarget = (target) => {
    setGameState(prev => ({
      ...prev,
      targets: [...prev.targets, target],
    }));
  };

  // Удалить цель
  const removeTarget = (targetId) => {
    setGameState(prev => ({
      ...prev,
      targets: prev.targets.filter(t => t.id !== targetId),
    }));
  };

  // Обновить цель
  const updateTarget = (targetId, updates) => {
    setGameState(prev => ({
      ...prev,
      targets: prev.targets.map(t => 
        t.id === targetId ? { ...t, ...updates } : t
      ),
    }));
  };

  // Очистить все цели
  const clearTargets = () => {
    setGameState(prev => ({
      ...prev,
      targets: [],
    }));
  };

  // Перейти на следующий уровень
  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      targets: [],
      timeLeft: getTimeForLevel(prev.currentLevel + 1),
    }));
  };

  // Сбросить игру
  const resetGame = () => {
    setGameState({
      isPlaying: false,
      currentScore: 0,
      currentLevel: 1,
      targets: [],
      timeLeft: 0,
      gameHistory: [],
      isPaused: false,
    });
  };

  // Получить историю игр
  const getGameHistory = () => {
    return gameState.gameHistory;
  };

  // Получить лучший результат
  const getBestScore = () => {
    if (gameState.gameHistory.length === 0) return 0;
    return Math.max(...gameState.gameHistory.map(g => g.score));
  };

  // Вспомогательная функция для получения времени для уровня
  const getTimeForLevel = (level) => {
    switch(level) {
      case 1: return 30;
      case 2: return 25;
      case 3: return 20;
      case 4: return 18;
      case 5: return 15;
      default: return 30 - Math.min(level * 2, 20);
    }
  };

  return (
    <GameContext.Provider
      value={{
        // Состояние
        gameState,
        
        // Основные методы
        startGame,
        endGame,
        pauseGame,
        resumeGame,
        
        // Методы для счета
        updateScore,
        updateTimeLeft,
        
        // Методы для целей
        addTarget,
        removeTarget,
        updateTarget,
        clearTargets,
        
        // Методы для уровней
        nextLevel,
        
        // Методы для сброса
        resetGame,
        
        // Вспомогательные методы
        getGameHistory,
        getBestScore,
        getTimeForLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};