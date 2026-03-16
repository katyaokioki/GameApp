import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useResourceContext } from '../context/ResourceContext';
import AnimatedButton from '../components/Button';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useResourceContext();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !username) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting registration with:', { email, username });
      const result = await register(email, password, username);
      console.log('Registration result:', result);
      
      if (result && result.success) {
        Alert.alert('Успех', 'Регистрация прошла успешно!', [
          { text: 'OK', onPress: () => navigation.replace('Welcome') }
        ]);
      } else {
        Alert.alert('Ошибка', result?.error || 'Пользователь с таким email уже существует');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Регистрация</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Имя пользователя</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Введите имя"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Введите email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Минимум 6 символов"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Подтвердите пароль</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Повторите пароль"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <>
              <AnimatedButton
                title="Зарегистрироваться"
                onPress={handleRegister}
                variant="primary"
                size="large"
                style={styles.button}
              />

              <AnimatedButton
                title="Уже есть аккаунт? Войти"
                onPress={() => navigation.navigate('Login')}
                variant="secondary"
                size="large"
                style={styles.secondaryButton}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'RussoOne_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto_400Regular',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
  secondaryButton: {
    marginTop: 5,
  },
});

export default RegisterScreen;