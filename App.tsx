import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigations/Stack';

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;
