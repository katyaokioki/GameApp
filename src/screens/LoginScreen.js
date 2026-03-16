import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useResourceContext } from '../context/ResourceContext';
import AnimatedButton from '../components/Button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useResourceContext();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

      setLoading(true);
  try {
    const result = await login(email, password); // result это объект { success, user }
    if (result.success) {
      navigation.replace('Welcome');
    } else {
      Alert.alert('Ошибка', result.error || 'Неверный email или пароль');
    }
  } catch (error) {
    Alert.alert('Ошибка', 'Произошла ошибка при входе');
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
          <Text style={styles.title}>Вход в игру</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Введите ваш email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Введите пароль"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <>
              <AnimatedButton
                title="Войти"
                onPress={handleLogin}
                variant="primary"
                size="large"
                style={styles.button}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>
                  Нет аккаунта? Зарегистрироваться
                </Text>
              </TouchableOpacity>
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
    marginBottom: 15,
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#4A90E2',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
});

export default LoginScreen;