import React, {useCallback, useRef, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import {View, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import FeedScreen from './FeedScreen';
import CalendarScreen from './CalendarScreen';
import ChatScreen from './ChatScreen';
import HomeScreen from "./HomeScreen";
import AddPostScreen from "./AddPostScreen";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Feed"
      component={FeedScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontSize:18
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft:15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
        headerRight: () => (
          <View style={{marginRight: 15}}>
            <TouchableOpacity>
              <Text style={{fontWeight:'600', fontSize: 18, color: '#2e64e5'}}>Post</Text>
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);


const MainTabScreen = () => {
    return (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#0277bd"
          inactiveTintColor= 'gray'
          barStyle={{ backgroundColor: '#e3e3e3' }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="FeedScreen"
            component={FeedStack}
            options={{
              tabBarLabel: 'Feed',
              title: 'Feed',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-group" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      );

}

export default MainTabScreen;
