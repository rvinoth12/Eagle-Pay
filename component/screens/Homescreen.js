import { ActivityIndicator, Dimensions, Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {AntDesign} from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Homescreen = ({route}) => {
  const navigation = useNavigation()
  const [mainBalance,setMainBalance]  = useState(0)
  const [mobileNo,setMobileNo] = useState('')
  const [viewbalance,setViewbalance]= useState(false)
  const [loading,setLoading] = useState(false)



  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height


const viewBal = ()=>{
  setLoading(true)
  mainBal(mobileNo)
  setTimeout(() => {
  setViewbalance(false)
    
  }, 10000);
}
  

const mainBal = async(mobile)=>{
  // const value = await AsyncStorage.getItem('mobile');

  const socket = io('http://192.168.1.17:3000');
  socket.emit('mainBalNo',mobile)
  console.log('mobi',mobile)
  socket.on('mainBal',(res)=>{
    // alert(res)
    if(res != undefined && res != NaN && res != "" && res !== null ){console.log(res)
      setMainBalance(res)
    }
    setLoading(false)
    socket.disconnect()
  })
}

const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('mobile');
    console.log('value',value);
    if (value !== null) {
      // We have data!!
      setMobileNo(value)
      mainBal(value)
    }
  } catch (error) {
    // Error retrieving data
  console.log('error',error)

  }
}


useEffect(()=>{
  retrieveData()
  // mainBal()
},[])

useEffect(()=>{
  // setInterval(()=>{
    viewBal()
  
  
},[route])



  return (
<>    

  <ScrollView >
      <View style={{backgroundColor:'navy'}} className="h-64">
        <View className="flex-row align-middle justify-around  mt-7 ">
              <View></View>
              <TouchableOpacity onPress={()=>navigation.navigate('phonepay')} className="flex-row items-center border-gray-300 border-2 px-3  rounded-full"  style={{width:'70%'}}>
                <AntDesign name='search1' color={'white'} size={20} />
                <Text className="text-gray-300 mx-3">Pay by name or phone number</Text>
              </TouchableOpacity>

              <View className="items-center">
              <AntDesign name='user' color={'white'} size={30} />
                <Text className="text-white">{mainBalance?.Acount_Details?.Holder_Name}</Text>
              </View>
        </View>
            
        <View className="flex-1 mx-auto mt-5 py-10 justify-center items-center">
          {
          
          viewbalance? loading ? <ActivityIndicator size={30}/> : <Text className="text-white font-extrabold text-4xl" >&#8377; {mainBalance?.Acount_Details?.Balance}</Text>:
          <TouchableOpacity onPress={()=>{viewBal(),setViewbalance(true)}} className="  rounded-full bg-white" activeOpacity={0.7}>
            <Text className="text-center py-4 text-teal-600 px-7" >View Balance</Text>
          </TouchableOpacity>
          }
        </View>
      </View>
          
      <View className="p-5">
            <View className="flex-row pb-6 flex-wrap">
            <TouchableOpacity onPress={()=>navigation.navigate('qrcodescanner')} style={{width:'25%'}} className=" p-4 justify-center items-center items-center">
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/qr-code.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Scan any QR code</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/contact-book.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Pay contacts</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={()=>navigation.navigate('phonepay',{mobile:mobileNo})} style={{width:'25%'}} className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/money-transfer.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Pay phone number</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate('banktransfer')} style={{width:'25%'}} className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/bank.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Bank transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/cash-payment.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Pay UPI ID</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/mobile-banking.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Self transfer</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity   className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/bill.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Pay bills</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
              <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/mobile.png')} />
              <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Mobile recharge</Text>
            </TouchableOpacity>
            </View>

            <Text className="p-3 text-xl font-bold">Bills, recharges and more</Text>
            <View className="flex-row py-3 flex-wrap">
              <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/mobile-app.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">DTH / Cable TV</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}}  source={require('../../assets/HomeIcon/taxi.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">FASTag recharge</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/payment.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Postpaid mobile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{width:'25%'}} className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" style={{tintColor:'navy'}} source={require('../../assets/HomeIcon/router.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Broadband / Landline</Text>
              </TouchableOpacity>
            </View>
      </View>

  </ScrollView>
</>
  )
}

export default Homescreen

const styles = StyleSheet.create({})
{/* <View style={{margin:"10%",marginTop:0}}>
            <Text style={{fontSize:23,fontWeight:600}}>Bills, recharges and more</Text>
            <View style={{flexDirection:'row',gap:35,marginVertical:25,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
              <TouchableOpacity  className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/mobile-app.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">DTH / Cable TV</Text>
              </TouchableOpacity>

              <TouchableOpacity  className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/taxi.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">FASTag recharge</Text>
              </TouchableOpacity>

              <TouchableOpacity  className=" p-4 justify-center items-center" >
                <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/payment.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Postpaid mobile</Text>
              </TouchableOpacity>

              <TouchableOpacity  style={{width:"16%",alignItems:'center',gap:4}} >
                <Image className="w-10 h-10 mx-auto" source={require('../../assets/HomeIcon/router.png')} />
                <Text style={{fontSize:11,textAlign:'center'}} className="w-14">Broadband / Landline</Text>
              </TouchableOpacity>

            </View>
          </View> */}