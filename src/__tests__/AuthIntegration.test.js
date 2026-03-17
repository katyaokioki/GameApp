import AuthService from '../api/AuthService';
import LocalStorage from '../storage/LocalStorage';

// Мокаем LocalStorage
jest.mock('../storage/LocalStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

describe('AuthService Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register should save user to LocalStorage', async () => {
    // Мокаем возврат пустого списка пользователей
    LocalStorage.getItem.mockResolvedValueOnce([]);
    
    const result = await AuthService.register('test@test.com', 'password123', 'Tester');
    
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('test@test.com');
    expect(LocalStorage.setItem).toHaveBeenCalledWith('users', expect.any(Array));
    expect(LocalStorage.setItem).toHaveBeenCalledWith('authToken', expect.any(String));
    expect(LocalStorage.setItem).toHaveBeenCalledWith('user_data', expect.any(Object));
  });

  test('login should retrieve user from LocalStorage', async () => {
    // Мокаем существующего пользователя
    const mockUsers = [{
      id: '123',
      email: 'test@test.com',
      password: 'password123',
      username: 'Tester',
      createdAt: '2024-01-01'
    }];
    
    LocalStorage.getItem.mockResolvedValueOnce(mockUsers);
    
    const result = await AuthService.login('test@test.com', 'password123');
    
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('test@test.com');
  });

  test('login with wrong password should fail', async () => {
    const mockUsers = [{
      id: '123',
      email: 'test@test.com',
      password: 'password123',
      username: 'Tester'
    }];
    
    LocalStorage.getItem.mockResolvedValueOnce(mockUsers);
    
    const result = await AuthService.login('test@test.com', 'wrongpassword');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Неверный пароль');
  });

  test('logout should remove auth data', async () => {
    await AuthService.logout();
    
    expect(LocalStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(LocalStorage.removeItem).toHaveBeenCalledWith('user_data');
  });
});