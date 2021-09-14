import { StatusBar } from 'expo-status-bar';
import React, { createContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer ,createSwitchNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import MainScreen from './screens/MainScreen';
import Ingredients from './screens/Ingredients';
import firebase from 'firebase';

import { firebaseConfig } from './config';
import { render } from 'react-dom';

firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <AppNavigator />
  )
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  MainScreen: MainScreen,
  Ingredients: Ingredients
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
