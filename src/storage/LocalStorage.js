// src/storage/LocalStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorage {
  constructor() {
    this.cache = new Map();
    this.expiryTimes = new Map();
  }

  // Основные методы
  async setItem(key, value, ttl = null) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(item));
      
      // Кэшируем в памяти
      this.cache.set(key, value);
      if (ttl) {
        this.expiryTimes.set(key, Date.now() + ttl);
      }
      
      return true;
    } catch (error) {
      console.error('Error setting item:', error);
      return false;
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      // Проверяем кэш в памяти
      if (this.cache.has(key)) {
        const expiryTime = this.expiryTimes.get(key);
        if (!expiryTime || expiryTime > Date.now()) {
          return this.cache.get(key);
        }
        // Кэш истек
        this.cache.delete(key);
        this.expiryTimes.delete(key);
      }

      // Загружаем из AsyncStorage
      const itemString = await AsyncStorage.getItem(key);
      if (!itemString) return defaultValue;

      const item = JSON.parse(itemString);
      
      // Проверяем TTL
      if (item.ttl && (Date.now() - item.timestamp) > item.ttl) {
        await this.removeItem(key);
        return defaultValue;
      }
      
      // Кэшируем в памяти
      this.cache.set(key, item.value);
      if (item.ttl) {
        this.expiryTimes.set(key, item.timestamp + item.ttl);
      }
      
      return item.value;
    } catch (error) {
      console.error('Error getting item:', error);
      return defaultValue;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      this.cache.delete(key);
      this.expiryTimes.delete(key);
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      this.cache.clear();
      this.expiryTimes.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  // Специальные методы для приложения
  async getGameStats() {
    return this.getItem('game_stats', {
      totalScore: 0,
      currentLevel: 1,
      gamesPlayed: 0,
    });
  }

  async saveGameStats(stats) {
    return this.setItem('game_stats', stats);
  }

  async getSettings() {
    return this.getItem('game_settings', {
      soundEnabled: true,
      notifications: true,
      difficulty: 'medium',
      theme: 'dark',
    });
  }

  async saveSettings(settings) {
    return this.setItem('game_settings', settings);
  }

  // Методы с TTL (Time To Live)
  async setItemWithTTL(key, value, ttlMs) {
    return this.setItem(key, value, ttlMs);
  }

  // Метод для очистки просроченных данных
  async cleanupExpired() {
    const keys = await this.getAllKeys();
    for (const key of keys) {
      await this.getItem(key); // Метод автоматически удалит просроченные
    }
  }
}

export default new LocalStorage();