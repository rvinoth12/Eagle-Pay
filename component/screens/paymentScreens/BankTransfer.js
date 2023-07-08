import { ActivityIndicator, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {AntDesign} from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BankTransfer = ({route}) => {
    const navigation = useNavigation()
    const [loading,setLoading] = useState(false)
    const [bankDetails, setBankDetails] = useState({AccNo:'',ConAccNo:'',IFSCCode:''})
    const [UserAccount, setUserAccount] = useState([]);
    const [transactionHistory,setTransactionHistory] = useState([])
    // const socket = io('http://192.168.1.17:3000')
    
    let bankDetailValidation = !(/^[A-Z0-9]{11,11}$/).test(bankDetails.IFSCCode) || !(/^[0-9]*$/).test(bankDetails.AccNo) || (bankDetails.AccNo !== bankDetails.ConAccNo)
    
    // socket.on('connect', () => {
    //     console.log('Connected to server');
    // });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected from server');
    // });
    
            
    useEffect(()=>{
      // alert(bankDetails.IFSCCode.length)
      if(bankDetailValidation){
        setLoading(false)
      }
      else{
        setLoading(true)
        sendBankDetails()
      }

    },[bankDetails])
            
  const sendBankDetails = async()=>{
    const socket = io('http://192.168.1.17:3000')
    socket.emit('account_details', bankDetails)
    socket.on("user_account",(result)=>{
      console.log('result',result)
      if(result.success){
        console.log('hello',result.success[0].Acount_Details)
        setUserAccount(result.success[0].Acount_Details)
      }else if(result.failed){
        ToastAndroid.show(result.failed,ToastAndroid.SHORT)
      }
      setLoading(false)
      socket.disconnect()
    })
  }
  
  console.log('user account', UserAccount)   

  const sendAmount = ()=>{
    setBankDetails({AccNo:'',ConAccNo:'',IFSCCode:''})
    navigation.navigate('banktransferpay',UserAccount)
  }


  // show history

  const showHistory = async()=>{
    const socket = io('http://192.168.1.17:3000')

    try {
      const value = await AsyncStorage.getItem('mobile');
      console.log('value',value);
      if (value !== null) {
        socket.emit('transaction_history',{mobile:value})
        socket.on("transaction_history",(res)=>{
          console.log("res",res)
          if(res.success){
            setTransactionHistory(res.success)
            navigation.navigate("BankHistory",{data:res})
          }
          else if(res.failed){
            navigation.navigate("BankHistory",{data:res})
    
            // ToastAndroid.show(res.failed,ToastAndroid.SHORT)
          }
        })
      }
    } catch (error) {
      // Error retrieving data
    console.log('error',error)
  
    }

  }

return (
  <>
    <ScrollView>
      <View className="p-4">
      <Text className="font-medium text-2xl">
        Enter Receiver's Bank Details
      </Text>
      <View className="relative z-0 w-full my-5">
        <TextInput
          value={bankDetails.AccNo}
          keyboardType="number-pad"
          placeholder="Enter Bank Account Number"
          onChangeText={(e)=>{setBankDetails({...bankDetails,AccNo:e}),setUserAccount([])}}
          className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-800"
        />
        <View className='absolute flex-row right-0 bottom-3'>
        { (UserAccount?.length > 0) && !bankDetailValidation  ?
          <AntDesign name='checkcircleo' color={'green'} size={20} /> :
          <AntDesign name='exclamationcircleo' color={'red'} size={20} />
        }
        </View>
        

      </View>
        
      <View className="relative z-0 w-full my-5">
        <TextInput
          value={bankDetails.ConAccNo}
          keyboardType="number-pad"
          placeholder="Re-enter Bank Account Number"
          onChangeText={(e)=>{setBankDetails({...bankDetails,ConAccNo:e}),setUserAccount([])}}
          className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-800"
        />
        <View className='absolute flex-row right-0 bottom-3'>
          {( UserAccount?.length > 0) && !bankDetailValidation  ?
          <AntDesign name='checkcircleo' color={'green'} size={20} /> :
          <AntDesign name='exclamationcircleo' color={'red'} size={20} />
        }
        </View>

      </View>

      <View className="relative z-0 w-full my-5">
        <TextInput
            value={bankDetails.IFSCCode}
            keyboardType="numbers-and-punctuation"
            placeholder="Enter IFSC Code"
            onChangeText={(e)=>{setBankDetails({...bankDetails,IFSCCode:e.toUpperCase()}),setUserAccount([])}}
            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-800"
        />
        <View className='absolute flex-row right-0 bottom-3'>
        { (UserAccount?.length > 0) && !bankDetailValidation ?
          <AntDesign name='checkcircleo' color={'green'} size={20} /> :
          <AntDesign name='exclamationcircleo' color={'red'} size={20} />
        }
        </View>
      </View>

     {
     ((UserAccount?.Account_No == bankDetails.AccNo) && (UserAccount?.IFSC_Code == bankDetails.IFSCCode)) &&
     
       <View className="relative z-0 w-full my-5 border-0 border-b-2 border-gray-300 focus:border-blue-800 valid:border-green-900">
        <View className='absolute flex-row bottom-2'>
          <AntDesign name='dingding' color={'navy'} size={20} />
        </View>
       <TextInput
        keyboardType="numbers-and-punctuation"
        value={`${UserAccount?.Holder_Name}`}
        placeholder="Enter Receiver's Name"
        className="pt-3 transform pb-1 translate-x-7 block w-full px-0 mt-0 bg-transparent "
       />
        
     </View>
     }

      <View className="my-10">
        
        <TouchableOpacity disabled={(bankDetailValidation || (UserAccount.length == 0) )? true:false } onPress={sendAmount} style={{backgroundColor:bankDetailValidation || (UserAccount.length == 0)?'lightgray':'navy'}} className="rounded-full">
           { loading ? <ActivityIndicator className="p-4" size={30} /> : <Text className="p-4 text-center text-white font-bold text-lg">Proceed to Pay</Text>}
        </TouchableOpacity>
        

      </View>

      <TouchableOpacity onPress={showHistory}><Text>Show History</Text></TouchableOpacity>
    </View>

    </ScrollView>
  </>
  );
};

export default BankTransfer;