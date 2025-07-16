import Taro from '@tarojs/taro'
import { getCurrentPages } from '@tarojs/taro'
import { useAuthStore } from '@/store'

// 性能监控
const logPerformance = (route: string, startTime: number) => {
  const duration = Date.now() - startTime
  console.log(`[路由性能] ${route}: ${duration}ms`)
}

// 错误日志记录
const logError = (error: Error, route: string) => {
  console.error(`[路由错误] ${route}: ${error.message}`)
  Taro.reportMonitor('ROUTE_ERROR', 1)
}

const getAuthState = () => {
  return useAuthStore.getState()
}


// 路由白名单（不需要登录的页面）
const WHITE_LIST = [
  'pages/auth/index',
  'pages/index/index'
]
// 路由黑名单（特定条件下禁止访问的页面）
const BLACK_LIST = [
  'pages/profile/index',  // 示例：个人资料页需要特殊权限
]

const routerInterceptor = (url: string = '') => {
  console.log('怎么个事')
  const startTime = Date.now()

  try {
    // 获取当前页面路径
    const pages = getCurrentPages()
    if (!pages || pages.length === 0) {
      logPerformance('root', startTime)
      return true // 默认允许访问
    }
    const currentPage = pages[pages.length - 1]
    const route = currentPage?.route || ''
    console.log(`[路由拦截] 当前路由: ${route}`)

  // 检查是否在黑名单中
  if (BLACK_LIST.includes(route)) {
    // 检查是否已经在授权页面
    if (route !== 'pages/auth/index') {
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/auth/index',
          success: () => {
            // 记录原始目标页面，登录后可以跳转回来
            const pages = getCurrentPages()
            if (pages.length > 1) {
              Taro.setStorageSync('originalRoute', pages[pages.length - 2].route)
            }
          }
        })
      }, 1000)
    }
    return false
  }

  // 检查是否在白名单中
  if (WHITE_LIST.includes(route)) {
    return true
  }

  // 从状态管理获取登录状态和用户权限
  const { isLoggedIn, authToken, userRoles } = getAuthState()
  if (!isLoggedIn || !authToken) {
    // 检查是否已经在授权页面
    if (route !== 'pages/auth/index') {
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/auth/index',
          success: () => {
            // 记录原始目标页面，登录后可以跳转回来
            const pages = getCurrentPages()
            if (pages.length > 1) {
              Taro.setStorageSync('originalRoute', pages[pages.length - 2].route)
            }
          }
        })
      }, 1000)
    }
    return false
  }

  // 检查是否有原始目标页面需要跳转
  const originalRoute = Taro.getStorageSync('originalRoute')
  if (originalRoute) {
    try {
      Taro.removeStorageSync('originalRoute')
      console.log(`[路由恢复] 跳转回原始页面: ${originalRoute}`)
      Taro.navigateTo({
        url: `/${originalRoute}`,
        fail: (err) => {
          logError(err, originalRoute)
          // 跳转失败时返回首页
          Taro.switchTab({ url: '/pages/index/index' })
        }
      })
    } catch (error) {
      logError(error, 'route-recovery')
    }
  }

  logPerformance(route, startTime)
  return true
  } catch (error) {
    logError(error, 'router-interceptor')
    return false
  }
}
export default routerInterceptor
