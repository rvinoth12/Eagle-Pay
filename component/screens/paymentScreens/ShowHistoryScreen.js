import { View, Text, TouchableOpacity, StyleSheet,  FlatList, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { io } from 'socket.io-client'

const ShowHistoryScreen = ({route}) => {
  const navigation = useNavigation()

const showHistory = (Account_No)=>{
  console.log('da2',route.params.data.mobile,Account_No)

  const socket = io('http://192.168.1.17:3000');
  socket.emit('Individual_Payment_History',{mobile:route.params?.data?.mobile,Account_No:Account_No})
  socket.on("Individual_Payment_History",(res)=>{
    console.log("res2",res)
    if(res.success){
      // setTransactionHistory(res.success)
      navigation.navigate("IndividualPaymentHistory",{data:res.success})
    }
    else if(res.failed){
      navigation.navigate("IndividualPaymentHistory",{data:res.failed})
    }
  })
  // navigation.navigate('IndividualPaymentHistory',{Account_No,Holder_Name})
}




console.log('da',route.params.data)
  return (
   <>
     <ImageBackground blurRadius={20} resizeMode='cover' style={StyleSheet.absoluteFill} source={require('../../../assets/bankbg3.jpg')}/>

   {
    ((route.params?.data.success == "No Transaction History") || (route.params?.data.success == undefined) ) ?
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text className="text-2xl font-semibold text-slate-500">{route.params?.data.success}</Text>
    </View>
    :
     <View >
   <FlatList data={route.params.data.success}
     keyExtractor={(item,index) => index}
     renderItem={({item,index})=>{
       return(
         <TouchableOpacity onPress={showHistory.bind(this,item?.Account_No)} activeOpacity={0.9} style={[style.box_shadow]} className="p-3 my-2 mx-5 rounded-xl bg-gray-100 flex-row items-center justify-between shadow-xl">
             <View className="flex-row items-center gap-8">
             <View className="bg-amber-500 flex-row justify-center w-16 h-16 items-center rounded-full">
               <Text className="text-4xl text-gray-200 font-extrabold  ">{item?.Holder_Name?.slice(3,4)}</Text>
             </View>
             <View>
               <Text className='text-2xl font-extrabold text-gray-600'>{item?.Holder_Name}</Text>
               <Text className='text-sm'>XXXXXXXXX{item?.Account_No?.slice(-4,)}</Text>
             </View>
             </View>
         </TouchableOpacity>
      )}
      }/>


   </View>
   }
   
   </>
  )
}

export default ShowHistoryScreen

const style = StyleSheet.create({
  box_shadow :{
    shadowColor:'black',
    elevation:8,
    // backgroundColor:''
    
  }
})