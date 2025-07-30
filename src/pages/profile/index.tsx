import { View, Text, Image } from '@tarojs/components'
import { AuthWrapper } from '../../utils/authWrapper'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

function ProfilePage() {
  useLoad(() => {
    console.log('Profile page loaded.')
  })

  return (
    <View className='profile'>
      {/* 用户信息区域 */}
      <View className='user-card'>
        <Image
          src='https://picsum.photos/300/400'
          className='avatar'
          mode='aspectFill'
        />
        <View className='user-meta'>
          <Text className='nickname'>用户名</Text>
          <Text className='member-level'>黄金会员</Text>
        </View>
      </View>

      {/* 订单入口区域 */}
      <View className='action-grid'>
        <View className='action-item'>
          <View className='action-badge'>2</View>
          {/* <Image
            src='https://picsum.photos/300/400'
            className='action-icon'
            mode='aspectFill'
          /> */}
          <Text className='action-label'>商品订单</Text>
        </View>
        <View className='action-item'>
          <View className='action-badge'>5</View>
          {/* <Image
            src='https://picsum.photos/300/400'
            className='action-icon'
            mode='aspectFill'
          /> */}
          <Text className='action-label'>权益订单</Text>
        </View>
      </View>

      {/* 功能列表 */}
      <View className='feature-list'>
        {/* <View className='feature-item'>
          <Image
            src='https://picsum.photos/300/400'
            className='feature-icon'
          />
          <Text className='feature-title'>商品订单</Text>
          <Image
            src='https://picsum.photos/300/400'
            className='arrow'
          />
        </View>
        <View className='feature-item'>
          <Image
            src='https://picsum.photos/300/400'
            className='feature-icon'
          />
          <Text className='feature-title'>权益订单</Text>
          <Image
            src='https://picsum.photos/300/400'
            className='arrow'
          />
        </View> */}
        <View className='feature-item'>
          <Image
            src='https://picsum.photos/300/400'
            className='feature-icon'
          />
          <Text className='feature-title'>在线客服</Text>
          <Text className='feature-desc'>24小时为您服务</Text>
          <Image
            src='https://picsum.photos/300/400'
            className='arrow'
          />
        </View>
        <View className='feature-item'>
          <Image
            src='https://picsum.photos/300/400'
            className='feature-icon'
          />
          <Text className='feature-title'>客服电话</Text>
          <Text className='feature-desc'>400-888-8888</Text>
          <Image
            src='https://picsum.photos/300/400'
            className='arrow'
          />
        </View>
      </View>
    </View>
  )
}

export default AuthWrapper(ProfilePage)
