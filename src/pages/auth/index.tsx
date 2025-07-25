import { View, Button } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import { commonService } from '@/services/common'
import './index.scss'

export default function Auth () {
  const [loading, setLoading] = useState(false)
  const { setUserInfo, setLoginStatus, setAuthToken, isLoggedIn } = useAuthStore()

  // 页面准备就绪后设置标题
  useReady(() => {
    Taro.setNavigationBarTitle({ title: '授权登录' })
  })

  useEffect(() => {
    return () => {
      if (isLoggedIn) {
        Taro.navigateBack()
      } else {
        Taro.switchTab({ url: '/pages/index/index' })
      }
    }
  }, [isLoggedIn])

  const handleLogin = async () => {
    const loadingTask = Taro.showLoading({ title: '登录中...', mask: true })
    try {
      // 并行执行获取用户信息和登录code
      const [userProfile, loginRes] = await Promise.all([
        new Promise<{ nickName: string; avatarUrl: string }>((resolve, reject) => {
          Taro.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
              resolve({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl
              })
            },
            fail: reject
          })
        }),
        Taro.login()
      ])

      if (!loginRes.code) {
        throw new Error('获取登录信息失败')
      }

      // 调用登录接口获取token（传递用户信息和登录code）
      const { token } = await commonService.ttLogin(
        loginRes.code,
        loginRes.anonymousCode,
        {
          extraData: {
            nickName: userProfile.nickName,
            avatarUrl: userProfile.avatarUrl
          }
        }
      )
      setAuthToken(token)
      setLoginStatus(true)
      setUserInfo({
        nickname: userProfile.nickName,
        avatar: userProfile.avatarUrl
      })

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
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败: ' + (error.message || '未知错误'),
        icon: 'none'
      })
    } finally {
      Taro.hideLoading()
    }

  }

  return (
    <View className='auth'>
      <Button
        type='primary'
        onClick={handleLogin}
        className='login-btn'
      >
        授权登录
      </Button>
    </View>
  )
}
