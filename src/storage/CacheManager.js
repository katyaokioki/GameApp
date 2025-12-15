// src/storage/CacheManager.js
import LocalStorage from './LocalStorage';

class CacheManager {
  constructor() {
    this.cacheConfig = {
      GAME_STATS: { ttl: 5 * 60 * 1000 }, // 5 минут
      LEADERBOARD: { ttl: 10 * 60 * 1000 }, // 10 минут
      USER_PROFILE: { ttl: 30 * 60 * 1000 }, // 30 минут
      SETTINGS: { ttl: 24 * 60 * 60 * 1000 }, // 24 часа
    };
  }

  async getFromCache(key, fetchFunction, cacheKey = key) {
    try {
      // Пытаемся получить из кэша
      const cached = await LocalStorage.getItem(cacheKey);
      
      if (cached) {
        console.log(`Cache hit for ${key}`);
        return cached;
      }

      // Если нет в кэше, загружаем
      console.log(`Cache miss for ${key}, fetching...`);
      const data = await fetchFunction();
      
      // Сохраняем в кэш
      const ttl = this.cacheConfig[key]?.ttl || 5 * 60 * 1000;
      await LocalStorage.setItemWithTTL(cacheKey, data, ttl);
      
      return data;
    } catch (error) {
      console.error(`Cache error for ${key}:`, error);
      throw error;
    }
  }

  async invalidateCache(key) {
    await LocalStorage.removeItem(key);
  }

  async invalidateAll() {
    const cacheKeys = Object.keys(this.cacheConfig);
    for (const key of cacheKeys) {
      await this.invalidateCache(key);
    }
  }

  // Специальные методы для приложения
  async getLeaderboard(forceRefresh = false) {
    const cacheKey = 'LEADERBOARD';
    
    if (forceRefresh) {
      await this.invalidateCache(cacheKey);
    }

    return this.getFromCache(cacheKey, async () => {
      // Здесь будет реальный API запрос
      return {
        global: [],
        friends: [],
        weekly: [],
      };
    });
  }

  async getUserProfile(userId, forceRefresh = false) {
    const cacheKey = `USER_PROFILE_${userId}`;
    
    if (forceRefresh) {
      await this.invalidateCache(cacheKey);
    }

    return this.getFromCache(cacheKey, async () => {
      // Здесь будет реальный API запрос
      return {
        id: userId,
        name: 'Player',
        level: 1,
        score: 0,
      };
    });
  }
}

export default new CacheManager();