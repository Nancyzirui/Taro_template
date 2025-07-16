import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
    Taro.startPullDownRefresh()
  })

  return (
    <View className='index'>
      <Text>首页</Text>
    </View>
  )
}
