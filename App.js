import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen.js';
import SignupScreen from './screens/SignupScreen';
import DrawerNavigator from './screens/DrawerNavigator.js';

import { initializeApp } from 'firebase/app';
import HomeScreen from './screens/HomeScreen.js';
import MainTabScreen from './screens/MainTabScreen.js';



const Stack = createStackNavigator();

export default function App() {



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen options={{headerShown: false}} name="Login" >
          {(props) => <LoginScreen {...props}/>}
        </Stack.Screen>

        <Stack.Screen options={{headerShown: true}} name="Signup" >
        {(props) => <SignupScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen  options={{headerShown: false}} name="MainTabScreen">
        {(props) => <MainTabScreen/>}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

