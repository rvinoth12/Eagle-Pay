import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';

const PayPhoneNumber = () => {
  const navigation = useNavigation();

  const [contacts,setContact] = useState();
  const [input,setInput] = useState('');
  const [oldState, setOldState] = useState([]);
  const [states, setState] = useState([]);

  const contactList=async() => {

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contact = data;
          
          setOldState(contact);
          console.log(contact[0].phoneNumbers[0].number)
        }
      }
    }
    useEffect(()=>{
      contactList()
    },[])

    const onChangeTextHandler = (e)=>{
      setInput(e)
      console.log("input",e)
    if (e == "") {
      setState(oldState);
    } else {
      let temp = oldState.filter((item,index) => {
        if(item?.phoneNumbers != undefined && item != undefined){
        console.log('number',oldState[index]?.phoneNumbers)
      console.log("input",e)
      // console.log('number',item)
        return  item?.name.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.phoneNumbers[0]?.number.indexOf(e) > -1 ;
    }});
      setState(temp);
    }
  }


  // chat screen

  const chatScreen = (item)=>{
    navigation.navigate('PhoneNumberPayChatScreen',item);
  }
  return (
    <View style={{marginHorizontal:"5%",marginVertical:'5%'}}>
      <View style={{gap:10}}>
        <Text style={{fontSize:22}} >Enter a phone number or Name</Text>
        <Text style={{fontSize:12,color:'gray'}}>Pay someone using a UPI verified phone number</Text>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View style={{marginTop:10,gap:10,width:"90%",borderWidth:1,flexDirection:'row',alignItems:'center',borderColor:'lightgray'}}>
          <Image style={{width:40,height:30,marginLeft:10}} source={require('../../../assets/PayIcon/indFlag3.png')} />
          <TextInput onChangeText={onChangeTextHandler} style={{fontSize:17,paddingLeft:0,padding:10,width:"100%",}} keyboardType='name-phone-pad' placeholder='Enter Mobile Number or Name'/>
        </View>
          <TouchableOpacity onPress={()=>contactList()}>
            <AntDesign  name='contacts' size={30} color={'navy'}/>
          </TouchableOpacity>
        </View>
      </View>

      {/************** Recent section **************/}
      <ScrollView style={{marginVertical:'5%',height:Dimensions.get('window').height - 214}}>
          {
            states?.map((item,index)=>{
              // console.log('nu',item.phoneNumbers[0].number.length == 10)
              if(item?.phoneNumbers != undefined && item?.phoneNumbers[0]?.number?.length >= 10){
              return(
                <TouchableOpacity onPress={()=>{setInput(item?.phoneNumbers[0]?.number?.split('+91')||""),chatScreen(item)}} activeOpacity={0.5} key={index} style={{borderBottomWidth:1,borderColor:'lightgray',paddingBottom:20,marginBottom:10}}>
                  <View style={{gap:5}}>
                    <Text>{item.firstName} {item.middleName} {item.lastName}</Text>
                    <Text>{item?.phoneNumbers[0]?.number}</Text>
                  </View>
                </TouchableOpacity>
              )
            }else{
              if( item?.phoneNumbers != undefined && item?.phoneNumbers[1]?.number?.length >= 10){
                return(
                  <TouchableOpacity onPress={()=>{setInput(item?.phoneNumbers[1]?.number?.split('+91')||""),chatScreen(item)}} activeOpacity={0.5} key={index} style={{borderBottomWidth:1,borderColor:'lightgray',paddingBottom:20,marginBottom:10}}>
                    <View style={{gap:5}}>
                      <Text>{item?.firstName} {item?.middleName} {item?.lastName}</Text>
                      <Text>{item?.phoneNumbers[0]?.number}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            }
            })
          }
      </ScrollView>
      
    </View>
  )
}

export default PayPhoneNumber;

const styles = StyleSheet.create({})


