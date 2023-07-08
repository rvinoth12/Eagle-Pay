import { Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { Audio } from 'expo-av'
const OnBoard = ({navigation}) => {

  // const play = async()=>{
  //   console.log('play');
  //   const {sound} = await Audio.Sound.createAsync({uri:'https://pagalnew.com/download128/37068'}) 
  // }

    setTimeout(()=>{
        navigation.navigate('register')
    },4000)

  return (
    <>
        <StatusBar barStyle={'light-content'} backgroundColor={'#0b2a49'}/>
        <ImageBackground  source={require('../../assets/icons/splash.gif')} style={{width:'100%',height:'100%'}}/>    
        
    </>
  )
}

export default OnBoard;


// (regexEmail.test(logData.email)  && regexPass.test(logData.pass) ) &&

                // (regexEmail.test(regData.email) && regexName.test(regData.name)  && regexPass.test(regData.pass) ) &&







