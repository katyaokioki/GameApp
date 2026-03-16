import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Video } from 'expo-av';
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import AnimatedButton from '../components/Button';
import { useResourceContext } from '../context/ResourceContext';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const videoTopRef = useRef(null);
  const videoBottomRef = useRef(null);
  const { isAuthenticated, user, logout } = useResourceContext();
  
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    RussoOne_400Regular,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы действительно хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              // После выхода перенаправляем на экран входа
              navigation.replace('Login');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handlePlayAsGuest = () => {
    navigation.navigate('Main');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      
      <View style={styles.videosContainer}>
        <View style={styles.videoHalf}>
          <Video
            ref={videoTopRef}
            source={require('../../assets/macan.mp4')}
            style={styles.video}
            resizeMode="cover"
            isLooping={true}
            isMuted={true}
            shouldPlay={true}
          />
        </View>
        
        <View style={styles.videoHalf}>
          <Video
            ref={videoBottomRef}
            source={require('../../assets/macan.mp4')}
            style={styles.video}
            resizeMode="cover"
            isLooping={true}
            isMuted={true}
            shouldPlay={true}
          />
        </View>
      </View>
        
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>to the Game</Text>
        
        {isAuthenticated ? (
          // Пользователь авторизован
          <>
            <Text style={styles.welcomeText}>
              Добро пожаловать, {user?.username || user?.email}!
            </Text>
            
            <AnimatedButton
              title="Начать игру"
              onPress={() => navigation.navigate('Main')}
              variant="primary"
              size="large"
              style={styles.button}
              textStyle={styles.buttonText}
            />
            
            <AnimatedButton
              title="Правила"
              onPress={() => navigation.navigate('Rules')}
              variant="secondary"
              size="large"
              style={[styles.button, styles.secondaryButton]}
              textStyle={[styles.buttonText, styles.secondaryButtonText]}
            />
            
            <AnimatedButton
              title="Выйти"
              onPress={handleLogout}
              variant="outline"
              size="large"
              style={[styles.button, styles.logoutButton]}
              textStyle={[styles.buttonText, styles.logoutButtonText]}
            />
          </>
        ) : (
          // Пользователь не авторизован
          <>
            <View style={styles.authButtonsContainer}>
              <AnimatedButton
                title="Войти"
                onPress={() => navigation.navigate('Login')}
                variant="primary"
                size="large"
                style={styles.authButton}
                textStyle={styles.buttonText}
              />
              
              <AnimatedButton
                title="Регистрация"
                onPress={() => navigation.navigate('Register')}
                variant="secondary"
                size="large"
                style={[styles.authButton, styles.registerButton]}
                textStyle={[styles.buttonText, styles.registerButtonText]}
              />
            </View>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <AnimatedButton
              title="Играть как гость"
              onPress={handlePlayAsGuest}
              variant="outline"
              size="large"
              style={[styles.button, styles.guestButton]}
              textStyle={[styles.buttonText, styles.guestButtonText]}
            />
            
            <AnimatedButton
              title="Правила"
              onPress={() => navigation.navigate('Rules')}
              variant="secondary"
              size="large"
              style={[styles.button, styles.secondaryButton]}
              textStyle={[styles.buttonText, styles.secondaryButtonText]}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videosContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  videoHalf: {
    flex: 1,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  title: {
    fontSize: width > 400 ? 48 : 40,
    color: '#fff',
    fontFamily: 'RussoOne_400Regular',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width > 400 ? 24 : 20,
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#4A90E2',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  authButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  authButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  registerButtonText: {
    color: '#fff',
  },
  button: {
    minWidth: 200,
    marginVertical: 8,
  },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff4444',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ff4444',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A90E2',
    marginBottom: 8,
  },
  guestButtonText: {
    color: '#4A90E2',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: 10,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});

export default WelcomeScreen;