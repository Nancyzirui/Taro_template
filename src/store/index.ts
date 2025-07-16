
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

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  authToken: null,
  userInfo: null,
  setAuthState: (isLoggedIn, authToken) => set({ isLoggedIn, authToken }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setLoginStatus: (status) => set({ isLoggedIn: status }),
  setAuthToken: (token) => set({ authToken: token })
}))

export { useAuthStore, AuthState }
