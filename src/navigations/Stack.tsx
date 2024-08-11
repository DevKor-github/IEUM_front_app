import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import LoginScreen from '../screens/LoginScreen';
import ServiceAgreementScreen from '../screens/ServiceAgreementScreen';
import ProfileSettingScreen from '../screens/ProfileSettingScreen';
import PreferenceStartScreen from '../screens/PreferenceStartScreen';
import PreferenceMBTIScreen from '../screens/PreferenceMBTIScreen';
import PreferenceAreaScreen from '../screens/PreferenceAreaScreen';
import PreferenceStyleScreen from '../screens/PreferenceStyleScreen';
import PreferencePeopleScreen from '../screens/PreferencePeopleScreen';
import PreferenceDoneScreen from '../screens/PreferenceDoneScreen';
import InstagramConnectScreen from '../screens/InstagramConnectScreen';
import SignUpDoneScreen from '../screens/SignUpDoneScreen';
import InstagramFailScreen from '../screens/InstagramFailScreen';
import HomeScreen from '../screens/HomeScreen';
import LinkInputScreen from '../screens/LinkInputScreen';
import LinkRejectScreen from '../screens/LinkRejectScreen';
import MapScreen from '../screens/MapScreen';

const RootStack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen
        name="ServiceAgreement"
        component={ServiceAgreementScreen}
      />
      <RootStack.Screen
        name="ProfileSetting"
        component={ProfileSettingScreen}
      />
      <RootStack.Screen
        name="PreferenceStart"
        component={PreferenceStartScreen}
      />
      <RootStack.Screen
        name="PreferenceMBTI"
        component={PreferenceMBTIScreen}
      />
      <RootStack.Screen
        name="PreferenceArea"
        component={PreferenceAreaScreen}
      />
      <RootStack.Screen
        name="PreferenceStyle"
        component={PreferenceStyleScreen}
      />
      <RootStack.Screen
        name="PreferencePeople"
        component={PreferencePeopleScreen}
      />
      <RootStack.Screen
        name="PreferenceDone"
        component={PreferenceDoneScreen}
      />
      <RootStack.Screen
        name="InstagramConnect"
        component={InstagramConnectScreen}
      />
      <RootStack.Screen name="InstagramFail" component={InstagramFailScreen} />
      <RootStack.Screen name="SignUpDone" component={SignUpDoneScreen} />
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="LinkInput" component={LinkInputScreen} />
      <RootStack.Screen name="LinkReject" component={LinkRejectScreen} />
      <RootStack.Screen name="Map" component={MapScreen} />
    </RootStack.Navigator>
  );
};

export default StackNavigation;
