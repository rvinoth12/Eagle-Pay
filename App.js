import  React from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import MainContainer from './component/MainContainer';
import DetailsScreen from './component/screens/DetailsScreen';
import SettingsScreen from './component/screens/SettingsScreen';
import Register from './component/Onboard/Register';
import LoginNavigate from './component/LoginNavigate';


//Screen names
const MainCon = "MainContainer";
const detailsName = "Details";
// const ScanName = "Scan";
// const paymentsName = "Payments";
const settingsName = "Settings";

const Stack = createStackNavigator();

const color1 = "navy" 

function App() {

  return (
    <>
    <StatusBar backgroundColor={'navy'}/>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='login' screenOptions={{headerShown:false}}>
        <Stack.Screen name='login' component={Register} />
        <Stack.Screen name='main' component={LoginNavigate} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

export default App;