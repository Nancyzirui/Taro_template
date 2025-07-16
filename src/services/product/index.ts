import { enhanceRequest } from '@/utils/request-helper'
import type { Product } from '@/services/types'
import type { RequestOptions } from '@/utils/request-helper'

// 产品服务
export const productService = {
  // 获取产品列表
  getProducts: (params?: Partial<{
    page: number
    size: number
    keyword: string
  }>, options?: RequestOptions): Promise<Product[]> => {
    return enhanceRequest<Product[]>({
      url: '/api/products',
      method: 'GET',
      data: params
    }, {
      showLoading: false, // 列表页通常自行处理加载状态
      ...options
    })
  },

  // 创建产品
  createProduct: (data: Omit<Product, 'id'>, options?: RequestOptions): Promise<Product> => {
    return enhanceRequest<Product>({
      url: '/api/products',
      method: 'POST',
      data
    }, {
      showLoading: true,
      loadingText: '创建中...',
      retryCount: 1,
      ...options
    })
  },
}
