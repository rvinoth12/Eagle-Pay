import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { io } from 'socket.io-client'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'



const BankTransferPay = ({route}) => {
  const navigation = useNavigation()
  const [paymentStatus,setPaymentStatus] = useState('')
  const [amount,setAmount] = useState(0)
  const [mobileNo,setMobileNo] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [loading,setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [pass,setPass] = useState({1:'',2:'',3:'',4:''})
  const firstRef = useRef()
  const secondRef = useRef()
  const thirdRef = useRef()
  const fourthRef = useRef()

    console.log('route',route.params)
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('mobile');
        console.log('value',value);
        
        if (value !== null) {
          // We have data!!
          setMobileNo(value)
        }
      } catch (error) {
        // Error retrieving data
        console.log('error',error)
      }
    };

    const sendAmount = ()=>{
        setModalVisible(true)
    }

    useEffect(()=>{
      retrieveData()
    },[])

    const enterPass = ()=>{
        if((pass[1].concat(pass[2],pass[3],pass[4]))=="1234"){
          setLoading(true)
          const socket = io('http://192.168.1.17:3000')

          socket.emit('pay_amount', {myMobile:mobileNo,Holder_Name:route?.params?.Holder_Name,Account_No:route.params?.Account_No,IFSC_Code:route.params?.IFSC_Code,Amount : parseInt(amount)})
          socket.on("payment_result",(result)=>{
            console.log('result',result)
            // alert(result)

            if(result?.result == 'success'){
              // alert(result.result)
              setPaymentStatus(result?.result)
              setModalVisible(false)
              setModalVisible2(true)
            }
            else if(result == 'failed'){
              // alert(result.result)
              setPaymentStatus(result)
              setModalVisible(false)
              setModalVisible2(true)

            }
            else{
              alert('no')
            }
            socket.disconnect()
            setLoading(false)
          })    

          // alert('success')
        }
        else{
          alert('wrong')
        }
        setPass({1:'',2:'',3:'',4:''})
    }
    
  return (
    <>
    <View className=" relative h-full">
        <View className="p-4 bg-gray-200 flex-row items-center justify-between ">
          <View className="flex-row items-center gap-8">
          <View className="bg-amber-500 flex-row justify-center w-16 h-16 items-center rounded-full">
            <Text className="text-4xl text-gray-200 font-extrabold  ">{route.params?.Holder_Name.slice(3,4)}</Text>
          </View>
          <View>
            <Text className='text-2xl font-extrabold text-gray-600'>{route.params?.Holder_Name}</Text>
            <Text className='text-sm'>{route.params?.Bank_Name} {route.params?.Account_No?.slice(-4,)}</Text>
          </View>
          </View>

          <TouchableOpacity className="active:bg-red-300" activeOpacity={0.7}>
            <Text className="active:text-red-600">view history</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center gap-2 mt-1' style={{alignItems:'center'}}>
            <Text className='text-6xl top-2' >&#8377;</Text>
            <TextInput inputMode='numeric' className='text-6xl' onChangeText={(e)=>setAmount(e)} autoFocus={true} placeholder='0' placeholderTextColor={'black'}/>
        </View>
        <View className='flex-row justify-center gap-2 mt-1' style={{alignItems:'center'}}>
            <TextInput onChangeText={(e)=>setMsg(e)} className='border-2 p-2 border-gray-200 text-gray-500' placeholder='Add a message (optional)'/>
        </View>
       
      <TouchableOpacity onPress={sendAmount} disabled={(amount<1) ?true:false} className="bg-blue-950 absolute w-full bottom-0" activeOpacity={0.8}>
        <Text className="text-white text-3xl text-center p-4 "><AntDesign name='dingding' size={30} color={'white'} />ENTER</Text>
      </TouchableOpacity>


    </View>
{/* password modal */}
    <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
            Alert.alert(
                'Exit Payment',
                'Are you sure you want to closed payments ?',
                [
                  {text:'No',style:'cancel', onPress:()=>{}},
                  {text:'Yes',style:'destructive',onPress:()=>setModalVisible(false)}
                ])
              
        }}>
        <View className="relative h-full">
            <Text className="p-8 text-center text-lg font-bold">ENTER 4-DIGIT UPI PIN</Text>
          <View className="mt-20 p-8 flex-row gap-5 justify-center">
            <View  className="border-2 h-12 w-12 border-gray-400 rounded-full">
            <TextInput  keyboardType='number-pad' secureTextEntry  underlineColorAndroid="transparent" caretHidden
              value={pass[1]}
              onChangeText={(text)=> {
                setPass({...pass,1:text})
                text && secondRef.current.focus()
              }}
              ref={firstRef} 
              className={` ${pass[1]!=""?'bg-blue-500':''} w-full h-full border-4 border-white text-transparent  text-2xl text-center rounded-full`} 
              maxLength={1} autoFocus 
            />
            </View>

            <View className="border-2 h-12 w-12 border-gray-400 rounded-full">
            <TextInput  keyboardType='number-pad' secureTextEntry  underlineColorAndroid="transparent" caretHidden
              value={pass[2]}
              onChangeText={(text)=> {
                setPass({...pass,2:text})
                text? thirdRef.current.focus() : firstRef.current.focus()} }
              ref={secondRef}
              className={`${pass[2]!=""?'bg-blue-500':''} w-full h-full border-4 border-white text-transparent text-2xl text-center rounded-full `}
              maxLength={1}
            />
              
            </View>

            <View  className="border-2 h-12 w-12 border-gray-400 rounded-full">
            <TextInput  keyboardType='number-pad' secureTextEntry  underlineColorAndroid="transparent" caretHidden
              value={pass[3]}
              onChangeText={(text)=> {
                setPass({...pass,3:text})
                text? fourthRef.current.focus() : secondRef.current.focus()} }
              ref={thirdRef} 
              className={`${pass[3]!=""?'bg-blue-500':''} w-full h-full border-4 border-white text-transparent text-2xl text-center rounded-full`}
              maxLength={1} 

            />
            </View>

            <View  className="border-2 h-12 w-12 border-gray-400 rounded-full">
            <TextInput  keyboardType='number-pad' secureTextEntry  underlineColorAndroid="transparent" caretHidden
              value={pass[4]}
              onChangeText={(text)=> {
                setPass({...pass,4:text})
                !text && thirdRef.current.focus()}}
              ref={fourthRef}
              className={`${pass[4]!=""?'bg-blue-500':''} w-full h-full border-4 border-white text-2xl text-transparent text-center rounded-full`}
              maxLength={1} 
            />
            </View>

          </View>
          <TouchableOpacity onPress={enterPass} className="bg-blue-950 absolute w-full bottom-0" activeOpacity={0.8}>
          { loading ? <ActivityIndicator size={50} className="p-4"/> :<Text className="text-white text-3xl text-center p-4 "><AntDesign name='dingding' size={30} color={'white'} />PAY</Text>}
        </TouchableOpacity>
        </View>
    </Modal>

