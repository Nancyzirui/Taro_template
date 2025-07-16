import { View, Text } from '@tarojs/components'
import { AuthWrapper } from '../../utils/authWrapper'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

function ProfilePage() {
  useLoad(() => {
    console.log('Profile page loaded.')
  })

  return (
    <View className='profile'>
      <Text>我的页面</Text>
    </View>
  )
}

export default AuthWrapper(ProfilePage)
