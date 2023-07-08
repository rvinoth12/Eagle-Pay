import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

export default function QRScanScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      
      if(status === 'granted'){
        setHasPermission(true)
      };
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type,data }) => {
    setScanned(true);
    // setText(data)
    let data1= data?.split('&');
    let upi = data1[0]?.split('pa=')
    let name = data1[1]?.split('pn=')
    setText({upi:upi[1],name:name})

    console.log('Type: '+type + '\nData: '+data1+ '\nData: '+upi[1]+ '\nName: '+name[1])
    navigation.navigate('PhoneNumberPayChatScreen')
  

  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text >No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <>

      {/* <View style={styles.barcodebox}> */}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height:  Dimensions.get('window').height -60, width:  Dimensions.get('window').width +45}} />
      {/* </View> */}
     <View style={{position:'absolute',bottom:70,width:'100%'}}>
        {/* <Text style={styles.maintext}>{text?.upi || text}</Text> */}
        {/* <Text style={styles.maintext}>{text?.name || text}</Text> */}
          {scanned && 
          <TouchableOpacity  style={{top:'10%',alignItems:'center',}} onPress={() => setScanned(false)} >
            <View style={{backgroundColor:'white',borderRadius:50,padding:15}}>
            <Image  style={{width:50,height:50,}}  source={require('../../../assets/HomeIcon/QR.png')} />
            </View>
          </TouchableOpacity>
          }
     </View>
    </>
  );
}

const styles = StyleSheet.create({

  maintext: {
    fontSize: 20,
    color:'white',
    textAlign:'center'
    // margin: 20,
  },
  barcodebox: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: '100%',
    // width: "100%",
    // overflow: 'hidden',
    // borderRadius: 30,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    // zIndex:-1
    
  }
});