{/* success or failed modal  */}
<Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible2}
        onRequestClose={() => {
            Alert.alert(
                'Exit Payment',
                'Are you sure you want to closed payments ?',
                [
                  {text:'No',style:'cancel', onPress:()=>{}},
                  {text:'Yes',style:'destructive',onPress:()=>setModalVisible2(false)}
                ])
              
        }}>
        <View className="h-full" style={{display:"flex"}}>
          <View className=" items-center"  style={{marginTop:'25%'}}>
           <View className="gap-2 items-center" >
           {paymentStatus=="success"&& <AntDesign name='checkcircleo' color={'green'} size={200} />}
           {paymentStatus == 'failed' && <AntDesign name='closecircleo' color={'red'} size={200} />}
            <Text className="text-lg text-gray-700 font-bold">{route.params?.Bank_Name} {route.params?.Account_No?.slice(-4,)}</Text>
            <Text className="text-xl text-gray-700 font-bold">{route.params?.Holder_Name}</Text>
            <Text className="text-5xl pt-7">&#8377; {amount}</Text>
            <Text className="text-base pb-5">{msg}</Text>

           { paymentStatus=="success" &&  <Text className="font-bold sm:text-lg text-2xl">Transaction Successful</Text>}
            {paymentStatus=="failed"&& <Text className="font-bold sm:text-lg  text-2xl">Transaction Failed</Text>}
           </View>
            
            <TouchableOpacity onPress={()=>{setModalVisible2(false),navigation.navigate('Home',{mobile:mobileNo})}} style={{marginTop:'20%'}} className=" bg-blue-950 w-44 rounded-full" activeOpacity={0.8}>
              <Text className="text-white text-lg text-center p-3 "><AntDesign name='dingding' size={25} color={'white'} />Done</Text>
            </TouchableOpacity>
          </View>

        </View>
    </Modal>
    </>
  )
}

export default BankTransferPay