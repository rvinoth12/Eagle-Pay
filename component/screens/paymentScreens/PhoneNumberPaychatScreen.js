import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const PhoneNumberPayChatScreen = ({route}) => {
    console.log("log",route.params)
  return (
    <>
    <View style={{backgroundColor:"navy"}} className="p-4 flex-row items-center justify-between ">
      <View className="flex-row items-center gap-8">
      <View className="bg-amber-600 flex-row justify-center w-16 h-16 items-center rounded-full">
        <Text className="text-4xl text-gray-200 font-extrabold  ">{route?.params?.name.slice(0,1)}</Text>
      </View>
      <View>
        <Text className='text-2xl font-extrabold text-gray-200'>{route?.params?.name}</Text>
        <Text className='text-sm  text-gray-300'>{route?.params?.phoneNumbers[0]?.number || route.params?.phoneNumbers[1]?.number}</Text>
      </View>
      </View>
    </View>

    <ScrollView>
    

          <View  className="flex-row justify-end mr-5 p-3 py-5 ">
           <View className="bg-white p-5 rounded-lg" style={{shadowColor:'black',elevation:8}}>
            <Text className="text-3xl">&#8377; 1000</Text>
            <View className="flex-row items-baseline gap-3 mb-2">
            {/* <Text className={`text-lg ${item?.Status==="success"?"text-green-700":"text-red-600"}`}>success</Text> */}
            <Text className="text-gray-500">12:00</Text>
            </View>
           </View>
          </View>
   
    
    
    </ScrollView>
    

</>
  )
}

export default PhoneNumberPayChatScreen