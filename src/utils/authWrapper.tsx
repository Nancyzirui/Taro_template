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
          currentPath !== '/pages/index/index' &&
          currentPath !== '/pages/auth/index') { // 新增：避免重复跳转到授权页
        navigatingRef.current = true
        navigateTo({
          url: `/pages/auth/index?redirect=${encodeURIComponent(currentPath)}`,
          complete: () => {
            navigatingRef.current = false
          }
        })
      }
    }

    // 仅保留页面显示事件监听
    Taro.useDidShow(checkAuth)

    if (!userStore.isLoggedIn) {
      return null
    }

    return <Component {...props} />
  }
}
