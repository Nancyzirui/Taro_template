import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import './index.scss'

export default function Auth () {
  const [loading, setLoading] = useState(false)
  const { setUserInfo, setLoginStatus, setAuthToken, isLoggedIn } = useAuthStore()

  useEffect(() => {
    // 使用标准返回按钮实现
    Taro.setNavigationBarTitle({ title: '授权登录' })
    return () => {
      if (isLoggedIn) {
        Taro.navigateBack()
      } else {
        Taro.switchTab({ url: '/pages/index/index' })
      }
    }
  }, [isLoggedIn])

  const handleLogin = () => {
    setLoading(true)
    Taro.login({
      success: (res) => {
        if (res.code) {
          // 模拟获取用户信息
          const userInfo = {
            nickname: '微信用户',
            avatar: 'https://picsum.photos/100'
          }

          // 更新zustand store
          setUserInfo(userInfo)
          setLoginStatus(true)
          setAuthToken(res.code)

          Taro.showToast({ title: '登录成功', icon: 'success' })
          const { router } = Taro.getCurrentInstance()
          const redirect = router?.params?.redirect
          if (redirect) {
            Taro.redirectTo({
              url: decodeURIComponent(redirect)
            })
          } else {
            Taro.navigateBack()
          }
        } else {
          Taro.showToast({ title: '登录失败', icon: 'none' })
        }
      },
      complete: () => {
        setLoading(false)
      }
    })
  }

  return (
    <View className='auth'>
      <Button
        type='primary'
        onClick={handleLogin}
        className='login-btn'
      >
        微信一键登录
      </Button>
    </View>
  )
}
