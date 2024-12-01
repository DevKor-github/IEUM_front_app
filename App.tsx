import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigations/Stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import {useEffect} from 'react';
import {LogBox} from 'react-native';
import * as amplitude from '@amplitude/analytics-react-native';
const App = () => {
  useEffect(() => {
    amplitude.init('eb69b03aceb1ca5069e875c838302c96');
    LogBox.ignoreAllLogs(); // 앱에 뜨는 로그 제거
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
