import Taro, { navigateTo } from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { useAuthStore } from '../store/index'
import { useEffect, useRef } from 'react'

export const AuthWrapper = (Component) => {
  return (props) => {
    const userStore = useAuthStore()
    const instance = getCurrentInstance()
    const navigatingRef = useRef(false)

    const checkAuth = () => {
      const currentPath = instance.router?.path
      // 避免重复导航和首页跳转
      if (!navigatingRef.current &&
          !userStore.isLoggedIn &&
          currentPath &&
          currentPath !== '/pages/index/index') {
        navigatingRef.current = true
        navigateTo({
          url: `/pages/auth/index?redirect=${encodeURIComponent(currentPath)}`,
          success: () => {
            navigatingRef.current = false
          },
          fail: () => {
            navigatingRef.current = false
          }
        })
      }
    }

    // 页面显示事件监听
    Taro.useDidShow(checkAuth)

    useEffect(() => {
      // 初始加载时检查
      checkAuth()

      return () => {
        // 清理事件监听
        Taro.offAppHide?.(checkAuth)
      }
    }, [userStore.isLoggedIn, instance.router?.path])

    if (!userStore.isLoggedIn) {
      return null
    }

    return <Component {...props} />
  }
}
