import  React,{TouchableOpacity} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Homescreen from './screens/Homescreen';
import PayPhoneNumber from './screens/paymentScreens/PayPhoneNumber';
import QRScanScreen from './screens/paymentScreens/QRScanScreen';
import BankTransfer from './screens/paymentScreens/BankTransfer';
import BankTransferPay from './screens/paymentScreens/BankTransferPay';
import ShowHistoryScreen from './screens/paymentScreens/ShowHistoryScreen';
import IndividualPaymentHistory from './screens/paymentScreens/IndividualPaymentHistory';
import PhoneNumberPayChatScreen from './screens/paymentScreens/PhoneNumberPaychatScreen';


const Stack = createStackNavigator();

function MainContainer() {

  
  return (
      <Stack.Navigator screenOptions={{headerShown:false}}  initialRouteName='Home' >
        <Stack.Screen name={'Home'} component={Homescreen} />
        <Stack.Screen name='phonepay' component={PayPhoneNumber} />
        <Stack.Screen name='qrcodescanner' component={QRScanScreen} />
        <Stack.Screen options={{headerShown:true,title:"Bank Transfer",headerTitleAlign:'center',headerTintColor:'white',headerTitleStyle:{color:'white'},headerStyle:{backgroundColor:'navy'}}} name={'banktransfer'} component={BankTransfer} />
        <Stack.Screen options={{headerShown:true,title:false,headerTitleAlign:'center',headerTintColor:'white',headerTitleStyle:{color:'white'},headerStyle:{backgroundColor:'navy'}}} name={'banktransferpay'} component={BankTransferPay} />
        <Stack.Screen options={{headerShown:true,title:'Bank History',headerTitleAlign:'center',headerTintColor:'white',headerTitleStyle:{color:'white'},headerStyle:{backgroundColor:'navy'}}} name={'BankHistory'} component={ShowHistoryScreen} />
        <Stack.Screen options={{headerShown:false}} name={'IndividualPaymentHistory'} component={IndividualPaymentHistory} />
        <Stack.Screen options={{headerShown:false}} name={'PhoneNumberPayChatScreen'} component={PhoneNumberPayChatScreen} />
      </Stack.Navigator>
  
  );
}

export default MainContainer;