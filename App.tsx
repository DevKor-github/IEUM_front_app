import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigations/Stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import {useEffect} from 'react';
import {LogBox} from 'react-native';

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <RecoilRoot>
          <StackNavigation />
        </RecoilRoot>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
