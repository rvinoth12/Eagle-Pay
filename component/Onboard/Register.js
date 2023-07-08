import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} 
from "react-native";
import React, {useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const navigation = useNavigation()
  // const [regData, setRegData] = useState({mobile:'',pass:'',confPass:''});
  const [logData, setLogData] = useState({mobile:'',pass:''});
  const [loading,setLoading] = useState(false)

// regex 
const regexName = /^[a-zA-Z]{3,}$/;
const mobile = /^[0-9]{10,10}$/
const regexPass  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/


const storeData = async () => {
  try {
    await AsyncStorage.setItem(
      'mobile',
      logData.mobile,
    );
    // console.log('set success',route.params?.mobile)
  } catch (error) {
    // Error saving data
    console.log('error',error)
  }
};



const login = ()=>{
  console.log(logData)
  if(!(/^[0-9]{10,10}$/).test(logData.mobile) || logData.pass == ''){
    ToastAndroid.show('enter correct phone no or password',ToastAndroid.SHORT)
  }
  else{
  const socket = io('http://192.168.1.17:3000')
    socket.emit('login', logData)
    socket.on("login",(result)=>{
      console.log('result',result)
      if(result.success){
        ToastAndroid.show("Login Success",ToastAndroid.SHORT)
        // setUserAccount(result.success)
        storeData()
        
        navigation.navigate('main')

      }else if(result.failed){
        ToastAndroid.show(result?.failed,ToastAndroid.SHORT)
      }
      else{
        ToastAndroid.show('nothing',ToastAndroid.SHORT)

      }
      setLoading(false)
      socket.disconnect()
    })
  }
  }

  return (
    <View>
      
      {/* <StatusBar barStyle={'light-content'} backgroundColor={'navy'}/> */}
      <ImageBackground style={[StyleSheet.absoluteFillObject,{width:"100%",height:Dimensions.get('window').height}]} source={require('../../assets/bg2.jpeg')} />
      <View className="w-full h-full items-center justify-center p-10 gap-4" >
        <View style={styles.inputField}>
          <TextInput
            style={styles.inp}
            dataDetectorTypes={"phoneNumber"}
            value={logData.mobile}
            keyboardType="phone-pad"
            onChangeText={(e) => {setLogData({ ...logData, mobile:e})}}
            placeholder="Enter Your Mobile No"
            maxLength={10}
          />
        </View>

        <View style={styles.inputField}>
          <TextInput
            style={styles.inp}
            value={logData.pass}
            secureTextEntry
            onChangeText={(e) => {setLogData({ ...logData, pass:e})}}
            placeholder="Enter Your Password"
            maxLength={16}
          />
        </View>

        <TouchableOpacity onPress={login} disabled={loading?true:false} className="w-10/12 rounded-full mt-10" style={{backgroundColor:'navy'}}>
          { loading? <ActivityIndicator size={30}/> :<Text className="text-white text-center p-4">Login</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  top: {
    height: Dimensions.get("window").height,
  },
  
  
  inputField: {
    backgroundColor: "white",
    marginVertical: "2%",
    borderRadius: 50,
    shadowColor: "gray",
    elevation: 10,
  },

  inp: {
    padding: 10,
    width: Dimensions.get("window").width - 150,
  },

  regBtn: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    top: 10,
  },
  title:{
    fontSize: 35,
    fontWeight: 900,
    color: "navy",
    textAlign: "center",
    textShadowColor:'gray',
    textShadowOffset:{width:3,height:3},
    textShadowRadius:4,

  }
});
