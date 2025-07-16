import { enhanceRequest } from '@/utils/request-helper'
import type { SampleData } from './types'

// 通用API服务
export const api = {
  // 通用数据获取
  getData: (params?: Record<string, any>): Promise<SampleData> => {
    return enhanceRequest<SampleData>({
      url: '/api/data',
      method: 'GET',
      data: params
    })
  }

  // 其他通用API...
}
