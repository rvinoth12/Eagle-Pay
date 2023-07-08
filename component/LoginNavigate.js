import  React, { useEffect } from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainContainer from './MainContainer';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';

//Screen names
const MainCon = "MainContainer";
const detailsName = "Details";
// const ScanName = "Scan";
// const paymentsName = "Payments";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();
const color1 = "navy" 

function LoginNavigate() {


  return (
    <>
    <StatusBar backgroundColor={'navy'}/>
    {/* <NavigationContainer> */}
      <Tab.Navigator
        initialRouteName={MainCon}
        screenOptions={({ route }) => ({
          tabBarLabelStyle:{color:color1},
          tabBarShowLabel:false,
          tabBarStyle:{height:60,paddingBottom:10},
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            let rn = route.name;

            if (rn === MainCon) {
              iconName = focused ? 'home' : 'home-outline';
            
            } else if (rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={ focused? color1: 'gray'|| color} />;
          },
        })}
        // tabBarOptions={{
        //   activeTintColor: 'tomato',
        //   inactiveTintColor: 'grey',
        //   labelStyle: { paddingBottom: 10, fontSize: 10 ,color:color1},
        //   style: { padding: 10, height: 70}
        // }}
        
        > 

        <Tab.Screen options={{headerShown:false}}  name={MainCon} component={MainContainer}/>
        <Tab.Screen options={{headerShown:false}} name={detailsName} component={DetailsScreen} />
        <Tab.Screen options={{headerShown:false}} name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    {/* </NavigationContainer> */}
    </>
  );
}

export default LoginNavigate;