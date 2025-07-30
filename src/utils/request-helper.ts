import request from './request'
import Taro from '@tarojs/taro'
import type { BaseResponse } from '@/services/types'

interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

export interface RequestOptions {
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 失败重试次数 */
  retryCount?: number
  /** 自定义加载提示文本 */
  loadingText?: string
}

/**
 * 增强型请求方法
 * @param config 请求配置
 * @param options 请求选项
 * @returns 响应数据
 */
export const enhanceRequest = <T>(
  config: RequestConfig,
  options: RequestOptions = {}
): Promise<BaseResponse<T>> => {
  const {
    showLoading = true,
    retryCount = 0,
    loadingText = '加载中...'
  } = options

  let retry = 0

  const executeRequest = (): Promise<BaseResponse<T>> => {
    // 显示加载状态
    if (showLoading) {
      Taro.showLoading({
        title: loadingText,
        mask: true
      })
    }

    // 注入token
    const token = Taro.getStorageSync('token')
    const enhancedConfig = {
      ...config,
      header: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.header
      }
    }

    // 添加请求日志
    console.log(`[API] ${config.method} ${config.url}`, config.data)

    const startTime = Date.now()

    return request(enhancedConfig)
      .then((res: BaseResponse<T>) => {
        // 性能监控
        const duration = Date.now() - startTime
        console.log(`[API] ${config.url} completed in ${duration}ms`)

        if (res.code !== 200) {
          throw new Error(res.message || 'Request failed')
        }
        return res as BaseResponse<T>
      })
      .finally(() => {
        Taro.hideLoading()
      })
  }

  const requestWithRetry = async (): Promise<BaseResponse<T>> => {
    try {
      return await executeRequest()
    } catch (err) {
      if (retry < retryCount) {
        retry++
        console.log(`[API] Retry ${retry}/${retryCount} ${config.url}`)
        return requestWithRetry()
      }
      console.error('[API] Error:', err)
      Taro.showToast({
        title: err.message || '请求失败',
        icon: 'none'
      })
      throw err
    }
  }

  return requestWithRetry()
}
