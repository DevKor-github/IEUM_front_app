import React from 'react';
import {Image, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeStackParamList,
  MapStackParamList,
  RootStackParamList,
  TabParamList,
  TravelStackParamList,
} from '../../types';
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
import ProfileEditScreen from '../screens/ProfileEditScreen';
import LinkInputScreen from '../screens/LinkInputScreen';
import LinkRejectScreen from '../screens/LinkRejectScreen';
import SpotCandidateScreen from '../screens/SpotCandidateScreen';
import SpotSaveScreen from '../screens/SpotSaveScreen';
import FolderListScreen from '../screens/FolderListScreen';
import NewFolderScreen from '../screens/NewFolderScreen';
import FolderPlaceListScreen from '../screens/FolderPlaceListScreen';
import RenameFolderScreen from '../screens/RenameFolderScreen';
import PlaceListScreen from '../screens/PlaceListScreen';
import MapScreen from '../screens/MapScreen';
import TravelScreen from '../screens/TravelScreen';

import MapTabIcon from '../assets/map-tab-icon.svg';
import ActiveMapTabIcon from '../assets/active-map-tap-icon.svg';
import HomeTabIcon from '../assets/home-tab-icon.svg';
import ActiveHomeTabIcon from '../assets/active-home-tab-icon.svg';
import TravelTabIcon from '../assets/travel-tab-icon.svg';
import ActiveTravelTabIcon from '../assets/active-travel-tab-icon.svg';
import BackButton from '../assets/back-button.svg';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import type {HeaderBackButton} from '@react-navigation/elements';

const RootStack = createStackNavigator<RootStackParamList>();
const MapStack = createStackNavigator<MapStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const TravelStack = createStackNavigator<TravelStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// function renderBackButton(): React.ComponentProps<any> {
//   return (
//     <View style={{marginLeft: 24}}>
//       <BackButton />
//     </View>
//   );
// }

const renderBackButton = (): React.ComponentProps<any> => {
  return <BackButton style={{marginLeft: 24}} />;
};

function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({route}) => ({
        tabBarStyle: {height: 85},
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF5570',
        tabBarInactiveTintColor: '#363636',
        headerShown: false,
        tabBarIcon: ({focused}) => {
          if (route.name === 'MapTab') {
            return focused ? <ActiveMapTabIcon /> : <MapTabIcon />;
          } else if (route.name === 'HomeTab') {
            return focused ? <ActiveHomeTabIcon /> : <HomeTabIcon />;
          } else if (route.name === 'TravelTab') {
            return focused ? <ActiveTravelTabIcon /> : <TravelTabIcon />;
          }
          return null;
        },
        tabBarLabel: ({color}) => {
          let label;
          if (route.name === 'MapTab') {
            label = '지도';
          } else if (route.name === 'HomeTab') {
            label = '홈';
          } else if (route.name === 'TravelTab') {
            label = '여행 만들기';
          }

          return (
            <Text style={{color, fontSize: 11, fontWeight: '500'}}>
              {label}
            </Text>
          );
        },
      })}>
      <Tab.Screen
        name="MapTab"
        component={MStack}
        options={{
          title: '지도',
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HStack}
        options={{
          title: '홈',
        }}
      />
      <Tab.Screen
        name="TravelTab"
        component={TStack}
        options={{
          title: '여행 만들기',
        }}
      />
    </Tab.Navigator>
  );
}

const MStack = () => {
  return (
    <MapStack.Navigator
      initialRouteName="Map"
      screenOptions={{headerShown: false}}>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitleVisible: false,
          headerBackImage: renderBackButton,
        }}
      />
    </MapStack.Navigator>
  );
};

const HStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="LinkInput" component={LinkInputScreen} />
      <HomeStack.Screen name="LinkReject" component={LinkRejectScreen} />
      <HomeStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <HomeStack.Screen name="SpotCandidate" component={SpotCandidateScreen} />
      <HomeStack.Screen name="SpotSave" component={SpotSaveScreen} />
      <HomeStack.Screen name="FolderList" component={FolderListScreen} />
      <HomeStack.Screen name="NewFolder" component={NewFolderScreen} />
      <HomeStack.Screen
        name="FolderPlaceList"
        component={FolderPlaceListScreen}
      />
      <HomeStack.Screen name="RenameFolder" component={RenameFolderScreen} />
      <HomeStack.Screen name="PlaceList" component={PlaceListScreen} />
      {/* Removed ServiceAgreement from HomeStack to avoid duplicate nesting */}
    </HomeStack.Navigator>
  );
};

const TStack = () => {
  return (
    <TravelStack.Navigator
      initialRouteName="Travel"
      screenOptions={{headerShown: false}}>
      <TravelStack.Screen name="Travel" component={TravelScreen} />
    </TravelStack.Navigator>
  );
};

const SignUpStackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="ServiceAgreement"
      screenOptions={{headerShown: false}}>
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
      <RootStack.Screen name="Home" component={TabNavigation} />
    </RootStack.Navigator>
  );
};

const StackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Home" component={TabNavigation} />
      <RootStack.Screen
        name="ServiceAgreement"
        component={SignUpStackNavigation}
      />
    </RootStack.Navigator>
  );
};

export default StackNavigation;
