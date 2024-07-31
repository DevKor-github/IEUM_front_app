import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import LoginScreen from '../screens/LoginScreen';
import PreferenceStartScreen from '../screens/PreferenceStartScreen';

const RootStack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      {/* <RootStack.Screen name="Todo" component={TodoScreen} />
      <RootStack.Screen name="Workout" component={WorkoutScreen} />
      <RootStack.Screen name="Routine" component={RoutineScreen} /> */}
    </RootStack.Navigator>
  );
};

export default StackNavigation;