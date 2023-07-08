import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'

const IndividualPaymentHistory = ({route}) => {
console.log("hii",route.params.data)

  return (
    <>
        <View style={{backgroundColor:"navy"}} className="p-4 flex-row items-center justify-between ">
          <View className="flex-row items-center gap-8">
          <View className="bg-amber-500 flex-row justify-center w-16 h-16 items-center rounded-full">
            <Text className="text-4xl text-gray-200 font-extrabold  ">{route.params?.data[0]?.Holder_Name?.slice(3,4)}</Text>
          </View>
          <View>
            <Text className='text-2xl font-extrabold text-gray-200'>{route.params?.data[0]?.Holder_Name}</Text>
            <Text className='text-sm  text-gray-300'>XXXXXXXXX{route.params?.data[0]?.Account_No?.slice(-4,)}</Text>
          </View>
          </View>
        </View>

        <ScrollView>
        {
            route.params?.data?.map((item,index)=>{

              return(
              <View key={index} className="flex-row justify-end mr-5 p-3 py-5 ">
               <View className="bg-white p-5 rounded-lg" style={{shadowColor:'black',elevation:8}}>
                <Text className="text-3xl">&#8377; {item?.Amount}</Text>
                <View className="flex-row items-baseline gap-3 mb-2">
                <Text className={`text-lg ${item?.Status==="success"?"text-green-700":"text-red-600"}`}>{item?.Status}</Text>
                <Text className="text-gray-500">{item?.Time}</Text>
                </View>
               </View>
              </View>
              )
            })
          }
        </ScrollView>
        

    </>
  )
}

export default IndividualPaymentHistory