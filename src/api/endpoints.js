// src/api/endpoints.js
export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Игровые данные
  GAME: {
    GET_STATS: '/game/stats',
    SAVE_SCORE: '/game/save-score',
    GET_LEADERBOARD: '/game/leaderboard',
    GET_USER_PROGRESS: '/game/progress/:userId',
    GET_LEVELS: '/game/levels',
  },
  
  // Пользователи
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
    UPLOAD_AVATAR: '/user/avatar',
    GET_FRIENDS: '/user/friends',
  },
  
  // Рейтинги и достижения
  RATING: {
    GLOBAL_LEADERBOARD: '/rating/global',
    FRIENDS_LEADERBOARD: '/rating/friends',
    WEEKLY_TOP: '/rating/weekly',
    ACHIEVEMENTS: '/rating/achievements',
  },
  
  // Настройки
  SETTINGS: {
    GET_SETTINGS: '/settings',
    UPDATE_SETTINGS: '/settings/update',
  },
};