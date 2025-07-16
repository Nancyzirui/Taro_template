import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Product () {
  useLoad(() => {
    console.log('Product page loaded.')
  })

  return (
    <View className='product'>
      <Text>产品页面</Text>
    </View>
  )
}
