
import Taro from '@tarojs/taro'
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  authToken: string | null
  userInfo: any
  setAuthState: (isLoggedIn: boolean, authToken: string | null) => void
  setUserInfo: (userInfo: any) => void
  setLoginStatus: (status: boolean) => void
  setAuthToken: (token: string) => void
}

/**
 * 用户认证状态管理
 * 初始化时会从storage中读取已保存的状态
 */
const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: Taro.getStorageSync('isLoggedIn') || false,
  authToken: Taro.getStorageSync('authToken') || null,
  userInfo: Taro.getStorageSync('userInfo') || null,
  setAuthState: (isLoggedIn, authToken) => {
    Taro.setStorageSync('isLoggedIn', isLoggedIn)
    Taro.setStorageSync('authToken', authToken)
    set({ isLoggedIn, authToken })
  },
  setUserInfo: (userInfo) => {
    Taro.setStorageSync('userInfo', userInfo)
    set({ userInfo })
  },
  setLoginStatus: (status) => {
    Taro.setStorageSync('isLoggedIn', status)
    set({ isLoggedIn: status })
  },
  setAuthToken: (token) => {
    Taro.setStorageSync('authToken', token)
    set({ authToken: token })
  }
}))

export { useAuthStore, AuthState }
